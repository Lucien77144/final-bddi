import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Group, Vector2, Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import FairyDust from "components/Fairy/FairyDust.js";
import Column from "../Components/Column/Column";
import River from "../Components/River/River";
import CollisionV1 from "../Components/Fairy/Collision.js";
import GrassFloor from "../Components/GrassFloor/GrassFloor";
import Fairy from "../Components/Fairy/Fairy";
import DialogueBox from "../Components/DialogueBox.js";
import Cloud from "../Components/Cloud/Cloud";
import RocksRiver from "../Components/RocksRiver/RocksRiver";
import Bridge from "../Components/Bridge/Bridge";
import ControlPanel from "../Components/ControlPanel/ControlPanel";
import Letter from "../Components/Letter/Letter";

export default class Intro {
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
    this.setWorld(-0.1); // value is rotation on z axis
    this.floors = [
      new GrassFloor({
        _position: new Vector3(-20.5, 0, -14),
        _size: new Vector3(54, 2, 95),
        _count: 300000,
      }),
    ];
    this.river = new River({
      _position: new Vector3(-17, 1.35, -10),
      _size: new Vector2(13, 60),
    });
    // this.rocks = [
    //   new Rock(new Vector3(0, 3, 0)),
    // ]
    // this.rocksRiver = new RocksRiver();
    this.bridge = new Bridge();
    this.column = new Column(new Vector3(0, -0.35, 0));

    // Setting the environment :
    this.environment = new Environment();
    this.clouds = new Cloud(new Vector3(150, 15, 50));
    this.dialogueBox = new DialogueBox();
    // this.stele = new Stele();
    this.controPanel = new ControlPanel();
    // Setting Urma :
    this.urma = new Urma(new Vector3(0, 5, 8));

    // Setting letter : 
    this.letter = new Letter(new Vector3(-8.5, 3, -28.5));

    // Setting Fairy :
    this.fairy = new Fairy();
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

    this.letter?.update();

    this.fairy?.update();

    this.floors?.forEach((floor) => {
      floor.update();
    });
    this.river?.update();

    this.fireflies?.update();
    this.clouds?.update();
  }
}
