import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";
import Fox from "components/Fox/Fox.js";
import { Scene } from "three";

export default class Main {
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
    this.fox = new Fox();
    this.environment = new Environment();
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
