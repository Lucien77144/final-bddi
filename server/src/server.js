const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const MAX_USERS_PER_ROOM = 2;
const rooms = {};

// Vérifier si une room existe
function findAvailableRoom() {
  for (const roomId in rooms) {
    if (rooms[roomId].length < MAX_USERS_PER_ROOM) {
      return roomId;
    }
  }
  return null;
}

// Créer une nouvelle room avec un identifiant unique
function createRoom() {
  const roomId = Math.random().toString(36).substring(7);
  rooms[roomId] = [];
  return roomId;
}

io.on('connection', (socket) => {
  console.log('Nouvelle connexion :', socket.id);

  // Vérifier si une room est disponible
  const roomId = findAvailableRoom();
  if (roomId) {
    console.log('Utilisateur rejoint la room existante :', roomId);
    socket.join(roomId);
    rooms[roomId].push(socket.id);
  } else {
    // Créer une nouvelle room et rediriger l'utilisateur vers cette room
    console.log('Création d\'une nouvelle room');
    const newRoomId = createRoom();
    socket.join(newRoomId);
    rooms[newRoomId].push(socket.id);
    socket.emit('redirect', '/addRoom');
  }

  socket.on('disconnect', () => {
    console.log('Déconnexion :', socket.id);
    // Retirer l'utilisateur de la room correspondante
    for (const roomId in rooms) {
      const index = rooms[roomId].indexOf(socket.id);
      if (index !== -1) {
        rooms[roomId].splice(index, 1);
        break;
      }
    }
  });
});

server.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});