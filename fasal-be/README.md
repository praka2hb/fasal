# Smart Crop Advisory System - Backend API

A TypeScript Express.js backend that integrates with Google's Gemini AI to provide intelligent crop recommendations based on soil, climate, and farming conditions.

## 🌾 Features

- **AI-Powered Recommendations**: Uses Google Gemini AI for intelligent crop analysis
- **Comprehensive Input Validation**: Validates soil data, climate conditions, and farming details
- **Smart Analysis**: Considers multiple factors including:
  - Soil composition (pH, NPK, organic matter)
  - Climate conditions (temperature, rainfall, humidity)
  - Farming experience and resources
  - Budget and farm size
  - Sustainability preferences
- **Multiple Recommendations**: Provides primary and alternative crop suggestions
- **Risk Assessment**: Evaluates potential risks and profitability
- **Seasonal Advice**: Tailored recommendations based on current season

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API Key

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

3. **Build and run:**
   ```bash
   # Development mode
   npm run dev

   # Production build
   npm run build
   npm start
   ```

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime.

### API Information
```
GET /api/crop-advisory/info
```
Returns API documentation and required data structure.

### Crop Recommendation
```
POST /api/crop-advisory
```

**Request Body Example:**
```json
{
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "region": "Delhi, India"
  },
  "soilData": {
    "ph": 7.2,
    "nitrogen": 45,
    "phosphorus": 23,
    "potassium": 56,
    "organicMatter": 3.2,
    "soilType": "loamy"
  },
  "climate": {
    "averageTemperature": 25,
    "rainfall": 600,
    "humidity": 65,
    "season": "monsoon"
  },
  "farmingDetails": {
    "farmSize": 5.5,
    "budget": 50000,
    "experience": "intermediate",
    "irrigationAvailable": true,
    "previousCrops": ["wheat", "rice"]
  },
  "preferences": {
    "cropType": "both",
    "sustainabilityFocus": true,
    "organicFarming": false
  }
}
```

**Response Example:**
```json
{
  "success": true,
  "data": {
    "primaryRecommendation": {
      "cropName": "Rice",
      "variety": "Basmati 370",
      "confidence": 85,
      "expectedYield": "4-5 tons per hectare",
      "plantingTime": "June-July",
      "harvestTime": "October-November",
      "marketPrice": "$300-400 per ton",
      "profitability": "high",
      "riskLevel": "medium",
      "waterRequirement": "High (flooding method)",
      "fertilizer": {
        "type": "NPK 20:20:20",
        "quantity": "200kg per hectare",
        "schedule": "Split application at tillering and panicle initiation"
      },
      "pestManagement": ["Brown plant hopper control", "Blast disease prevention"],
      "suitabilityScore": 88
    },
    "alternativeRecommendations": [...],
    "seasonalAdvice": "Monsoon season is ideal for rice cultivation...",
    "sustainabilityTips": ["Implement SRI method", "Use organic fertilizers"],
    "riskFactors": ["Flood risk", "Price volatility"],
    "additionalNotes": "Consider crop insurance for risk mitigation"
  },
  "metadata": {
    "timestamp": "2025-01-01T12:00:00.000Z",
    "requestId": "req_1234567890_xyz",
    "analysisVersion": "1.0"
  }
}
```

## 🛠️ Development

### Project Structure
```
src/
├── config/           # Configuration files
├── controllers/      # Route handlers
├── middleware/       # Custom middleware
├── routes/          # Route definitions
├── services/        # Business logic & external APIs
├── types/           # TypeScript type definitions
├── app.ts           # Express app setup
└── server.ts        # Server entry point
```

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory

### Input Validation

The API validates all inputs using Joi schema validation:

- **Location**: Valid coordinates and region name
- **Soil Data**: pH (0-14), NPK percentages (0-100%), soil type
- **Climate**: Temperature (-50 to 60°C), rainfall (0-10000mm), humidity (0-100%)
- **Farming Details**: Farm size, budget, experience level, irrigation status
- **Preferences**: Optional sustainability and organic farming preferences

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes | - |
| `PORT` | Server port | No | 3000 |
| `NODE_ENV` | Environment mode | No | development |
| `ALLOWED_ORIGINS` | CORS allowed origins | No | http://localhost:3000 |

### Getting Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file

## 🔒 Security Features

- **Helmet.js**: Security headers
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses
- **Request Limits**: Body size limits

## 🌱 Sustainability Focus

The system prioritizes:
- Water-efficient crops for drought-prone areas
- Soil health improvement recommendations
- Organic farming techniques when requested
- Crop rotation suggestions
- Integrated pest management

## 📊 AI Integration

The Gemini AI integration:
- Processes complex agricultural data
- Considers regional farming practices
- Provides confidence scores for recommendations
- Adapts to farmer experience levels
- Includes market and economic analysis

## 🚨 Error Handling

The API provides detailed error responses:
- `400` - Validation errors with field-specific messages
- `503` - External API errors (Gemini unavailable)
- `500` - Internal server errors

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the API info endpoint: `/api/crop-advisory/info`
- Review the health check: `/health`
- Examine request/response examples above

---

**Built with 🌾 for modern agriculture**
