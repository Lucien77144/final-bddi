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
    console.log('Create room');
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
    // roomInfo.innerHTML = `
    //     <p>Room ID : ${room.id}</p>
    //     <p>Player 1 : ${room.players[0].id}</p>
    //     <p>Player 2 : ${room.players[1].id}</p>
    //     <p>Vous incarnez : ${currentPlayer.role}</p>
    // `
    if(currentPlayer.role === 'urma') {
        roomInfo.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_1106_905)">
        <rect width="64" height="64" rx="2.13333" fill="white" fill-opacity="0.1"/>
        <path d="M44.2666 41.5945C43.0038 45.7366 40.8391 47.0873 39.7567 47.0873C39.6071 47.1994 39.4885 47.3502 39.3293 47.5526L39.3058 47.5824L39.4666 50.1332C44.6077 48.2422 48.9567 35.1111 48.6862 30.4286C49.1371 30.2185 50.0391 29.5461 50.0391 28.5376C51.843 28.3575 54.7293 27.8172 56.5332 26.6466C55.5411 26.0163 50.9411 24.2153 47.6038 23.4049H52.294C51.5724 23.0447 46.3411 20.9736 43.7254 20.5234C43.996 20.3733 44.8438 19.9831 46.0705 19.6229C44.5552 19.0466 42.8535 19.0826 42.192 19.1727C42.3424 18.7825 43.1301 17.894 45.0783 17.4618C44.1764 17.1917 42.643 16.7414 39.2156 17.7319C39.3358 17.1917 40.1897 15.877 42.643 14.9405C30.0156 14.2201 29.0234 16.7414 26.2273 18.0021C19.2822 19.713 12.9685 11.8789 10.443 7.46655C9.99204 10.168 9.63126 15.2106 13.7803 18.9926C11.9764 18.0021 8.54891 16.021 7.46655 14.5803C8.27832 20.9736 14.2313 27.1869 18.7411 28.6277C19.5528 29.1679 19.643 29.5281 20.2744 30.2485C21.8077 31.8694 23.2509 31.3291 24.4234 30.9689C31.4715 29.258 31.4587 30.8788 33.6234 31.149C36.4195 31.5092 37.2313 38.4428 37.4116 39.6134C37.592 40.784 39.7567 40.784 40.3881 39.8836C40.5685 38.893 45.5293 37.4523 44.2666 41.5945Z" fill="#75A0BB"/>
        <path d="M18.7411 28.6277C16.2156 33.8504 15.8548 43.8456 16.8469 48.5281C17.2979 51.5897 21.7175 54.7414 22.3489 55.0115C22.9803 55.2816 24.4234 56.6323 31.7293 52.8504C37.4463 49.8909 38.6896 48.365 39.3058 47.5824M18.7411 28.6277C19.5528 29.1679 19.643 29.5281 20.2744 30.2485C21.8077 31.8694 23.2509 31.3291 24.4234 30.9689C31.4715 29.258 31.4587 30.8788 33.6234 31.149C36.4195 31.5092 37.2313 38.4428 37.4116 39.6134C37.592 40.784 39.7567 40.784 40.3881 39.8836C40.5685 38.893 45.5293 37.4523 44.2666 41.5945C43.0038 45.7366 40.8391 47.0873 39.7567 47.0873C39.6071 47.1994 39.4885 47.3502 39.3293 47.5526M18.7411 28.6277C14.2313 27.1869 8.27832 20.9736 7.46655 14.5803C8.54891 16.021 11.9764 18.0021 13.7803 18.9926C9.63126 15.2106 9.99204 10.168 10.443 7.46655C12.9685 11.8789 19.2822 19.713 26.2273 18.0021C29.0234 16.7414 30.0156 14.2201 42.643 14.9405C40.1897 15.877 39.3358 17.1917 39.2156 17.7319C42.643 16.7414 44.1764 17.1917 45.0783 17.4618C43.1301 17.894 42.3424 18.7825 42.192 19.1727C42.8535 19.0826 44.5552 19.0466 46.0705 19.6229C44.8438 19.9831 43.996 20.3733 43.7254 20.5234C46.3411 20.9736 51.5724 23.0447 52.294 23.4049M52.294 23.4049C50.7787 23.4049 48.5358 23.4049 47.6038 23.4049M52.294 23.4049H47.6038M47.6038 23.4049C50.9411 24.2153 55.5411 26.0163 56.5332 26.6466C54.7293 27.8172 51.843 28.3575 50.0391 28.5376C50.0391 29.5461 49.1371 30.2185 48.6862 30.4286C48.9567 35.1111 44.6077 48.2422 39.4666 50.1332M39.4666 50.1332C39.4666 49.4849 39.3058 47.8076 39.3058 47.5824M39.4666 50.1332C39.4666 50.6735 39.4666 51.1999 39.7567 52.5948M39.4666 50.1332L39.3058 47.5824M39.3058 47.5824L39.3293 47.5526M39.3058 47.5824C39.3137 47.5724 39.3215 47.5624 39.3293 47.5526" stroke="white" stroke-width="1.06667" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="0.533333" y="0.533333" width="62.9333" height="62.9333" rx="1.6" stroke="#E6E8EA" stroke-width="1.06667"/>
        </g>
        <defs>
        <filter id="filter0_b_1106_905" x="-6.4" y="-6.4" width="76.8" height="76.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="3.2"/>
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1106_905"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1106_905" result="shape"/>
        </filter>
        </defs>
        </svg>
        `
    } else {
        roomInfo.innerHTML = `
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_1062_716)">
        <rect width="64" height="64" rx="2.13333" fill="white" fill-opacity="0.1"/>
        <path d="M37.2773 44.5245C38.2521 45.0701 39.2013 45.8548 39.8856 46.9557C44.0203 44.3135 45.528 40.9217 46.9604 37.906C48.3962 34.8835 50.5875 26.7226 49.2273 22.3399C47.8672 17.9573 43.5601 20.602 42.2755 23.7756C40.9959 26.9371 36.342 41.796 37.2773 44.5245Z" fill="#75A0BB"/>
        <path d="M40.0557 54.3583C39.9347 54.5729 39.8034 54.7756 39.6635 54.9671C40.1924 55.1686 41.5199 55.5878 42.4267 55.5878C44.2402 55.3611 41.7181 54.3583 40.0557 54.3583Z" fill="#75A0BB"/>
        <path d="M37.2883 44.5556C37.2846 44.5454 37.2809 44.535 37.2773 44.5245M39.8575 46.9736C39.8669 46.9676 39.8762 46.9617 39.8856 46.9557M37.2773 44.5245C38.2521 45.0701 39.2013 45.8548 39.8856 46.9557M37.2773 44.5245C36.342 41.796 40.9959 26.9371 42.2755 23.7756C43.5601 20.602 47.8672 17.9573 49.2273 22.3399C50.5875 26.7226 48.3962 34.8835 46.9604 37.906C45.528 40.9217 44.0203 44.3135 39.8856 46.9557M37.2773 44.5245C35.8061 43.7011 34.2763 43.4221 33.5102 43.4221C30.7143 43.4221 26.4072 45.3868 26.2561 50.8273C26.105 56.2679 31.3944 58.0814 33.5102 58.0814C35.1743 58.0814 40.9154 56.7968 40.9154 50.8273C40.9154 49.2331 40.5112 47.9622 39.8856 46.9557M40.0557 54.3583C41.7181 54.3583 44.2402 55.3611 42.4267 55.5878C41.5199 55.5878 40.1924 55.1686 39.6635 54.9671C39.8034 54.7756 39.9347 54.5729 40.0557 54.3583Z" stroke="white"/>
        <path d="M14.0148 21.2822C13.5615 36.7727 23.6114 47.2005 28.6741 48.5606C29.0519 48.6758 29.5809 48.2583 28.9008 47.4271C28.2207 46.5959 26.785 44.4046 25.8783 41.911C21.42 29.4431 21.0422 20.451 21.0422 8.43648C20.9667 1.25797 17.1885 7.15191 16.3573 9.72106C15.5261 12.2902 14.0148 16.2195 14.0148 21.2822Z" fill="#75A0BB"/>
        <path d="M19.1531 57.4015C23.158 57.0237 26.4072 55.7391 27.9941 54.8323C28.8253 54.3034 29.5053 54.6057 29.2786 54.9835C28.1452 57.0992 24.6693 58.8372 22.2512 58.9883C19.8332 59.1395 15.1483 57.7793 19.1531 57.4015Z" fill="#75A0BB"/>
        <path d="M14.0148 21.2822C13.5615 36.7727 23.6114 47.2005 28.6741 48.5606C29.0519 48.6758 29.5809 48.2583 28.9008 47.4271C28.2207 46.5959 26.785 44.4046 25.8783 41.911C21.42 29.4431 21.0422 20.451 21.0422 8.43648C20.9667 1.25797 17.1885 7.15191 16.3573 9.72106C15.5261 12.2902 14.0148 16.2195 14.0148 21.2822Z" stroke="white"/>
        <path d="M19.1531 57.4015C23.158 57.0237 26.4072 55.7391 27.9941 54.8323C28.8253 54.3034 29.5053 54.6057 29.2786 54.9835C28.1452 57.0992 24.6693 58.8372 22.2512 58.9883C19.8332 59.1395 15.1483 57.7793 19.1531 57.4015Z" stroke="white"/>
        <rect x="0.533333" y="0.533333" width="62.9333" height="62.9333" rx="1.6" stroke="#E6E8EA" stroke-width="1.06667"/>
        </g>
        <defs>
        <filter id="filter0_b_1062_716" x="-6.4" y="-6.4" width="76.8" height="76.8" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="3.2"/>
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_1062_716"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_1062_716" result="shape"/>
        </filter>
        </defs>
        </svg>
        `
    }
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
        let stele = new Stele({
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