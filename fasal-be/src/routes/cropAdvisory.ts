import { Router } from 'express';
import { CropAdvisoryController } from '../controllers/cropAdvisoryController';
import { validateCropAdvisoryRequest } from '../middleware/validation';

const router = Router();
const cropAdvisoryController = new CropAdvisoryController();

// POST /api/crop-advisory - Get crop recommendation (regular)
router.post(
  '/',
  validateCropAdvisoryRequest,
  cropAdvisoryController.getCropRecommendation.bind(cropAdvisoryController)
);

// POST /api/crop-advisory/stream - Get crop recommendation (streaming)
router.post(
  '/stream',
  validateCropAdvisoryRequest,
  cropAdvisoryController.getCropRecommendationStream.bind(cropAdvisoryController)
);

// GET /api/info - Get API information
router.get('/info', cropAdvisoryController.getApiInfo.bind(cropAdvisoryController));

export default router;
