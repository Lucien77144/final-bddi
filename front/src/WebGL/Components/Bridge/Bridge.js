import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Bridge {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.world = this.experience.activeScene.world;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.position = _position;
    this.name = `bridge`;

    // Resource
    this.resource = this.resources.items.bridgeModel;

    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.name = this.name;

    this.world.add(this.model);
  }
}