const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  // Établir une nouvelle connexion Socket.io
  const socket = io();

  socket.emit('message', 'Connexion établie !');
  // Envoyer une réponse à la requête GET
  res.send('Requête GET reçue');
});

io.on('connection', (socket) => {
  console.log('Nouvelle connexion établie');

  // Envoyer un message à la nouvelle connexion
  socket.emit('message', 'Connexion établie !');
});

http.listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
