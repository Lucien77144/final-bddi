import Experience from "../Experience.js";
import Environment from "components/Environment.js";
import Floor from "components/Floor.js";

export default class TestCamera {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.floor = new Floor();
      this.environment = new Environment();
    });
  }

  update() {}
}
