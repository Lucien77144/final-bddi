import Experience from "@/WebGL/Experience";
import * as THREE from "three";
import OutlineModule from "@/WebGL/Utils/OutlineModule";
//import Cube from "../Cube/Cube";

export default class Letter {
  constructor(_position = new THREE.Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.resource = this.resources.items.letterModel;
    this.scene = this.experience.scene;
    this.outlineModule = new OutlineModule();

    this.position = _position;

    this.setModel();
    this.setAnimation();
    this.animationStarted = false;
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.position.copy(this.position);
    this.model.rotation.y = Math.PI / 2;
    this.model.rotation.x = Math.PI / 2;
    this.model.scale.set(0.5, 0.5, 0.5);
    this.model.name = "letter";
    this.model.interactive = true;
    this.scene.add(this.model);
    this.model.children.forEach((child) => {
      child.interactive = true;
      child.type = "letter";
    });
  }

  setAnimation() {
    // const ropeClip = this.resource.animations[0];
    const letterClip = this.resource.animations[0];

    this.animation = {
      mixer: new THREE.AnimationMixer(this.model),
      actions: {
        // rope: null,
        letter: null,
      },
    };

    // this.animation.actions.rope = this.animation.mixer.clipAction(ropeClip);
    this.animation.actions.letter = this.animation.mixer.clipAction(letterClip);
    this.animation.actions.current = this.animation.actions.letter;
    this.animation.actions.current.setLoop(THREE.LoopOnce);
    this.animation.actions.current.timeScale = 0.0005;
  }

  startAnimation() {
    this.animation.actions.current.stop();
    this.animation.actions.current.play();
    this.animationStarted = true;
  }

  update() {
    if (
      this.outlineModule.isLetterAnimationFinished &&
      !this.animationStarted
    ) {
      this.startAnimation();
    }
    this.animation?.mixer.update(this.experience.time.delta * 1);
  }
}
