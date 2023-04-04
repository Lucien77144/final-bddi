import { room } from "./room";
import { socket } from "./socket";

/**
 * @todo
 * - [✅] Activer le mouvement quand les deux joueurs ont rejoint la room
 * - [ ] Envoyer les mouvements du joueur 1 au joueur 2
 * - [ ] Envoyer les mouvements du joueur 2 au joueur 1
 */

/**
 * Start Movement Event
 */

export let currentRoom = room;

socket.on('startMovement', () => {
    console.log('Start movement');
    // let player1Position = room.player1.position;
    // let player2Position = room.player2.position;
    // let isPlayerOne = room.player1.id === socket.id;
    // Detect mouse movement
    let cursor = {
        x: 0,
        y: 0,
    };
    document.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX;
        cursor.y = event.clientY;

        socket.emit('move', {roomId : room.id, position : cursor});
    });

    socket.on('sendPositions', (data) => {
        // console.log('Position joueur 1', data.players[0].position);
        // console.log('Position joueur 2', data.players[1].position);
        currentRoom = data;

        // console.log('Current room', currentRoom);
    });
});
