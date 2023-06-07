import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

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

    this.position = _position;

    this.name = `stone`;

    // Resource
    this.resource = this.resources.items.stoneModel;

    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);
    this.model.position.copy(this.position);
    // this.model.scale.set(0.3, 0.3, 0.3);
    // this.model.rotation.y = -Math.PI;
    this.model.name = this.name;
    this.world.add(this.model);
  }

  update() {}
}
