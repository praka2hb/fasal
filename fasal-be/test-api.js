// Simple test script to verify the API is working
const http = require('http');
const fs = require('fs');

const sampleRequest = JSON.parse(fs.readFileSync('./examples/sample-request.json', 'utf8'));

const testHealthCheck = () => {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/health',
      method: 'GET',
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Health Check:', res.statusCode === 200 ? 'PASSED' : 'FAILED');
        console.log('Response:', JSON.parse(data));
        resolve();
      });
    });
    
    req.on('error', reject);
    req.end();
  });
};

const testCropAdvisory = () => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(sampleRequest);
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/crop-advisory',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('\n🌾 Crop Advisory Test:', res.statusCode === 200 ? 'PASSED' : 'FAILED');
        const response = JSON.parse(data);
        if (response.success) {
          console.log('Primary Recommendation:', response.data.primaryRecommendation.cropName);
          console.log('Confidence:', response.data.primaryRecommendation.confidence + '%');
        } else {
          console.log('Error:', response.error.message);
        }
        resolve();
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

async function runTests() {
  console.log('🧪 Testing Smart Crop Advisory API...\n');
  
  try {
    await testHealthCheck();
    await testCropAdvisory();
    console.log('\n✨ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  }
}

runTests();
