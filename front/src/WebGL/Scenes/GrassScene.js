import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import Rock from "components/Rock/Rock.js";
import { Vector3 } from "three";
import GrassFloor from "components/Grass/GrassFloor.js";

export default class GrassScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildScene();
    } else {
      this.resources.on("ready", () => {
        this.buildScene();
      });
    }
  }

  buildScene() {
    // Setup
    this.floor = new GrassFloor();
    this.rock1 = new Rock(new Vector3(0, 3, 0));
    this.rock2 = new Rock(new Vector3(3, 3, 3));
    this.rock3 = new Rock(new Vector3(6, 3, 6));
    this.environment = new Environment();
  }

  update() {
    if (this.floor) this.floor.update();
  }
}
