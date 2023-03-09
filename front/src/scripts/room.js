import { socket } from './socket.js';

/**
 * TODO
 * - Create room
 * - Join room
 * - Leave room and destroy on last user
 */


const createRoomButton = document.querySelector('#create');
const joinRoomButton = document.querySelector('#join');
const roomInput = document.querySelector('#roomInput');


const showRoomId = document.querySelector('.showRoomId');

const landingPage = document.querySelector('#landingPage');
const roleSelection = document.querySelector('#roleSelection');
const scene = document.querySelector('#scene');
const roomInfo = document.querySelector('#roomInfo');

let room;
let currentPlayer;

/**
 * Room Selection
 * @description Partie du code où les joueurs créent ou rejoignent une room
 */

createRoomButton.addEventListener('click', () => {
    console.log('Create room');
    socket.emit('createRoom');
});

joinRoomButton.addEventListener('click', () => {
    console.log('Join room');
    socket.emit('joinRoom', roomInput.value);
});

// On createRoom
socket.on('createRoom', (roomId) => {
    console.log('Create room', roomId);
    showRoomId.innerHTML = `Room ID : ${roomId}`;
});

// On joinRoom
socket.on('joinRoom', (data) => {
    console.log('Join room', data);
    if (data.error) {
        console.log(data.error);
    } else {
        room = data.success;
        currentPlayer = room.player1.id === socket.id ? {name: 'player1', role: null} : {name: 'player2', role: null};
        roomInfo.innerHTML = `
        <p>Room ID : ${room.id}</p>
        <p>Player 1 : ${room.player1.id}</p>
        <p>Player 2 : ${room.player2.id}</p>
        <p>Vous incarnez : ${currentPlayer.role}</p>
        `
        landingPage.classList.add('hidden');
        // scene.classList.remove('hidden');

    }
})

/**
 * Role Selection
 * @description Partie du code où les joueurs choisissent leur rôle
 * @specs - Seul le joueur 1 choisit son rôle (le créateur de la room)
 */

const selectionUrma = document.querySelector('#selectionUrma');
const selectionHeda = document.querySelector('#selectionHeda');

socket.on('selectRole', () => {
    console.log('Select role');
    roleSelection.classList.remove('hidden');
});

selectionUrma.addEventListener('click', () => {
    console.log('Urma');
    socket.emit('roleSelect', {roomId : room.id, role: 'urma'});
});

selectionHeda.addEventListener('click', () => {
    console.log('Heda');
    socket.emit('roleSelect', {roomId : room.id, role: 'heda'});
});

socket.on('role', (playerRole) => {
    currentPlayer.role = playerRole;
    console.log('player', currentPlayer);
    roleSelection.classList.add('hidden');
    roomInfo.innerHTML = `
        <p>Room ID : ${room.id}</p>
        <p>Player 1 : ${room.player1.id}</p>
        <p>Player 2 : ${room.player2.id}</p>
        <p>Vous incarnez : ${currentPlayer.role}</p>
    `
    scene.classList.remove('hidden');
});

