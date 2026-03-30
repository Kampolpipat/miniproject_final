const http = require('http');
const data = JSON.stringify({ username: 'testuser123', password: 'Testpass@123', firstname: 'Test', lastname: 'User' });
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  let buff = '';
  res.on('data', (chunk) => { buff += chunk.toString(); });
  res.on('end', () => {
    console.log('status', res.statusCode);
    console.log('body', buff);
  });
});

req.on('error', console.error);
req.write(data);
req.end();
