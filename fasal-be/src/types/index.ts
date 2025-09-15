export interface CropAdvisoryRequest {
  location: {
    latitude: number;
    longitude: number;
    region: string;
  };
  soilData: {
    ph: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organicMatter: number;
    soilType: string;
  };
  climate: {
    averageTemperature: number;
    rainfall: number;
    humidity: number;
    season: 'spring' | 'summer' | 'monsoon' | 'winter';
  };
  farmingDetails: {
    farmSize: number;
    budget: number;
    experience: 'beginner' | 'intermediate' | 'expert';
    irrigationAvailable: boolean;
    previousCrops?: string[];
  };
  preferences?: {
    cropType?: 'cash' | 'food' | 'both';
    sustainabilityFocus?: boolean;
    organicFarming?: boolean;
  };
}

export interface CropRecommendation {
  cropName: string;
  variety: string;
  confidence: number;
  expectedYield: string;
  plantingTime: string;
  harvestTime: string;
  marketPrice: string;
  profitability: 'high' | 'medium' | 'low';
  riskLevel: 'low' | 'medium' | 'high';
  waterRequirement: string;
  fertilizer: {
    type: string;
    quantity: string;
    schedule: string;
  };
  pestManagement: string[];
  suitabilityScore: number;
}

export interface CropAdvisoryResponse {
  success: boolean;
  data: {
    primaryRecommendation: CropRecommendation;
    alternativeRecommendations: CropRecommendation[];
    seasonalAdvice: string;
    sustainabilityTips: string[];
    riskFactors: string[];
    additionalNotes: string;
  };
  metadata: {
    timestamp: string;
    requestId: string;
    analysisVersion: string;
  };
}

export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'INTERNAL_SERVER_ERROR'
  | 'NOT_FOUND'
  | 'EXTERNAL_API_ERROR'
  | 'SERVICE_UNAVAILABLE';

export interface ApiError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
  timestamp: string;
}
