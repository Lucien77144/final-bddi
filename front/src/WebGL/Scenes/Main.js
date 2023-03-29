import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import Floor from "webgl/Components/Floor/Floor.js";
import Fox from "components/Fox/Fox.js";
import { Scene, Vector3 } from "three";

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
    this.fox1 = new Fox(new Vector3(-1, 0, 0));
    this.fox2 = new Fox();
    this.fox3 = new Fox(new Vector3(1, 0, 0));
    this.environment = new Environment();
  }

  update() {
    if (this.fox1) this.fox1.update();
    if (this.fox2) this.fox2.update();
    if (this.fox3) this.fox3.update();
  }
}