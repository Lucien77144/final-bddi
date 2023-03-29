import Experience from "../Experience.js";
import Sizes from "./Sizes.js";
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

    this.resources.on("ready", () => {
      window.addEventListener("mousemove", (event) => {
        this.handleMouseMove(event);
      });
    });

    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    this.cursor.z = 8;
  }

  handleMouseMove(event) {
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;
    this.cursor.z = 1;

    var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
    vector.unproject(this.camera);
    var dir = vector.sub(this.camera.position).normalize();
    var distance = -this.camera.position.x / dir.x;
    var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    this.cursor = pos;
  }
}
