import Experience from "webgl/Experience";
// import './scripts/login';
import './scripts/room';
import './scripts/movement';

import { room, roomIdText } from "./scripts/room";
import RoleSelection from "./WebGL/RoleSelection";

const copyBtn = document.querySelector('#copyBtn');
copyBtn.addEventListener('click', copyToClipboard);


function copyToClipboard() {
    const copyText = roomIdText;
    navigator.clipboard.writeText(copyText)
      .then(() => {
        // console.log('Texte copié dans le presse-papier');
        // console.log(roomIdText);
      })
      .catch((error) => {
        console.error('Erreur lors de la copie dans le presse-papier', error);
      });
}
  

const roleSelection = new RoleSelection(document.querySelector('#roleSelectionCanvas'));
// const experience = new Experience(document.querySelector("canvas#roleSelectionCanvas"));
