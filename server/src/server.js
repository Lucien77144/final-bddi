const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname));


io.on('connection', (socket) => {
  console.log('a user connected');
  
});

server.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(__dirname);
});