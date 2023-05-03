import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Column {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.position = _position;
    this.name = `column-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: this.name,
        expanded: false,
      });
    }

    // Resource
    this.resource = this.resources.items.columnModel;

    // this.setMaterial();
    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.name = this.name;
    if (this.debug.active) {
      this.debugFolder.addInput(this.model.children[0].material, "wireframe");
    }

    this.scene.add(this.model);
  }

  setMaterial() { }

  update() { }
}