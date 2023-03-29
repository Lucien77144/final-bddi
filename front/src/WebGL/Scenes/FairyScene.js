import Experience from "../Experience.js";

import FairyDust from "./FairyDust.js";

export default class FairyScene {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.fairyDust = new FairyDust();
  }

  update() {
    if (this.fairyDust) this.fairyDust.update();
  }
}
