import { ArrowHelper, Raycaster, Vector3 } from "three";
import Experience from "webgl/Experience.js";
import Fairy from "components/Fairy/Fairy";
import MouseMove from "utils/MouseMove.js";

export default class Collision {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.mouseMove = new MouseMove();
    this.fairy = new Fairy();
    this.floors = this.experience.activeScene.floors;
    this.raycaster = new Raycaster();
    this.arrowHelpers = {};
    this.collisions = {};
    this.distances = {};

    this.initArrowHelpers();
  }

  initArrowHelpers() {
    this.arrowHelpers.down = new ArrowHelper(
      new Vector3(0, -1, 0),
      this.fairy.model?.position,
      2,
      0xff0000
    );
    this.arrowHelpers.left = new ArrowHelper(
      new Vector3(0, 0, -1),
      this.fairy.model?.position,
      2,
      0x00ff00
    );
    this.arrowHelpers.right = new ArrowHelper(
      new Vector3(0, 0, 1),
      this.fairy.model?.position,
      2,
      0x0000ff
    );

    for (const arrowHelper of Object.values(this.arrowHelpers)) {
      this.scene.add(arrowHelper);
    }
  }

  updateHelpers() {
    this.arrowHelpers.down.position.copy(this.fairy.model.position);
    this.arrowHelpers.left.position.copy(this.fairy.model.position);
    this.arrowHelpers.right.position.copy(this.fairy.model.position);
  }

  update() {
    this.fairy.moveFairy();
    this.updateHelpers();
  }
}
