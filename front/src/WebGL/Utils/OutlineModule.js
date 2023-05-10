import * as THREE from 'three';
import Experience from '../Experience';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

export default class OutlineModule {
    constructor() {
        this.experience = new Experience;
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer;
        this.camera = this.experience.camera.instance;
        this.grassScene = this.experience.activeScene;
        this.resources = this.experience.resources;

        this.outlinePass = new OutlinePass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            this.scene,
            this.camera
        );

        // Wait for resources
        if (this.resources.loaded == this.resources.toLoad) {
            this.buildUtils();
        } else {
            this.resources.on("ready", () => {
                this.buildUtils();
            });
        }
    }

    buildUtils() {
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#ffffff');
        this.outlinePass.edgeThickness = 5;
        this.outlinePass.edgeStrength = 5;
        this.outlinePass.edgeGlow = 0;
        this.outlinePass.pulsePeriod = 0;

        this.composer = new EffectComposer(this.renderer.instance);

        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.outlinePass);

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

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

        window.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
        });
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

                // Translate interact text on top of object position
                const screenPosition = object.position.clone();
                screenPosition.project(this.camera);
                screenPosition.x = (screenPosition.x + 1)  * window.innerWidth / 2;
                screenPosition.y = -(screenPosition.y - 1)  * window.innerHeight / 2;
            }
        } else {
           this.outlinePass.selectedObjects != [] && (this.outlinePass.selectedObjects = []);
        }
        this.composer?.render();
    }
}