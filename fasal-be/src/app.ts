import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200,
}));

// Logging middleware
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Smart Crop Advisory API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Smart Crop Advisory API',
    description: 'AI-powered crop recommendation system using Gemini AI',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api',
      cropAdvisory: '/api/crop-advisory',
      info: '/api/crop-advisory/info',
    },
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
