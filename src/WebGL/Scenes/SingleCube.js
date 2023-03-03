import Experience from "../Experience.js";
import Cube from "components/Cube/Cube.js";
import { Scene } from "three";
import Floor from "../Components/Floor.js";
import Resources from "../Utils/Resources.js";
import sources from "../sources.js";
import Environment from "../Components/Environment.js";

export default class SingleCube {
  constructor() {
    this.experience = new Experience();
    this.scene = new Scene();
    
    this.resources = new Resources(sources[0]);

    // Wait for resources
    console.log(this);
    console.log(this.resources);
    this.resources.on("ready", () => {
      console.log('create cube');
      // Setup
      this.floor = new Floor();
      this.cube = new Cube();
      this.environment = new Environment();
    });
  }

  update() {}
}
