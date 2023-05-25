import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Group, Vector2, Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import FairyDust from "components/Fairy/FairyDust.js";
import Column from "../Components/Column/Column";
import River from "../Components/River/River";
import CollisionV1 from "../Components/Fairy/Collision.js";
import Fireflies from "../Components/Fireflies/Fireflies.js";
import GrassFloor from "../Components/GrassFloor/GrassFloor";
import Fairy from "../Components/Fairy/Fairy";
import DialogueBox from "../Components/DialogueBox.js";
import Cloud from "../Components/Cloud/Cloud";
import Stele from "../Components/Stele/Stele";
import RocksRiver from "../Components/RocksRiver/RocksRiver";
import Bridge from "../Components/Bridge/Bridge";
import ControlPanel from "../Components/ControlPanel/ControlPanel";

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

  // Setup
  buildScene() {
    // Setting the world :
    this.setWorld(-.1); // value is rotation on z axis
    this.floors = [
      new GrassFloor({
        _position: new Vector3(-7, 0, -14),
        _size: new Vector3(27, 2, 95),
        _count: 175000,
      }),
    ];
    this.river = new River({
      _position: new Vector3(-5, 1.35, -10),
      _size: new Vector2(13, 30),
    });
    this.rocksRiver = new RocksRiver();
    this.bridge = new Bridge();
    this.column = new Column(new Vector3(0, -.35, 0));

    // Setting the environment :
    this.environment = new Environment();
    this.clouds = new Cloud(new Vector3(150, 15, 50));
    this.fireflies = new Fireflies();
    this.dialogueBox = new DialogueBox();
    // this.stele = new Stele();
    this.controPanel = new ControlPanel(this.experience);
    // Setting Urma :
    this.urma = new Urma(new Vector3(0, 5, 8));

    // Setting Fairy :
    // this.fairy = new Fairy();
    // this.fairyDust = new FairyDust();
    // this.collisionV1 = new CollisionV1();
  }

  setWorld(_rotation) {
    this.world = new Group();
    this.world.rotation.z = _rotation;
    this.scene.add(this.world);
  }

  update() {
    this.urma?.update();

    this.fairy?.update();
    this.fairyDust?.update();
    this.collisionV1?.update();

    this.controlPanel?.update();
    this.floors?.forEach((floor) => {
      floor.update();
    })
    this.river?.update();
    
    this.fireflies?.update();
    this.clouds?.update();
  }
}