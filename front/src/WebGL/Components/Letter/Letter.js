import Experience from '@/WebGL/Experience';
import * as THREE from 'three';
import Cube from '../Cube/Cube';

export default class Letter {
    constructor(_position = new THREE.Vector3(0, 0, 0)) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.resource = this.resources.items.letterModel;
        this.scene = this.experience.scene;

        this.position = _position;
        console.log(this.resource);
        // Setting letter
        this.setModel();
        // this.setAnimation();

        // on click
        // window.addEventListener("click", () => {
        //     console.log(this.animation.actions.current);
        //     this.animation.actions.current.stop();
        //     this.animation.actions.current = this.animation.actions.letter;
        //     this.animation.actions.current.play();
        // });
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.position.copy(this.position)
        this.model.rotation.y = Math.PI / 2;
        this.model.rotation.x = Math.PI / 2;
        this.model.scale.set(0.5, 0.5, 0.5);
        this.model.name = "letter";
        this.model.interactive = true;
        console.log(this.model);
        this.scene.add(this.model);
        this.model.children.forEach((child) => {
            child.interactive = true;
            child.type = "letter";
        })
    }

    setAnimation() {
        console.log(this.resource.animations);
        const ropeClip = this.resource.animations[0];
        const letterClip = this.resource.animations[1];

        this.animation = {
            mixer: new THREE.AnimationMixer(this.model),
            actions: {
                rope: null,
                letter : null,
            },
        };

        this.animation.actions.rope = this.animation.mixer.clipAction(ropeClip);
        this.animation.actions.letter = this.animation.mixer.clipAction(letterClip);
        this.animation.actions.current = this.animation.actions.rope;
        this.animation.actions.current.play();
        console.log(this.animation.actions.rope);
        this.animation.play = (name) => {
            const nextAction = this.animation.actions[name];
            nextAction.reset();
            nextAction.play();
            nextAction.setLoop(THREE.LoopOnce, 1);
            this.animation.actions.current = nextAction;
        }
        }

    update() {
        // this.animation.mixer.update(this.experience.time.delta * 1);
    }
}