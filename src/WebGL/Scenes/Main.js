import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";
import Fox from "components/Fox/Fox.js";
import { Scene } from "three";
import sources from "../sources.js";
import Resources from "../Utils/Resources.js";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.scene = new Scene();
    
    this.resources = new Resources(sources[0]);

    // Wait for resources
    console.log(this.resources);
    this.resources.on("ready", () => {
      console.log('create main');
      // Setup
      this.floor = new Floor();
      this.fox = new Fox();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) this.fox.update();
  }
}
