const express = require('express');
const app = express();
const http = require('http').Server(app);
const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = [];

app.get('/', (req, res) => {
  // Envoyer une réponse à la requête GET
  res.send('Requête GET reçue');
});

io.on('connection', (socket) => {
  console.log('Nouvelle connexion établie');
  // Envoyer un message à la nouvelle connexion
  socket.emit('message', 'Connexion établie !');

  // On Creation Room
  socket.on('createRoom', () => {
    createRoom(socket.id);
  })

  // On Join Room
  socket.on('joinRoom', (roomId) => {
    console.log('Join room', roomId);
    joinRoom(socket.id, roomId);
    })
});

function generateRandomId() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return id;
}

function createRoom(clientSocket) {
  
  let roomId = generateRandomId();

  let newRoom = {
    id: roomId,
    player1: clientSocket,
    player2: null,
  }

  while (rooms.includes(roomId)) {
    roomId = generateRandomId();
  }

  rooms.push(newRoom);
  console.log(rooms);

  io.emit('createRoom', roomId);
}

function joinRoom(clientSocket, roomId) {
  // TODO
  // Check if room exists : DONE
  // Check if room is full : DONE
  // Add player to room
  // Emit to both players
  // Check if player1 != player2
  console.log(rooms);
  // Check if room exists
  let room = rooms.find(room => room.id === roomId);
  console.log(room);
  if (room) {
    // Check if room is full
    if (room.player2 === null) {
      // Check if player1 != player2
      if (room.player1 === clientSocket) {
        console.log('Player 1 cannot join his own room');
        io.emit('joinRoom', { error: 'Player 1 cannot join his own room' })
        return;
      }
      // Add player to room
      room.player2 = clientSocket;
      console.log(rooms);

      // Emit to both players
      io.to(room.player1).emit('joinRoom', {success : room});
      io.to(room.player2).emit('joinRoom', {success : room});
    } else {
      console.log('Room is full');
      io.emit('joinRoom', { error: 'Room is full' })
    }
  } else {
    console.log('Room does not exist');
  }

}

http.listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});
