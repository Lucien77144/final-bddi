import Environment from "../Components/Environment.js";
import FairyDust from "../Components/Fairy/FairyDust.js";
import Experience from "../Experience.js";
import Sizes from "../Utils/Sizes.js";

export default class FairyScene {
  constructor() {
    this.experience = new Experience();
    this.sizes = new Sizes();
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
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
    this.fairyDust = new FairyDust();
    this.environment = new Environment();
  }

  update() {
    if (this.fairyDust) this.fairyDust.update();
  }
}