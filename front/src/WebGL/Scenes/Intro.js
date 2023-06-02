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
import Letter from "../Components/Letter/Letter";
import Bush from "../Components/Bush/Bush";
import Symbol from "../Components/Symbol/Symbol.js";

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
    this.bridge = new Bridge();
    this.column = new Column(new Vector3(0, -0.35, 0));

    this.mainTree = new Tree({
      _position: new Vector3(-11, 0, -28.804),
      _isMain: true,
    });
    this.bigTrees = [
      new Tree({
        _position: new Vector3(-29.6, .9, -18)
      }),
      new Tree({
        _position: new Vector3(-20, -.5, -25),
      }),
      new Tree({
        _position: new Vector3(-2, -2, -20),
      }),
      new Tree({
        _position: new Vector3(-18, 0, -32),
      }),
      new Tree({
        _position: new Vector3(-30, 0, -40),
      }),
      new Tree({
        _position: new Vector3(-15, -1, -40),
      }),
      new Tree({
        _position: new Vector3(-25, -.25, -50),
      }),
      new Tree({
        _position: new Vector3(1, -2, -33),
      }),
      new Tree({
        _position: new Vector3(-25, .25, 2.5),
      }),
      new Tree({
        _position: new Vector3(-15, 0, 30),
      }),
      new Tree({
        _position: new Vector3(-32.5, 0, 25),
      }),
    ];

    // Setting the environment :
    this.environment = new Environment();
    this.clouds = new Cloud(new Vector3(150, 15, 50));
    this.dialogueBox = new DialogueBox();
    this.controPanel = new ControlPanel({
      _position: new Vector3(-6, 2.5, 8),
      _rotation: new Vector3(0, -Math.PI/6, -.1),
    });
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
      new Bush({
        _position: new Vector3(-2, -1.7, 21.5),
        _rotation: new Vector3(1.5, 0, 10.33),
        _scale: .5,
      }),
    ];
    this.symbols = [
      new Symbol({
        _symbolName : "symbol14",
        _position: new Vector3(-18, 4, 15),
      }),
      new Symbol({
        _symbolName : "symbol2",
        _position: new Vector3(-10, 5, -30.25),
      }),
      new Symbol({
        _symbolName : "symbol21",
        _position: new Vector3(-1, 3.5, -21.5),
      }),
    ]
    // Setting letter : 
    this.letter = new Letter(new Vector3(-8.5, 3, -28.5));
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
    this.mainTree?.update();
    this.bigTrees?.forEach((tree) => {
      tree.update();
    });

    this.urma?.update();

    this.letter?.update();

    this.fairy?.update();

    this.floors?.forEach((floor) => {
      floor.update();
    });

    this.symbols?.forEach((symbol) => {
      symbol.update();
    });
    
    this.river?.update();

    this.fireflies?.update();
    this.clouds?.update();
  }
}
