import Experience from "../Experience.js";
import Sizes from "../Utils/Sizes.js";
import * as THREE from "three";
import Time from "../Utils/Time.js";
import FairyDust from "./FairyDust.js";
import FairyPosition from "./FairyPosition.js";

export default class SingleCube {
  constructor() {
    this.experience = new Experience();
    this.sizes = new Sizes();
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
