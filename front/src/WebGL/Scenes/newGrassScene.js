import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import FairyDust from "components/Fairy/FairyDust.js";
import newGrassFloor from "../Components/newGrass/newGrassFloor";

export default class NewGrassScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildScene();
    } else {
      this.resources.on("ready", () => {
        this.buildScene();
      });
    }
  }

  buildScene() {
    // Setup
    this.environment = new Environment();
    this.floor = new newGrassFloor();
    this.fairyDust = new FairyDust();

    this.urma = new Urma(new Vector3(0, 5, 8));
  }

  update() {
    if (this.fairyDust) this.fairyDust.update();
    if (this.urma) this.urma.update();
  }
}
