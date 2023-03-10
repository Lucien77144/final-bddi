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
let player1Id = null;
let player2Id = null;

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

  /**
   * Role Selection
   * @data {roomId : id, role : urma || heda}
   * @specs - Le rôle envoyé est celui du joueur 1, le rôle du joueur 2 est à attribuer par défaut
   */

  socket.on('roleSelect', (data) => {
    console.log('Role select', data);
    _player1Role = data.role;
    _player2Role = data.role === 'urma' ? 'heda' : 'urma';
    attributeRoles(rooms.find(room => room.id === data.roomId), _player1Role, _player2Role);
  })

  /**
   * Handle movement
   * @description - Gère les mouvements des joueurs, envoie les nouvelles positions aux joueurs
   * @data {roomId : id, position : {x: x, y: y}}
   */

  socket.on('move', (data) => {
    console.log('Move', data);
    let room = rooms.find(room => room.id === data.roomId);
    console.log(room);
    if (room.player1.id === socket.id) {
      room.player1.position = data.position;
    } else if (room.player2.id === socket.id) {
      room.player2.position = data.position;
    }
    // Send to both player
    io.to(room.player1.id).emit('sendPositions', room);
    io.to(room.player2.id).emit('sendPositions', room);
  });

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
    player1: {
      id : clientSocket,
      role: null,
      position: {
        x: 0,
        y: 0,
      }
    },
    player2: null,
  }

  // Attribute player 1 id
  player1Id = clientSocket;

  while (rooms.includes(roomId)) {
    roomId = generateRandomId();
  }

  rooms.push(newRoom);
  // console.log(rooms);

  io.emit('createRoom', roomId);
}

function joinRoom(clientSocket, roomId) {
  // console.log(rooms);
  // Check if room exists
  let room = rooms.find(room => room.id === roomId);
  // console.log(room);
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
      room.player2 = {
        id: clientSocket,
        role: null,
        position: {
          x: 0,
          y: 0,
        }
      };
      player2Id = clientSocket;
      // console.log(rooms);

      // Emit to both players
      io.to(player1Id).emit('joinRoom', {success : room});
      io.to(player2Id).emit('joinRoom', {success : room});

      // Emit role selection to player 1
      io.to(player1Id).emit('selectRole');
    } else {
      console.log('Room is full');
      io.emit('joinRoom', { error: 'Room is full' })
    }
  } else {
    console.log('Room does not exist');
  }
}

function attributeRoles(room, player1Role, player2Role) {
  // Attribute roles to players

  room.player1.role = player1Role;
  room.player2.role = player2Role;
  console.log('Roles attributed');
  console.log(room);

  // Emit roles to players
  io.to(player1Id).emit('role', room.player1.role);
  io.to(player2Id).emit('role', room.player2.role);

  // Emit start movement to players
  io.to(player1Id).emit('startMovement');
  io.to(player2Id).emit('startMovement');
}

http.listen(3000, () => {
  console.log('Le serveur écoute sur le port 3000');
});

/**
 * Users Movements
 */