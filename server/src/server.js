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
  // console.log('Nouvelle connexion établie');
  // Envoyer un message à la nouvelle connexion
  socket.emit('message', 'Connexion établie !');

  // On Creation Room
  socket.on('createRoom', () => {
    createRoom(socket.id);
  })

  // On Join Room
  socket.on('joinRoom', (roomId) => {
    // console.log('Join room', roomId);
    joinRoom(socket.id, roomId);
  })

  /**
   * Role Selection
   * @data {roomId : id, role : urma || heda}
   * @specs - Le rôle envoyé est celui du joueur 1, le rôle du joueur 2 est à attribuer par défaut
   */

  socket.on('roleSelect', (data) => {
    // console.log('Role select', data);
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
    // console.log('Move', data);
    let room = rooms.find(room => room.id === data.roomId);
    // console.log(room);
    if (room.players[0].id === socket.id) {
      room.players[0].position = data.position;
    } else if (room.players[1].id === socket.id) {
      room.players[1].position = data.position;
    }
    // Send to both player
    // io.to(room.players[0].id).emit('sendPositions', room);
    // io.to(room.players[1].id).emit('sendPositions', room);
    room.players.forEach(player => {
      io.to(player.id).emit('sendPositions', room);
    });
  });

  socket.on('updateUrmaPosition', (data) => {
    // Send data to heda
    let room = rooms.find(room => room.id === data.roomId);
    let heda = room.players.find(player => player.role === 'heda');
    io.to(heda.id).emit('updateUrmaPosition', data);
  });

  socket.on('updateUrmaAnimation', (data) => {
    // Send data to heda
    let room = rooms.find(room => room.id === data.roomId);
    let heda = room.players.find(player => player.role === 'heda');
    io.to(heda.id).emit('updateUrmaAnimation', data);
  });

  socket.on('symbolSelect', (data) => {
    // Send data to urma
    let room = rooms.find(room => room.id === data.roomId);
    let urma = room.players.find(player => player.role === 'urma');
    io.to(urma.id).emit('symbolSelect', data.symbols);
  })

  socket.on('letterClicked', (data) => {
    // send letter to heda
    let room = rooms.find(room => room.id === data.roomId);
    let heda = room.players.find(player => player.role === 'heda');
    io.to(heda.id).emit('letterClicked');
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
    players : [
      {
        id : clientSocket,
        role: null,
        position: {
          x: 0,
          y: 0,
        }
      },
    ]
  }

  // Attribute player 1 id
  player1Id = clientSocket;

  while (rooms.includes(roomId)) {
    roomId = generateRandomId();
  }

  rooms.push(newRoom);
  // console.log(rooms);

  io.to(player1Id).emit('createRoom', roomId);
}

function joinRoom(clientSocket, roomId) {
  // console.log(rooms);
  // Check if room exists
  let room = rooms.find(room => room.id === roomId);
  // console.log(room);
  if (room) {
    // Check if room is full
    if (room.players.length < 2) {
      // Check if player1 != player2
      if (room.players[0] === clientSocket) {
        // console.log('Player 1 cannot join his own room');
        io.emit('joinRoom', { error: 'Player 1 cannot join his own room' })
        return;
      }
      // Add player to room
      room.players =
      [...room.players, 
        {
          id: clientSocket,
          role: null,
          position: {
            x: 0,
            y: 0,
          }
        }
      ]
      {
      };
      player2Id = clientSocket;
      // console.log(rooms);

      // Emit to both players
      io.to(player1Id).emit('joinRoom', {success : room});
      io.to(player2Id).emit('joinRoom', {success : room});

      io.to(player1Id).emit('player2Joined');
      io.to(player2Id).emit('displayWaitingRoom');

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

  room.players[0].role = player1Role;
  room.players[1].role = player2Role;
  console.log('Roles attributed');
  console.log(room);

  // Emit roles to players
  io.to(player1Id).emit('role', room.players[0].role);
  io.to(player2Id).emit('role', room.players[1].role);

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