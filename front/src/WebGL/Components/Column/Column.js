import Experience from "webgl/Experience.js";
import { MeshBasicMaterial, MeshStandardMaterial, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Column {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.world = this.experience.activeScene.world;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.position = _position;
    this.name = `column-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`
    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: this.name,
        expanded: false,
      });
    }

    // Resource
    this.resource = this.resources.items.columnModel;

    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.name = this.name;
    this.model.children.forEach((child) => {
      child.interactive = false;
      child.dialogue = `I'm the column ${child.name}!`;
      child.dialogGroup = "test"
    });
    if (this.debug.active) {
      this.debugFolder.addInput(this.model.children[0].material, "wireframe");
    }

    this.world.add(this.model);
  }
}