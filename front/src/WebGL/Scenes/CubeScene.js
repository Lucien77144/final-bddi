import Experience from "webgl/Experience.js";
import Cube from "components/Cube/Cube.js";
import Floor from "components/Floor/Floor.js";
import Environment from "components/Environment.js";

export default class CubeScene {
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
    this.cube = new Cube();
    this.floor = new Floor();
    this.environment = new Environment();
  }

  update() {}
}
