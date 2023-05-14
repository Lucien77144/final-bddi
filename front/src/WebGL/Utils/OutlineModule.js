import * as THREE from 'three';
import Experience from '../Experience';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import gsap from 'gsap';

export default class OutlineModule {
    constructor() {
        this.experience = new Experience;
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer;
        this.camera = this.experience.camera.instance;
        this.grassScene = this.experience.activeScene;
        this.resources = this.experience.resources;

        this.originalPosition = null;
        this.originalUp = null;
        this.onGame = false;

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );
        this.backupCamPosition = this.camera.position.clone();

        window.addEventListener('click', (event) => {
            (this.outlinePass.selectedObjects[0]?.interactive === true) && this.moveCamera();
        });

        window.addEventListener('keydown', (event) => {
            if(this.onGame) {
                if (event.code === 'Space') {
                    this.returnCamera();
                }
            }
        });        

        // Wait for resources
        if (this.resources.loaded == this.resources.toLoad) {
            this.buildUtils();
        } else {
            this.resources.on("ready", () => {
                this.buildUtils();
            });
        }
    }

    moveCamera() {
        this.grassScene.onGame = true;

        const targetPosition = new THREE.Vector3();
    
        // Copy the intersected object's position
        this.stelePosition = this.outlinePass.selectedObjects[0].position.clone();
    
        // Move the target position a bit to the left (negative x) and up (positive y)
        targetPosition.x -= -3;
        targetPosition.y += 0;
        targetPosition.z += 10;
    
        const newPosition = {x: -5, y: 8, z: 3};
        const newUp = {x: 0, y: 6, z: 0};

        this.originalPosition = this.camera.position.clone();
        this.originalUp = this.camera.up.clone();

        const direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        this.originalTarget = new THREE.Vector3();
        this.originalTarget.copy(this.camera.position).add(direction);

    
        // Use GSAP to animate the camera's movement
        gsap.to(this.camera.position, {
            duration: 1, // duration of the animation in seconds
            x: newPosition.x,
            y: newPosition.y,
            z: newPosition.z,
            onUpdate: () => {
                // Ensure the camera's up vector is set to signify the y-axis as up
                this.camera.up.set(newUp.x, newUp.y, newUp.z);
                this.camera.lookAt(this.stelePosition);
            },
            onComplete: () => {
                this.onGame = this.grassScene.onGame;
            },
            ease: "power1.out", // easing function for the animation
        });

        
    }

    returnCamera() {
        if (this.originalPosition && this.originalUp) {
            // const tl = gsap.timeline();
            // Animate the camera's position back to the original position
            // tl.to(this.camera.position, {
            //     duration: 1, // duration of the animation in seconds
            //     x: this.originalPosition.x,
            //     y: this.originalPosition.y,
            //     z: this.originalPosition.z,
            //     ease: "power1.out", // easing function for the animation
            // });
    
            // // After the position has been reset, animate the lookAt
            // tl.to(this.camera.up, {
            //     duration: 1, // duration of the animation in seconds
            //     onUpdate: () => {
            //         this.camera.up.set(this.originalUp.x, this.originalUp.y, this.originalUp.z);
            //         this.camera.lookAt(this.originalTarget);
            //     },
            //     ease: "power1.out", // easing function for the animation
            // });

            this.camera.position.copy(this.originalPosition);
            this.camera.up.copy(this.originalUp);
            this.camera.lookAt(this.originalTarget);
    
            this.grassScene.onGame = false;
            this.onGame = this.grassScene.onGame;
        }
    }
    
    

    buildUtils() {
        this.getInteractiveObjects();
    
        this.composer = new EffectComposer(this.renderer.instance);
    
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
    
        this.outlinePass = new OutlinePass(
            new THREE.Vector2(this.sizes.width, this.sizes.height),
            this.scene,
            this.camera,
            this.getInteractiveObjects(),
            this.target
        );
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#ffffff');
        this.outlinePass.edgeThickness = 5;
        this.outlinePass.edgeStrength = 5;
        this.outlinePass.edgeGlow = 0;
        this.composer.addPass(this.outlinePass);

        this.composer.renderer.physicallyCorrectLights = false;

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
    
        window.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });

    
    }

    getInteractiveObjects() {
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
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
    }

    update() {
        const intersects = this.raycaster?.intersectObjects(this.interactiveObjects, true);
        if(intersects?.length > 0) {
            intersects.forEach((i) => {
                if(i.object.type === 'Points') {
                    // DELETE objet from intersect array
                    intersects.splice(intersects.indexOf(i), 1);
                }
            });
            const obj = intersects[0]?.object;
            if (obj.interactive === true) {
                const object = obj;
                this.outlinePass.selectedObjects = [object];
                // add click listener
                
                // Translate interact text on top of object position
                const screenPosition = object.position.clone();
                screenPosition.project(this.camera);
                screenPosition.x = (screenPosition.x + 1)  * window.innerWidth / 2;
                screenPosition.y = -(screenPosition.y - 1)  * window.innerHeight / 2;
            }
        } else {
            (this.outlinePass && this.outlinePass?.selectedObjects != []) && (this.outlinePass.selectedObjects = []);
        }
        this.composer?.render();
    }
}