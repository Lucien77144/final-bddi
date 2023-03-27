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
    
    // Wait for resources
    if(this.resources.loaded == this.resources.toLoad) {
      this.buildEvent();
    } else {
      this.resources.on("ready", () => {
        this.buildEvent();
      });
    }

    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    this.cursor.z = 0.8;
  }

  buildEvent() {
    window.addEventListener("mousemove", (event) => {
      this.handleMouseMove(event);
    });
  }

  handleMouseMove(event) {
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;
    this.cursor.z = 1;

    var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
    vector.unproject(this.camera);
    var dir = vector.sub(this.camera.position).normalize();
    var distance = -this.camera.position.z / dir.z;
    var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    this.cursor = pos;
  }
}
