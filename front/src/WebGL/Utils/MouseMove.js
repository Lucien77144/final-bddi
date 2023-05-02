import Experience from "webgl/Experience.js";
import Sizes from "utils/Sizes.js";
import PathUrma from "components/Urma/PathUrma";
import * as THREE from "three";

let instance = null;

export default class MouseMove {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.sizes = new Sizes();
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.path = new PathUrma();

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildEvent();
    } else {
      this.resources.on("ready", () => {
        this.buildEvent();
      });
    }

    this.cursor = new THREE.Vector3();
  }

  buildEvent() {
    window.addEventListener("mousemove", (event) => {
      this.handleMouseMove(event);
    });
  }

  handleMouseMove(event) {
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;

    let vector = new THREE.Vector3(this.cursor.x, this.cursor.y, this.cursor.z);
    vector.unproject(this.camera);
    let dir = vector.sub(this.camera.position).normalize();
    let distance = -this.camera.position.x / dir.x + (this.path.position.x + .35) / dir.x;
    let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    this.cursor = pos;
  }
}
