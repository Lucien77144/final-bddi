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
    this.initCollisions();
  }

  initArrowHelpers() {
    this.arrowHelpers.down = new ArrowHelper(
      new Vector3(0, -1, 0),
      this.fairy.model.position,
      2,
      0xff0000
    );
    this.arrowHelpers.left = new ArrowHelper(
      new Vector3(0, 0, -1),
      this.fairy.model.position,
      2,
      0x00ff00
    );
    this.arrowHelpers.right = new ArrowHelper(
      new Vector3(0, 0, 1),
      this.fairy.model.position,
      2,
      0x0000ff
    );

    for (const arrowHelper of Object.values(this.arrowHelpers)) {
      this.scene.add(arrowHelper);
    }
  }

  initCollisions() {
    this.collisions.down = [];
    this.collisions.left = [];
    this.collisions.right = [];
    this.distances.down = 10;
    this.distances.left = 10;
    this.distances.right = 10;
  }

  getIntersect(direction) {
    this.arrowHelpers[direction].position.copy(this.fairy.model.position);

    this.raycaster.set(
      this.fairy.model.position.clone(),
      new Vector3(
        0,
        direction == "down" ? -1 : 0,
        direction == "left" ? 1 : direction == "right" ? -1 : 0
      )
    );

    this.floors?.forEach((e) => {
      const intersections = this.raycaster.intersectObject(e.ground);

      if (intersections.length > 0) {
        intersections.forEach((intersection) => {
          this.distances[direction] = intersection.distance;
          this.collisions[direction].push({
            floor: e.ground,
            distance: this.distances[direction],
          });
        });
      }
    });
  }

  update() {
    this.getIntersect("down");
    this.getIntersect("left");
    this.getIntersect("right");

    const leftCollisions = this.collisions.left.sort((a, b) => a.distance - b.distance);
    const rightCollisions = this.collisions.right.sort((a, b) => a.distance - b.distance);

    this.fairy.canGoDown = !(this.distances.down < 0.2);
    this.fairy.canGoLeft = !(leftCollisions[0]?.distance < 0.6);
    this.fairy.canGoRight = !(rightCollisions[0]?.distance < 0.6);

    this.fairy.moveFairy();

    this.initCollisions();
  }
}
