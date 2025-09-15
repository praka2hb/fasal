import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import { CropAdvisoryRequest } from '../types';

const cropAdvisorySchema = Joi.object({
  location: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    region: Joi.string().min(2).max(100).required(),
  }).required(),

  soilData: Joi.object({
    ph: Joi.number().min(0).max(14).required(),
    nitrogen: Joi.number().min(0).max(100).required(),
    phosphorus: Joi.number().min(0).max(100).required(),
    potassium: Joi.number().min(0).max(100).required(),
    organicMatter: Joi.number().min(0).max(100).required(),
    soilType: Joi.string().valid(
      'clay', 'sandy', 'loamy', 'silt', 'peat', 'chalk', 'mixed'
    ).required(),
  }).required(),

  climate: Joi.object({
    averageTemperature: Joi.number().min(-50).max(60).required(),
    rainfall: Joi.number().min(0).max(10000).required(),
    humidity: Joi.number().min(0).max(100).required(),
    season: Joi.string().valid('spring', 'summer', 'monsoon', 'winter').required(),
  }).required(),

  farmingDetails: Joi.object({
    farmSize: Joi.number().min(0.1).max(10000).required(),
    budget: Joi.number().min(0).required(),
    experience: Joi.string().valid('beginner', 'intermediate', 'expert').required(),
    irrigationAvailable: Joi.boolean().required(),
    previousCrops: Joi.array().items(Joi.string()).optional(),
  }).required(),

  preferences: Joi.object({
    cropType: Joi.string().valid('cash', 'food', 'both').optional(),
    sustainabilityFocus: Joi.boolean().optional(),
    organicFarming: Joi.boolean().optional(),
  }).optional(),
});

export const validateCropAdvisoryRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { error, value } = cropAdvisorySchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
    }));

    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: errorDetails,
      },
      timestamp: new Date().toISOString(),
    });
    return;
  }

  req.body = value as CropAdvisoryRequest;
  next();
};
