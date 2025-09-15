import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { CropAdvisoryRequest, CropAdvisoryResponse } from '../types';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: config.gemini.model });
  }

  async getCropRecommendation(requestData: CropAdvisoryRequest): Promise<CropAdvisoryResponse> {
    try {
      const prompt = this.buildPrompt(requestData);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return this.parseGeminiResponse(text, requestData);
    } catch (error) {
      throw new Error(`Gemini API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCropRecommendationStream(requestData: CropAdvisoryRequest): Promise<ReadableStream> {
    try {
      const prompt = this.buildPrompt(requestData);

      // Use streaming generation
      const result = await this.model.generateContentStream(prompt);

      // Bind methods to maintain context
      const parsePartialResponse = this.parsePartialResponse.bind(this);
      const parseGeminiResponse = this.parseGeminiResponse.bind(this);

      // Create a readable stream that emits chunks
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = '';

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              fullResponse += chunkText;

              // Try to parse partial JSON responses
              const partialResponse = parsePartialResponse(fullResponse, requestData);

              if (partialResponse) {
                const data = `data: ${JSON.stringify({
                  type: 'partial',
                  data: partialResponse,
                  timestamp: new Date().toISOString()
                })}\n\n`;

                controller.enqueue(new TextEncoder().encode(data));
              }
            }

            // Send final complete response
            const finalResponse = parseGeminiResponse(fullResponse, requestData);
            const finalData = `data: ${JSON.stringify({
              type: 'complete',
              data: finalResponse,
              timestamp: new Date().toISOString()
            })}\n\n`;

            controller.enqueue(new TextEncoder().encode(finalData));

            // Send end signal
            controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'));
            controller.close();

          } catch (error) {
            controller.error(error);
          }
        }
      });

      return stream;
    } catch (error) {
      throw new Error(`Gemini streaming API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(data: CropAdvisoryRequest): string {
    return `
You are an expert agricultural advisor. Based on the following farm data, provide a comprehensive crop recommendation analysis:

**Location Information:**
- Region: ${data.location.region}
- Coordinates: ${data.location.latitude}, ${data.location.longitude}

**Soil Analysis:**
- pH Level: ${data.soilData.ph}
- Nitrogen: ${data.soilData.nitrogen}%
- Phosphorus: ${data.soilData.phosphorus}%
- Potassium: ${data.soilData.potassium}%
- Organic Matter: ${data.soilData.organicMatter}%
- Soil Type: ${data.soilData.soilType}

**Climate Conditions:**
- Average Temperature: ${data.climate.averageTemperature}°C
- Annual Rainfall: ${data.climate.rainfall}mm
- Humidity: ${data.climate.humidity}%
- Current Season: ${data.climate.season}

**Farming Details:**
- Farm Size: ${data.farmingDetails.farmSize} acres
- Budget: $${data.farmingDetails.budget}
- Farmer Experience: ${data.farmingDetails.experience}
- Irrigation Available: ${data.farmingDetails.irrigationAvailable ? 'Yes' : 'No'}
${data.farmingDetails.previousCrops ? `- Previous Crops: ${data.farmingDetails.previousCrops.join(', ')}` : ''}

**Preferences:**
${data.preferences?.cropType ? `- Crop Type Preference: ${data.preferences.cropType}` : ''}
${data.preferences?.sustainabilityFocus ? '- Sustainability Focus: Yes' : ''}
${data.preferences?.organicFarming ? '- Organic Farming: Yes' : ''}

Please provide recommendations in the following JSON format:
{
  "primaryRecommendation": {
    "cropName": "string",
    "variety": "string",
    "confidence": number (0-100),
    "expectedYield": "string with units",
    "plantingTime": "string",
    "harvestTime": "string",
    "marketPrice": "string per unit",
    "profitability": "high/medium/low",
    "riskLevel": "low/medium/high",
    "waterRequirement": "string",
    "fertilizer": {
      "type": "string",
      "quantity": "string",
      "schedule": "string"
    },
    "pestManagement": ["array of pest management strategies"],
    "suitabilityScore": number (0-100)
  },
  "alternativeRecommendations": [
    // 2-3 alternative crops with same structure as primary
  ],
  "seasonalAdvice": "string with seasonal planting advice",
  "sustainabilityTips": ["array of sustainability tips"],
  "riskFactors": ["array of potential risks"],
  "additionalNotes": "string with extra important information"
}

Focus on:
1. Crop suitability for the specific soil and climate conditions
2. Economic viability and market potential
3. Water and resource efficiency
4. Risk assessment (weather, pests, diseases)
5. Sustainable farming practices
6. Specific varieties suited for the region

Provide practical, actionable advice that considers the farmer's experience level and available resources.
`;
  }

  private parseGeminiResponse(text: string, requestData: CropAdvisoryRequest): CropAdvisoryResponse {
    try {
      // Extract JSON from the response text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in Gemini response');
      }

      const parsedData = JSON.parse(jsonMatch[0]);
      
      return {
        success: true,
        data: {
          primaryRecommendation: parsedData.primaryRecommendation,
          alternativeRecommendations: parsedData.alternativeRecommendations || [],
          seasonalAdvice: parsedData.seasonalAdvice || '',
          sustainabilityTips: parsedData.sustainabilityTips || [],
          riskFactors: parsedData.riskFactors || [],
          additionalNotes: parsedData.additionalNotes || '',
        },
        metadata: {
          timestamp: new Date().toISOString(),
          requestId: this.generateRequestId(),
          analysisVersion: '1.0',
        },
      };
    } catch (error) {
      // Fallback: create a structured response from unstructured text
      return this.createFallbackResponse(text, requestData);
    }
  }

  private createFallbackResponse(text: string, requestData: CropAdvisoryRequest): CropAdvisoryResponse {
    // Create a basic structured response when JSON parsing fails
    
    return {
      success: true,
      data: {
        primaryRecommendation: {
          cropName: 'Based on analysis',
          variety: 'Recommended variety',
          confidence: 75,
          expectedYield: 'Variable based on conditions',
          plantingTime: `Suitable for ${requestData.climate.season} season`,
          harvestTime: '3-4 months after planting',
          marketPrice: 'Contact local market',
          profitability: 'medium',
          riskLevel: 'medium',
          waterRequirement: requestData.farmingDetails.irrigationAvailable ? 'Moderate' : 'Low',
          fertilizer: {
            type: 'NPK based on soil analysis',
            quantity: 'As per soil test recommendations',
            schedule: 'Split application during growing season',
          },
          pestManagement: ['Integrated Pest Management', 'Regular monitoring'],
          suitabilityScore: 75,
        },
        alternativeRecommendations: [],
        seasonalAdvice: `For ${requestData.climate.season} season in ${requestData.location.region}`,
        sustainabilityTips: ['Crop rotation', 'Organic matter addition'],
        riskFactors: ['Weather dependency', 'Market fluctuations'],
        additionalNotes: text.substring(0, 500) + '...', // Include original response as notes
      },
      metadata: {
        timestamp: new Date().toISOString(),
        requestId: this.generateRequestId(),
        analysisVersion: '1.0',
      },
    };
  }

  private parsePartialResponse(text: string, requestData: CropAdvisoryRequest): CropAdvisoryResponse | null {
    try {
      // Try to extract partial JSON from the accumulating text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) return null;

      const partialData = JSON.parse(jsonMatch[0]);

      // Check if we have enough data for a meaningful partial response
      if (partialData.primaryRecommendation && partialData.primaryRecommendation.cropName) {
        return {
          success: true,
          data: {
            primaryRecommendation: partialData.primaryRecommendation,
            alternativeRecommendations: partialData.alternativeRecommendations || [],
            seasonalAdvice: partialData.seasonalAdvice || '',
            sustainabilityTips: partialData.sustainabilityTips || [],
            riskFactors: partialData.riskFactors || [],
            additionalNotes: partialData.additionalNotes || '',
          },
          metadata: {
            timestamp: new Date().toISOString(),
            requestId: this.generateRequestId(),
            analysisVersion: '1.0',
          },
        };
      }

      return null;
    } catch (error) {
      return null; // If parsing fails, just return null for partial response
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
