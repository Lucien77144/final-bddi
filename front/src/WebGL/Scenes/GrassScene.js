import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import FairyDust from "components/Fairy/FairyDust.js";
import Column from "../Components/Column/Column";
import River from "../Components/River/River";
import CollisionV1 from "../Components/Fairy/Collision.js";
import Fireflies from "../Components/Fireflies/Fireflies.js";
import GrassFloor from "../Components/GrassFloor/GrassFloor";
import Fairy from "../Components/Fairy/Fairy";
import DialogueBox from "../Components/DialogueBox.js";
import Fox from "../Components/Fox/Fox";

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
    this.fireflies = new Fireflies();

    this.floors = [
      new GrassFloor({
        _position: new Vector3(-9, 0, 0),
        _size: new Vector3(18, 2, 58),
      }),
    ];
    this.river = new River(new Vector3(-6, 2, -5));
    this.column = new Column(new Vector3(0, 0, 0));

    this.fairy = new Fairy(new Vector3(0, 5, 12));
    this.fairyDust = new FairyDust();
    this.collisionV1 = new CollisionV1();

    this.urma = new Urma(new Vector3(0, 5, 8));
    this.dialogueBox = new DialogueBox();
  }

  update() {
    this.urma?.update();

    this.fairy?.update();
    this.fairyDust?.update();
    this.collisionV1?.update();

    this.dialogueBox?.update();

    this.floors?.forEach((floor) => {
      floor.update();
    })
    this.river?.update();
    
    this.fireflies?.update();
  }
}