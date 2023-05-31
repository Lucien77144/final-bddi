import Experience from "webgl/Experience.js";
import { Color, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Bush {
  constructor({
    _position = new Vector3(0, 0, 0),
    _scale = .4,
    _woodColor = null,
    _leavesColor = null,
    _rotation = new Vector3(0, 0, 0),
  } = {}) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;
    this.floor = this.experience.activeScene.floors[Math.floor(Math.random() * this.experience.activeScene.floors.length)];

    this.position = _position;
    this.scale = _scale;
    this.rotation = _rotation;
    this.name = `bush-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`;

    this.colors = {
      leaves: _leavesColor || this.floor.colors.base,
      wood: _woodColor || new Color("#231a0d"),
    }

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: this.name,
        expanded: false,
      });
    }

    // Resource
    this.resource = this.resources.items.bushModel;

    this.setMaterial();
    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.rotation.copy(this.rotation);
    this.model.scale.set(this.scale, this.scale, this.scale);
    this.model.name = this.name;

    // changing colors
    this.model.children[0].children[0].material.color = this.colors.leaves;
    this.model.children[0].material.color = this.colors.wood;

    if (this.debug.active) {
      this.debugFolder.addInput(this.model.position, "x", {
        label: "positionX",
        min: -30,
        max: 30,
        step: 0.1,
      });
      this.debugFolder.addInput(this.model.position, "y", {
        label: "positionY",
        min: -30,
        max: 30,
        step: 0.1,
      });
      this.debugFolder.addInput(this.model.position, "z", {
        label: "positionZ",
        min: -30,
        max: 30,
        step: .1,
      });
    }

    this.scene.add(this.model);
  }

  setMaterial() { }

  update() { }
}