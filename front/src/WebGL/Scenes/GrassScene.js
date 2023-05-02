import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Vector3 } from "three";
import GrassFloor from "components/Grass/GrassFloor.js";
import Urma from "components/Urma/Urma.js";
import Column from "components/Column/Column.js";
import FairyDust from "components/Fairy/FairyDust.js";
import Rock from "../Components/Rock/Rock.js";
import Cube from "../Components/Cube/Cube.js";
import Fairy from "../Components/Fairy/Fairy.js";
// import Collision from "@/WebGL/Utils/Collision.js";
import CollisionV1 from "../Components/Fairy/Collisionv1.js";

export default class GrassScene {
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
    this.floor = new GrassFloor();
    this.fairyDust = new FairyDust();

    // this.collision = new Collision();
    this.collisionV1 = new CollisionV1();

    // this.rock1 = new Rock(new Vector3(0, 3, 0))
    // this.rock2 = new Rock(new Vector3(3, 3, 3))
    // this.rock3 = new Rock(new Vector3(6, 3, 6))
    this.urma = new Urma(new Vector3(0, 5, 8));
    // this.cube = new Cube(new Vector3(6.36, 0, 10));

    this.column = new Column(new Vector3(0, 0, 0));

    // this.fairy = new Fairy(new Vector3(0, 5, 12));
  }

  update() {
    // if (this.collision) this.collision.update();
    if (this.collisionV1) this.collisionV1.update();
    if (this.fairyDust) this.fairyDust.update();
    if (this.floor) this.floor.update();
    if (this.urma) this.urma.update();
    // if (this.fairy) this.fairy.update();
  }
}
