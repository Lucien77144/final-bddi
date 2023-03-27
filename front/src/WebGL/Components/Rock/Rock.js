import Experience from "webgl/Experience.js";
import { Mesh, MeshBasicMaterial, ShaderMaterial, Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Rock {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.position = _position;
    this.name = `rock-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: this.name,
        expanded: false,
      });
    }

    // Resource
    this.resource = this.resources.items.stoneModel;

    this.setMaterial();
    this.setModel();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.name = this.name;

    this.scene.add(this.model);
    
    this.model.traverse((child) => {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    });
    this.model.children[0].material = this.material;
  }

  setMaterial() {
    this.material = new MeshBasicMaterial({
      map: this.resources.items.stoneMaterial1,
    });
  }

  update() { }
}