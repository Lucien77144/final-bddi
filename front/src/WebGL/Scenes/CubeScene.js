import Experience from "../Experience.js";
import Cube from "../Components/Cube/Cube.js";
import Floor from "../Components/Floor/Floor.js";
import Environment from "../Components/Environment.js";

export default class CubeScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
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
    this.cube = new Cube();
    this.floor = new Floor();
    this.environment = new Environment();
  }

  update() { }
}
