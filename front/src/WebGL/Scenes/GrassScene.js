import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import GrassFloor from "../Components/GrassFloor.js";

export default class GrassScene {
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
    // Setup
      this.floor = new GrassFloor();
      this.environment = new Environment();
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
