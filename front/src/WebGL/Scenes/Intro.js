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
import Stele from "../Components/Stele/Stele";
import Letter from "../Components/Letter/Letter";
import Bush from "../Components/Bush/Bush";
import Symbol from "../Components/Symbol/Symbol.js";
import Stairs from "../Components/Stairs/Stairs.js";
import Entrance from "../Components/Entrance/Entrance.js";
import Sign from "../Components/Sign/Sign.js";
import Stone from "../Components/Stone/Stone.js";

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
        _count: 500000,
      }),
    ];

    this.sign = new Sign({
      _position: new Vector3(-6, 2, -32),
    });

    this.stone = new Stone({
      _position: new Vector3(5, 0, -5),
    });

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
        _position: new Vector3(-29.6, 0.9, -18),
      }),
      new Tree({
        _position: new Vector3(-20, -0.5, -25),
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
        _position: new Vector3(-25, -0.25, -50),
      }),
      new Tree({
        _position: new Vector3(1, -2, -33),
      }),
      new Tree({
        _position: new Vector3(-25, 0.25, 2.5),
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
    this.clouds = new Cloud(new Vector3(200, 15, 50));
    this.dialogueBox = new DialogueBox();
    
    // Setting Urma :
    this.urma = new Urma(new Vector3(0, 5, 8));
    this.bushs = [
      new Bush({
        _position: new Vector3(-2, -1.25, 2),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.45,
      }),
      new Bush({
        _position: new Vector3(-20, 0, 15),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.6,
      }),
      new Bush({
        _position: new Vector3(-2, -1.7, 21.5),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.5,
      }),
      new Bush({
        _position: new Vector3(-30, 0.7, 3.9),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.6,
      }),
      new Bush({
        _position: new Vector3(-30, 0.7, -22.8),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.6,
      }),
      new Bush({
        _position: new Vector3(-3.3, -0.7, -18.3),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.45,
      }),
      new Bush({
        _position: new Vector3(-14.1, 0.7, -32.6),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.5,
      }),
      new Bush({
        _position: new Vector3(-14.1, 0.7, -32.6),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.5,
      }),
      new Bush({
        _position: new Vector3(-19.6, 1.8, -39.1),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.35,
      }),
      new Bush({
        _position: new Vector3(2.2, -1.8, -32.6),
        _rotation: new Vector3(0, Math.random() * 2 * Math.PI, 0),
        _scale: 0.5,
      }),
    ];

    this.stairs = new Stairs({
      _position: new Vector3(-17.4, 1.1, 18.5),
      _rotation: new Vector3(0, 0.8, 0),
      _scale: 0.0075,
    });

    this.entrances = [
      new Entrance({
        _position: new Vector3(-13.0, 2.7, -2.2),
        _rotation: new Vector3(0, 2, 0.1),
        _scale: 2,
      }),
      new Entrance({
        _position: new Vector3(-32.6, 2.2, 9.8),
        _rotation: new Vector3(0, 1, -0.05),
        _scale: 2,
      }),
    ];

    this.symbolsNames = [];
    const disks = ['Disk_2005', 'Disk_1004', 'Disk_0004'];

    for (let i = 0; i < disks.length; i++) {
      for (let j = 0; j < 8; j++) {
        this.symbolsNames.push({
          name : `s${i + 1}-${j + 1}`,
          disk : disks[i],
          diskPosition : j,
        });
      }
    }

    this.symbolPosition = [
      new Vector3(-10, 5, -21.630),
      new Vector3(-21, 5, -21.63),
      new Vector3(-9.02, 4.565, -30.109),
      new Vector3(-0, 3.152, -22.337),
      new Vector3(-4.20, 3.804, -11.043),
      new Vector3(-13.97, 3.696, -1.848),
      new Vector3(-13.26, 3.696, 17.228),
    ]

    this.symbols = [];
    const prefixes = ['s1-', 's2-', 's3-'];

    for (const prefix of prefixes) {
      // Filter the symbolsNames array based on the prefix
      const filteredSymbolsNames = this.symbolsNames.filter(symbol => symbol.name.startsWith(prefix));

      // Select a random symbol from the filtered array
      const randomSymbolIndex = Math.floor(Math.random() * filteredSymbolsNames.length);
      const randomSymbolName = filteredSymbolsNames[randomSymbolIndex];

      // Remove the selected symbol from the original array to prevent it from being selected again
      this.symbolsNames = this.symbolsNames.filter(symbol => symbol.name !== randomSymbolName.name);

      // Select a random position and remove it from the array to prevent it from being selected again
      const randomPositionIndex = Math.floor(Math.random() * this.symbolPosition.length);
      const randomPosition = this.symbolPosition[randomPositionIndex];
      this.symbolPosition.splice(randomPositionIndex, 1);
      console.log(randomSymbolName);
      // Push the new Symbol to the symbols array
      this.symbols.push(new Symbol({
        _symbolName: randomSymbolName,
        _position: randomPosition,
      }));
    }
    // ROOM.symbolSelectionEvent(this.symbols.map(symbol => symbol.symbolObject));
    // console.log(this.symbols);
    
    this.controPanel = new Stele({
      _position: new Vector3(-5, 2.4, 6),
      _rotation: new Vector3(-.1, -Math.PI/6, -.125),
      _symbols: this.symbols.map(symbol => symbol.symbolName),
    });

    this.destroyed = [
      (this.entrance = new Entrance({
        _position: new Vector3(-17.4, 1.1, -2.2),
        _rotation: new Vector3(Math.PI, 2.2, 0),
        _scale: 2,
      })),
      (this.entrance = new Entrance({
        _position: new Vector3(-15.2, 1.1, 2.2),
        _rotation: new Vector3(Math.PI, 2.2, 0.1),
        _scale: 2,
      })),
    ];

    // Setting letter :
    this.letter = new Letter(new Vector3(-8.5, 2.6, -28.5));
    // debug path :
    this.debugPath = new Cube({
      _pos: new Vector3(-6.2, 2.304, -29.891),
      _size: new Vector3(0.1, 0.1, 0.1),
    });

    // Setting Fairy :
    this.fairy = new Fairy();
  }

  setWorld(_rotation) {
    this.world = new Group();
    this.world.rotation.z = _rotation;
    this.scene.add(this.world);
  }

  update() {
    this.sign?.update();

    this.stone?.update();

    this.mainTree?.update();
    this.bigTrees?.forEach((tree) => {
      tree.update();
    });

    this.urma?.update();

    this.letter?.update();

    this.fairy?.update();

    this.stele?.update();

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
