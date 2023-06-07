import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import Stele from "../Stele/Stele";
import OutlineModule from "@/WebGL/Utils/OutlineModule";

let instance = null;
export default class Sign {
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

    this.stele = this.experience.activeScene.stele;

    this.position = _position;

    this.name = `sign`;

    // Resource
    this.resource = this.resources.items.signModel;

    this.setModel();
    // if(this.debug.active) this.setDebug();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);
    this.model.position.copy(this.position);
    this.model.scale.set(0.3, 0.3, 0.3);
    this.model.rotation.y = -Math.PI;
    this.model.type = "sign";
    this.model.children.forEach((child) => {
      // child.interactive = true;
      child.type = "sign";
    });
    this.model.name = this.name;
    this.world.add(this.model);
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: this.name,
      expanded: false,
    });

    this.debugFolder.addInput(this.model.position, "x", {
      label: "positionX",
      min: -50,
      max: 50,
      step: 0.1,
    });
    this.debugFolder.addInput(this.model.position, "y", {
      label: "positionY",
      min: -3,
      max: 3,
      step: 0.1,
    });
    this.debugFolder.addInput(this.model.position, "z", {
      label: "positionZ",
      min: -50,
      max: 50,
      step: 0.1,
    });

    this.debugFolder.addInput(this.model.rotation, "y", {
      label: "rotationY",
      min: -Math.PI,
      max: Math.PI,
      step: 0.1,
    });
  }

  update() {
    if (
      this.stele?.isFirstGameComplete ||
      !this.OutlineModule.isSignAnimationFinished
    ) {
      this.model.interactive = true;
    }
  }
}
