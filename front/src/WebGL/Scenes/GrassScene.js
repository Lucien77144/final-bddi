import Experience from "webgl/Experience.js";
import Environment from "components/Environment.js";
import { Group, Vector3 } from "three";
import Urma from "components/Urma/Urma.js";
import FairyDust from "components/Fairy/FairyDust.js";
import Tree from "components/Tree/Tree.js";
import Rock from "../Components/Rock/Rock.js";
import Cube from "../Components/Cube/Cube.js";
// import Collision from "@/WebGL/Utils/Collision.js";
import CollisionV1 from "../Components/Fairy/Collision.js";
import Fireflies from "../Components/Fireflies/Fireflies.js";
import GrassFloor from "../Components/GrassFloor/GrassFloor";
import Fairy from "../Components/Fairy/Fairy";
import DialogueBox from "../Components/DialogueBox.js";
import Cloud from "../Components/Cloud/Cloud";
import Stele from "../Components/Stele/Stele";
import RocksRiver from "../Components/RocksRiver/RocksRiver";
import Bridge from "../Components/Bridge/Bridge";

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
        _position: new Vector3(-7, 0, 0),
        _size: new Vector3(27, 2, 58),
        _count: 175000,
      }),
    ];
    this.river = new River(new Vector3(-6, 2, -5));
    this.rocksRiver = new RocksRiver();
    this.bridge = new Bridge();
    this.column = new Column();

    // Setting the environment :
    this.environment = new Environment();
    this.floor = new GrassFloor();
    this.fairyDust = new FairyDust();
    this.tree = new Tree(new Vector3(0, 5, 0));

    // this.collision = new Collision();
    this.collisionV1 = new CollisionV1();

    // this.rock1 = new Rock(new Vector3(0, 3, 0))
    // this.rock2 = new Rock(new Vector3(3, 3, 3))
    // this.rock3 = new Rock(new Vector3(6, 3, 6))
    this.urma = new Urma(new Vector3(0, 5, 8));

    // Setting Fairy :
    this.fairy = new Fairy();
    this.fairyDust = new FairyDust();
    this.collisionV1 = new CollisionV1();
  }

  setWorld(_rotation) {
    this.world = new Group();
    this.world.rotation.z = _rotation;
    this.scene.add(this.world);
  }

  update() {
    // if (this.collision) this.collision.update();
    if (this.tree) this.tree.update();
    if (this.collisionV1) this.collisionV1.update();
    if (this.fairyDust) this.fairyDust.update();
    if (this.floor) this.floor.update();
    if (this.urma) this.urma.update();
    // if (this.fairy) this.fairy.update();
  }
}