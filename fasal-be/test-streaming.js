// Test script for streaming crop advisory API
const http = require('http');
const fs = require('fs');

const sampleRequest = JSON.parse(fs.readFileSync('./examples/sample-request.json', 'utf8'));

function testStreamingAPI() {
  console.log('🚀 Testing Streaming Crop Advisory API...\n');

  const postData = JSON.stringify(sampleRequest);

  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/crop-advisory/stream',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
      'Accept': 'text/event-stream',
      'Cache-Control': 'no-cache',
    },
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    console.log(`📝 Content-Type: ${res.headers['content-type']}`);
    console.log('\n📋 Streaming Response:\n');

    let buffer = '';

    res.on('data', (chunk) => {
      buffer += chunk.toString();

      // Process complete SSE messages
      const messages = buffer.split('\n\n');
      buffer = messages.pop(); // Keep incomplete message in buffer

      for (const message of messages) {
        if (message.trim()) {
          console.log('--- Event ---');
          console.log(message);
          console.log('');
        }
      }
    });

    res.on('end', () => {
      console.log('✅ Stream ended');
      console.log('\n🎉 Streaming test completed!');
    });
  });

  req.on('error', (error) => {
    console.error('❌ Request failed:', error.message);
    console.log('\n💡 Make sure the server is running: npm run dev');
  });

  req.write(postData);
  req.end();
}

// Alternative: Test with curl command
function printCurlCommand() {
  console.log('\n🔧 Alternative: Test with curl command:');
  console.log('curl -X POST http://localhost:3000/api/crop-advisory/stream \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -H "Accept: text/event-stream" \\');
  console.log('  -d @examples/sample-request.json');
}

testStreamingAPI();
setTimeout(printCurlCommand, 1000);
