import * as THREE from 'three';
import Experience from '../Experience';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { LuminosityHighPassShader } from 'three/examples/jsm/shaders/LuminosityHighPassShader';
import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer';

export default class OutlineModule {
    constructor() {
        this.experience = new Experience;
        this.scene = this.experience.scene;
        this.renderer = this.experience.renderer;
        this.camera = this.experience.camera;
        this.grassScene = this.experience.activeScene

        this.renderPass = new RenderPass(this.scene, this.camera.instance);
        this.composer = new EffectComposer(this.renderer.instance);
        this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera.instance);

        this.composer.addPass(this.renderPass);
        this.composer.addPass(this.outlinePass);

        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        window.addEventListener('mousemove', (event) => {
            this.onMouseMove(event);
          });
    }

    init() {
        this.outlinePass.visibleEdgeColor.set('#ffffff');
        this.outlinePass.hiddenEdgeColor.set('#ffffff');
        this.outlinePass.edgeThickness = 5;
        this.outlinePass.edgeStrength = 5;
        this.outlinePass.edgeGlow = 0;
        this.outlinePass.pulsePeriod = 0;
    
        this.mouse = new THREE.Vector2();
      }

    onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }

    update() {
        this.raycaster.setFromCamera(this.mouse, this.camera.instance);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        if(intersects.length > 0) {
            intersects.forEach((intersect) => {
                if(intersect.object.type === 'Points') {
                    // DELETE objet from intersect array
                    intersects.splice(intersects.indexOf(intersect), 1);
                }
            })
        }
        if (intersects.length > 0 && intersects[0].object.interactive === true) {
            const object = intersects[0].object;
            this.outlinePass.selectedObjects = [object];
            const interactText = document.querySelector('.interact-text');
            interactText.classList.remove('hidden');
            const cssObject = new CSS3DObject(interactText);
            cssObject.position.set(object.position.x, object.position.y + 1, object.position.z);
            this.scene.add(cssObject);
            console.log(cssObject);

        } else {
            this.outlinePass.selectedObjects = [];
        }
        this.composer.render();


    }
}
