const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const serveFile = (filePath) => (req, res) => {
  const file = path.join(root, filePath);
  const ext = path.extname(file).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(file, (readErr, content) => {
    if (readErr) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
};

// Port 7000 → index.html
const server1 = http.createServer(serveFile('index.html'));
server1.listen(7000, '0.0.0.0', () => {
  console.log('✓ Port 7000 → http://127.0.0.1:7000 (index.html)');
});
server1.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('✗ Port 7000 is already in use. Kill it with: lsof -ti:7000 | xargs kill -9');
  } else {
    console.error(err);
  }
});

// Port 7001 → admin.html
const server2 = http.createServer(serveFile('admin.html'));
server2.listen(7001, '0.0.0.0', () => {
  console.log('✓ Port 7001 → http://127.0.0.1:7001 (admin.html)');
});
server2.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('✗ Port 7001 is already in use. Kill it with: lsof -ti:7001 | xargs kill -9');
  } else {
    console.error(err);
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Servers starting...\n');

