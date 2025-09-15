import { Request, Response, NextFunction } from 'express';
import { GeminiService } from '../services/geminiService';
import { CropAdvisoryRequest, CropAdvisoryResponse } from '../types';
import { AppError } from '../middleware/errorHandler';

export class CropAdvisoryController {
  private geminiService: GeminiService;

  constructor() {
    this.geminiService = new GeminiService();
  }

  async getCropRecommendation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const requestData: CropAdvisoryRequest = req.body;

      // Validate that we have the required API key
      if (!process.env.GEMINI_API_KEY) {
        throw new AppError('AI service not configured', 503, 'SERVICE_UNAVAILABLE');
      }

      // Get recommendation from Gemini AI
      const recommendation: CropAdvisoryResponse = await this.geminiService.getCropRecommendation(requestData);

      // Log the successful request
      console.log(`[${new Date().toISOString()}] Crop recommendation generated for region: ${requestData.location.region}`);

      res.status(200).json(recommendation);
    } catch (error) {
      next(error);
    }
  }

  async getCropRecommendationStream(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const requestData: CropAdvisoryRequest = req.body;

      // Validate that we have the required API key
      if (!process.env.GEMINI_API_KEY) {
        throw new AppError('AI service not configured', 503, 'SERVICE_UNAVAILABLE');
      }

      // Set headers for Server-Sent Events
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

      // Get streaming recommendation from Gemini AI
      const stream = await this.geminiService.getCropRecommendationStream(requestData);

      // Log the streaming request
      console.log(`[${new Date().toISOString()}] Streaming crop recommendation started for region: ${requestData.location.region}`);

      // Pipe the stream to the response
      const reader = stream.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          res.write(value);
        }

        res.end();
      } catch (error) {
        console.error('Stream reading error:', error);
        res.end();
      }

    } catch (error) {
      console.error('Streaming error:', error);
      if (!res.headersSent) {
        next(error);
      } else {
        res.end();
      }
    }
  }

  async healthCheck(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Smart Crop Advisory API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      services: {
        geminiAI: !!process.env.GEMINI_API_KEY,
      },
    });
  }

  async getApiInfo(_req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        name: 'Smart Crop Advisory API',
        version: '1.0.0',
        description: 'AI-powered crop recommendation system using Gemini AI',
        endpoints: {
          POST: {
            '/api/crop-advisory': 'Get crop recommendations based on farm conditions (JSON response)',
            '/api/crop-advisory/stream': 'Get crop recommendations with streaming response (Server-Sent Events)',
          },
          GET: {
            '/health': 'Health check endpoint',
            '/api/crop-advisory/info': 'API information',
          },
        },
        requiredData: {
          location: 'Geographic coordinates and region',
          soilData: 'Soil composition and pH levels',
          climate: 'Weather and seasonal information',
          farmingDetails: 'Farm size, budget, and experience',
          preferences: 'Optional farming preferences',
        },
      },
      timestamp: new Date().toISOString(),
    });
  }
}
