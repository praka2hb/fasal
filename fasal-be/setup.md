# Setup Guide for Smart Crop Advisory System

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
# Copy the example environment file
cp env.example .env

# Edit .env and add your Gemini API key
# Get your API key from: https://makersuite.google.com/app/apikey
```

### 3. Start the Server
```bash
# Development mode (with hot reload)
npm run dev

# Or build and run production
npm run build
npm start
```

### 4. Test the API
```bash
# Test with the included script
node test-api.js

# Or test manually with curl:
curl http://localhost:3000/health
```

## 🔑 Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env` file:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

## 📝 Sample API Request

Use the provided sample in `examples/sample-request.json` or test with curl:

```bash
curl -X POST http://localhost:3000/api/crop-advisory \
  -H "Content-Type: application/json" \
  -d @examples/sample-request.json
```

## 🔧 Troubleshooting

**Error: "GEMINI_API_KEY environment variable is required"**
- Make sure you've created a `.env` file
- Verify your API key is correctly set in the `.env` file

**Error: "AI service temporarily unavailable"**
- Check your internet connection
- Verify your Gemini API key is valid
- Ensure you haven't exceeded API rate limits

**Port already in use:**
- Change the PORT in your `.env` file
- Or stop other services using port 3000

## 📱 API Endpoints Summary

- `GET /health` - Health check
- `GET /api/crop-advisory/info` - API documentation
- `POST /api/crop-advisory` - Get crop recommendations

## 🎯 Next Steps

1. ✅ Set up your environment
2. ✅ Test the health endpoint
3. ✅ Try the sample crop advisory request
4. 🚀 Integrate with your frontend application
5. 🌱 Start getting AI-powered crop recommendations!

---

Need help? Check the main README.md for detailed documentation.
