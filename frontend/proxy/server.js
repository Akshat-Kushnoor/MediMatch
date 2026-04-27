const http = require('http');
const net = require('net');

const BACKEND_HOST = 'localhost';
const BACKEND_PORT = 8000;
const PROXY_PORT = 3001;

function sendToBackend(message) {
  return new Promise((resolve, reject) => {
    const client = new net.Socket();
    
    client.connect(BACKEND_PORT, BACKEND_HOST, () => {
      client.write(JSON.stringify(message) + '\n');
    });

    let responseData = '';
    
    client.on('data', (data) => {
      responseData += data.toString();
      
      try {
        const response = JSON.parse(responseData.trim());
        client.destroy();
        resolve(response);
      } catch (e) {
        // Continue accumulating data
      }
    });

    client.on('error', (err) => {
      reject(err);
    });

    client.on('timeout', () => {
      client.destroy();
      reject(new Error('Connection timeout'));
    });

    client.setTimeout(5000);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { type, data } = JSON.parse(body);
        console.log(`Proxy forwarding: ${type}`);
        
        const response = await sendToBackend({ type, data });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        
      } catch (e) {
        console.error('Proxy error:', e.message);
        res.writeHead(500);
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PROXY_PORT, () => {
  console.log(`HTTP Proxy server running on port ${PROXY_PORT}`);
  console.log(`Forwarding to backend TCP at ${BACKEND_HOST}:${BACKEND_PORT}`);
});