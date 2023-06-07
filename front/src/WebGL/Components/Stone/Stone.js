import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import OutlineModule from "@/WebGL/Utils/OutlineModule";
import gsap from "gsap";

let instance = null;
export default class Stone {
  constructor({ _position = new Vector3(0, 0, 0) } = {}) {
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.world = this.experience.activeScene.world;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.OutlineModule = new OutlineModule();

    this.position = _position;

    this.name = `stone`;

    // Resource
    this.resource = this.resources.items.stoneModel;

    this.setModel();
    this.isAnimationPlayed = false; // Variable pour suivre l'état de l'animation
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);
    this.model.position.copy(this.position);
    // this.model.scale.set(0.3, 0.3, 0.3);
    // this.model.rotation.y = -Math.PI;
    this.model.name = this.name;
    this.world.add(this.model);
  }

  update() {
    if (
      this.OutlineModule.isSignAnimationFinished &&
      !this.isAnimationPlayed // Vérifier si l'animation n'a pas encore été jouée
    ) {
      gsap.to(this.model.position, {
        z: "-=1",
        duration: 1,
        ease: "power2.in",
        onComplete: () => {
          this.isAnimationPlayed = true; // Mettre à jour l'état de l'animation
        },
      });
    }
  }
}
