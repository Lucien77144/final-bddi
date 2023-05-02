import { ArrowHelper, Raycaster, Vector3 } from "three";
import Experience from "webgl/Experience.js";
import Fairy from "components/Fairy/Fairy";
import GrassFloor from "components/Grass/GrassFloor";
import MouseMove from "utils/MouseMove.js";

export default class Collision {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.mouseMove = new MouseMove();
    this.fairy = new Fairy();
    this.grassFloor = new GrassFloor();
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

    const directionVector = new Vector3();
    switch (direction) {
      case "down":
        directionVector.set(0, -1, 0);
        break;
      case "left":
        directionVector.set(0, 0, -1);
        break;
      case "right":
        directionVector.set(0, 0, 1);
        break;
    }

    this.raycaster.set(this.fairy.model.position.clone(), directionVector);

    this.grassFloor.grounds.children.forEach((floor) => {
      const intersections = this.raycaster.intersectObject(floor);

      if (intersections.length > 0) {
        const distance = intersections[0].distance;
        this.distances[direction] = distance;
        this.collisions[direction].push({
          floor,
          distance,
        });
      }
    });
  }

  update() {
    this.getIntersect("down");
    this.getIntersect("left");
    this.getIntersect("right");

    const leftCollisions = this.collisions.left.sort(
      (a, b) => a.distance - b.distance
    );
    const rightCollisions = this.collisions.right.sort(
      (a, b) => a.distance - b.distance
    );

    this.fairy.canGoDown = !(this.distances.down < 0.2);
    this.fairy.canGoLeft = !(leftCollisions[0]?.distance < 0.6);
    this.fairy.canGoRight = !(rightCollisions[0]?.distance < 0.6);

    this.fairy.moveFairy();

    this.initCollisions();
  }
}
