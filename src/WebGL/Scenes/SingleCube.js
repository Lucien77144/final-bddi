import Experience from "../Experience.js";
import Cube from "components/Cube/Cube.js";
import { Scene } from "three";
import Floor from "../Components/Floor.js";
import Environment from "../Components/Environment.js";
import Transition from "../Components/Transition/Transition.js";

export default class SingleCube {
  constructor() {
    this.experience = new Experience();
    this.scene = new Scene();
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.cube = new Cube();
      this.environment = new Environment();
    });
  }

  update() {}
}
