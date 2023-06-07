import Experience from '@/WebGL/Experience.js';
import { socket } from './socket.js';
import Stele from '@/WebGL/Components/Stele/Stele.js';
import { Vector3 } from 'three';
import OutlineModule from '@/WebGL/Utils/OutlineModule.js';
import RoleSelection from '@/WebGL/RoleSelection.js';

/**
 * @todo 
 * - [✅] Créer une room
 * - [✅] Rejoindre une room
 * - [✅] Choisir son rôle
 * - [ ] Waiting screen pour le joueur 2 en attendant que le joueur 1 choisisse son rôle
 * - [✅] Lancer la partie
 */

export let room;
export let currentPlayer;
export let roomIdText;


/**
 * Page Sections
 */


const landingPage = document.querySelector('#landingPage');
const roleSelection = document.querySelector('#roleSelection');
const waitingRoom = document.querySelector('#waitingRoom');
const waitSelection = document.querySelector('#waitSelection');
const enterCode = document.querySelector('#enterCode');
const scene = document.querySelector('#scene');
const roomInfo = document.querySelector('#roomInfo');
const joinRoomSection = document.querySelector('#joinRoom');


// Copy room id to clipboard


/**
 * Room Selection
 * @description Partie du code où les joueurs créent ou rejoignent une room
 */

const createRoomButton = document.querySelector('#create');
const joinRoomButton = document.querySelector('#join');
const confirmJoinRoomButton = document.querySelector('#confirmRoom');
const roomInput = document.querySelector('#roomInput');
const showRoomId = document.querySelector('.showRoomId');

const continueButton = document.querySelector('.continue-button');
const waitingPlayerText = document.querySelector('.waiting-player-text');

createRoomButton.addEventListener('click', () => {
    // console.log('Create room');
    socket.emit('createRoom');
});

joinRoomButton.addEventListener('click', () => {
    landingPage.classList.add('hidden');
    joinRoomSection.classList.remove('hidden');
});

confirmJoinRoomButton.addEventListener('click', () => {
    // console.log('Join room');
    socket.emit('joinRoom', roomInput.value);
});

// On createRoom
socket.on('createRoom', (roomId) => {
    roomIdText = roomId;
    // console.log('Create room', roomId);
    showRoomId.innerHTML = `${roomId}`;
    console.log(showRoomId);
    waitingRoom.classList.remove('hidden');
    landingPage.classList.add('hidden');
});

// On joinRoom
socket.on('joinRoom', (data) => {
    // console.log('Join room', data);
    if (data.error) {
        console.log(data.error);
    } else {
        room = data.success;
        currentPlayer = room.players[0].id === socket.id ? {name: 'player1', role: null} : {name: 'player2', role: null};
        // landingPage.classList.add('hidden');

    }
})

socket.on('displayWaitingRoom', () => {
    // console.log('Display waiting room');
    waitSelection.classList.remove('hidden');
    enterCode.classList.add('hidden');
});

socket.on('player2Joined', () => {
    // console.log('Player 2 joined');
    // Remove disable state of the button
    continueButton.disabled = false;
    waitingPlayerText.innerHTML = 'Le joueur 2 a rejoint la partie!';
})

/**
 * Role Selection
 * @description Partie du code où les joueurs choisissent leur rôle
 * @specs - Seul le joueur 1 choisit son rôle (le créateur de la room)
 */

const selectionUrma = document.querySelector('#selectionUrma');
const selectionHeda = document.querySelector('#selectionHeda');

continueButton.addEventListener('click', () => {
    showRoleSelection();
})

// socket.on('selectRole', () => {
//     console.log('Select role');
//     roleSelection.classList.remove('hidden');
// });

function showRoleSelection() {
    // console.log('Select role');
    waitingRoom.classList.add('hidden');
    roleSelection.classList.remove('hidden');
    const roleSelectionCanvas = new RoleSelection(document.querySelector('#roleSelectionCanvas'));
}



export function roleSelectionEvent(role) {
    // console.log('Select role');
    socket.emit('roleSelect', {roomId : room.id, role: role});
}

let experience;

socket.on('role', (playerRole) => {
    currentPlayer.role = playerRole;
    // console.log('player', currentPlayer);
    roleSelection.classList.add('hidden');
    joinRoomSection.classList.add('hidden');
    roomInfo.innerHTML = `
        <p>Room ID : ${room.id}</p>
        <p>Player 1 : ${room.players[0].id}</p>
        <p>Player 2 : ${room.players[1].id}</p>
        <p>Vous incarnez : ${currentPlayer.role}</p>
    `
    scene.classList.remove('hidden');
    experience = new Experience(document.querySelector("canvas#webgl"));
    experience.setUp();
    
});

// Symbols

export function symbolSelectionEvent(symbol) {
    // console.log('Select symbol', symbol);
    socket.emit('symbolSelect', {roomId : room.id, symbols: symbol});
}

export let symbolsForUrma = [];

socket.on('symbolSelect', (data) => {
    // console.log('Symbol select', data);
    if (data.error) {
        console.log(data.error);
    } else {        // landingPage.classList.add('hidden');
        // console.log('Symbol select received', data);
        symbolsForUrma = data;
        let controPanel = new Stele({
            _position: new Vector3(-5, 2.4, 6),
            _rotation: new Vector3(-.1, -Math.PI/6, -.125),
            _symbols: symbolsForUrma,
          });
    }
});

// Letters


export function letterClicked() {
    socket.emit('letterClicked', {roomId: room.id});
}


socket.on('letterClicked', () => {
        // console.log('Letter clicked received');
        experience.outlineModule.handleLetterClick();
});