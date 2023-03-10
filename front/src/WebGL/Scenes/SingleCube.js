import Experience from "../Experience.js";
import Cube from "components/Cube/Cube.js";
import { Scene } from "three";
import Floor from "../Components/Floor.js";
import Environment from "../Components/Environment.js";

export default class SingleCube {
  constructor() {
    this.experience = new Experience();
    this.scene = new Scene();
    this.resources = this.experience.resources;

    // Wait for resources
    if(this.resources.loaded == this.resources.toLoad) {
      this.buildScene();
    } else {
      this.resources.on("ready", () => {
        this.buildScene();
      });
    }
  }

  buildScene() {
    // Setup
    this.floor = new Floor();
    this.cube = new Cube();
    this.environment = new Environment();
  }

  update() {}
}