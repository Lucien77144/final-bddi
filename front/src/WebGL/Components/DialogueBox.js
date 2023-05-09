import * as THREE from 'three';
import Experience from '../Experience';
import { Dialogs } from '../Dialogs';

export default class DialogueBox {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // Get every object in the scene with interactive attribute
        this.interactiveObjects = [];
        this.scene.children.filter((object) => {
            if (object.isGroup) {
                object.children.forEach((child) => {
                    child.interactive === true && this.interactiveObjects.push(child);
                })
            } else {
                object.interactive === true && this.interactiveObjects.push(object);
            }
        })
        console.log(this.interactiveObjects);
        // Raycaster to detect if mouse is over an interactive object
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.intersected = null;
        this.time = this.experience.time;
        this.initialXCameraPos = this.experience.camera.instance.position.x;
        this.zoomDuration = 500;
        this.zoomElapsedTime = 500;
        this.dezoomElapsedTime = 500;

        // Get urma
        this.urma = this.scene.getObjectByName('urma');
        console.log(this.urma);
        
        window.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });

        window.addEventListener('click', () => {
            if (this.intersected !== null) {
                this.createDialogueBox(this.intersected.dialogGroup);
            }
        })
    }

    createDialogueBox(text) {
        // Remove previous dialogue box
        // Get dialog group
        let i = 0;
        let dialogGroup
        Dialogs.forEach((dialog) => {
            console.log(text);
            if (dialog.name === text) {
                dialogGroup = dialog.dialogs;
            }})
        this.dialogueBox && this.dialogueBox.remove();

        this.dialogueBox = document.createElement('div');
        this.dialogueBox.classList.add('dialogue-box');
        this.dialogueText = document.createElement('p');
        this.dialogueText.classList.add('dialogue-text');
        this.dialogueText.innerHTML = dialogGroup[i];
        this.dialogueBox.appendChild(this.dialogueText);
        // Add skip button to dialogue box
        this.skipButton = document.createElement('button');
        this.skipButton.classList.add('skip-button');
        this.skipButton.innerHTML = 'next';
        this.dialogueBox.appendChild(this.skipButton);
        document.body.appendChild(this.dialogueBox);

        this.zoomElapsedTime = 0;
        // Disable click on other objects
        this.interactiveObjects.forEach((object) => {
            object.interactive = false;
        })
        this.skipButton.addEventListener('click', () => {
            i++;
            if (i < dialogGroup.length) {
                // Only change text of dialogue box
                this.dialogueText.innerHTML = dialogGroup[i];

            } else {
                this.dialogueBox.remove();
                this.dezoomElapsedTime = 0;
                this.interactiveObjects.forEach((object) => {
                    object.interactive = true;
                })
            }
        })
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    update() {
        // Camera Zooming
        if (this.zoomElapsedTime < this.zoomDuration) {
            this.experience.camera.instance.position.x = THREE.MathUtils.lerp(this.initialXCameraPos, 2, this.zoomElapsedTime / this.zoomDuration);
            this.experience.camera
            this.zoomElapsedTime += this.time.delta;
          }

        if (this.dezoomElapsedTime < this.zoomDuration) {
            this.experience.camera.instance.position.x = THREE.MathUtils.lerp(2, this.initialXCameraPos, this.dezoomElapsedTime / this.zoomDuration);
            this.dezoomElapsedTime += this.time.delta;
            }


        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);
        if (intersects.length > 0 && intersects[0].object.interactive === true) {
            const object = intersects[0].object;
            this.intersected = object;

        } else {
            this.intersected = null;
        }
    }

}