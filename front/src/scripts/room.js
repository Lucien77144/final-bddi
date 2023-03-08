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
const scene = document.querySelector('#scene');
const roomInfo = document.querySelector('#roomInfo');

let room;

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
        roomInfo.innerHTML = `
        <p>Room ID : ${room.id}</p>
        <p>Player 1 : ${room.player1}</p>
        <p>Player 2 : ${room.player2}</p>
        `
        landingPage.classList.add('hidden');
        scene.classList.remove('hidden');

    }
})
