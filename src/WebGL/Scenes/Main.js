import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";
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
    this.fox1 = new Fox(new Vector3(.1, 0, 0));
    this.fox2 = new Fox(new Vector3(.2, 0, 0));
    this.fox3 = new Fox(new Vector3(.3, 0, 0));
    this.fox4 = new Fox(new Vector3(.4, 0, 0));
    this.fox5 = new Fox(new Vector3(.5, 0, 0));
    this.environment = new Environment();
    console.log(this);
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
