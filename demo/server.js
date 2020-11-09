const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.id = `conn_${Math.random()}`.replace('0.', '');
  ws.on('message', function incoming(message) {
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`${ws.id}:${message}`);
      }
    });
  });
});
