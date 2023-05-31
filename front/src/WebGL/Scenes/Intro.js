import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Group, Vector2, Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import Tree from "components/Tree/Tree.js";
import Cube from "../Components/Cube/Cube.js";
import Column from "../Components/Column/Column";
import River from "../Components/River/River";
import GrassFloor from "../Components/GrassFloor/GrassFloor";
import Fairy from "../Components/Fairy/Fairy";
import DialogueBox from "../Components/DialogueBox.js";
import Cloud from "../Components/Cloud/Cloud";
import Bridge from "../Components/Bridge/Bridge";
import ControlPanel from "../Components/ControlPanel/ControlPanel";
import Bush from "../Components/Bush/Bush";

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
      _position: new Vector3(-17, 1.35, -10.2),
      _size: new Vector2(13, 60),
    });
    // this.rocks = [
    //   new Rock(new Vector3(0, 3, 0)),
    // ]
    // this.rocksRiver = new RocksRiver();
    this.bridge = new Bridge();
    this.column = new Column(new Vector3(0, -0.35, 0));

    this.tree = new Tree(new Vector3(-9.61, 0, -28.804));

    // Setting the environment :
    this.environment = new Environment();
    this.clouds = new Cloud(new Vector3(150, 15, 50));
    this.dialogueBox = new DialogueBox();
    // this.stele = new Stele();
    this.controPanel = new ControlPanel();
    // Setting Urma :
    this.urma = new Urma(new Vector3(0, 5, 8));
    this.bushs = [
      new Bush({
        _position: new Vector3(-2, -1.25, 2),
        _rotation: new Vector3(0, 0, 0),
        _scale: .45,
      }),
      new Bush({
        _position: new Vector3(-20, 0, 15),
        _rotation: new Vector3(1.5, 0, 0),
        _scale: .6,
      }),
    ];

    // debug path :
    // this.debugPath = new Cube({
    //   _pos: new Vector3(-6.2, 2.304, -29.891),
    //   _size: new Vector3(0.1, 0.1, 0.1),
    // });

    // Setting Fairy :
    this.fairy = new Fairy();
  }

  setWorld(_rotation) {
    this.world = new Group();
    this.world.rotation.z = _rotation;
    this.scene.add(this.world);
  }

  update() {
    this.tree?.update();

    this.urma?.update();

    this.fairy?.update();

    this.floors?.forEach((floor) => {
      floor.update();
    });
    this.river?.update();

    this.fireflies?.update();
    this.clouds?.update();
  }
}
