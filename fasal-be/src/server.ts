import app from './app';
import { config, validateConfig } from './config';

// Validate configuration on startup
try {
  validateConfig();
  console.log('✅ Configuration validated successfully');
} catch (error) {
  console.error('❌ Configuration validation failed:', error instanceof Error ? error.message : error);
  process.exit(1);
}

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
🚀 Smart Crop Advisory API Server Started
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌾 Environment: ${config.nodeEnv}
📡 Port: ${PORT}
🔗 URL: http://localhost:${PORT}
🏥 Health Check: http://localhost:${PORT}/health
📖 API Info: http://localhost:${PORT}/api/crop-advisory/info
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  server.close(() => {
    process.exit(1);
  });
});

export default server;
