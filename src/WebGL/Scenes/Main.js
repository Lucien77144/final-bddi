import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";
import Fox from "components/Fox/Fox.js";
import { Scene } from "three";
import sources from "../sources.js";
import Resources from "../Utils/Resources.js";
import Transition from "../Components/Transition/Transition.js";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.scene = new Scene();
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.transition = new Transition();
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
