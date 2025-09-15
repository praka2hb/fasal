import { Router } from 'express';
import cropAdvisoryRoutes from './cropAdvisory';

const router = Router();

// Mount routes
router.use('/crop-advisory', cropAdvisoryRoutes);

export default router;
