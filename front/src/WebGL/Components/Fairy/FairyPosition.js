import * as THREE from "three";

import MouseMove from "utils/MouseMove.js";

import Cube from "components/Cube/Cube.js";
import EventEmitter from "utils/EventEmitter.js";

export default class FairyPosition extends EventEmitter {
  constructor() {
    super();
    this.fairy = new Cube();

    this.fairy.mesh.scale.set(0.2, 0.2, 0.2);

    this.mouseMove = new MouseMove();

    this.nbPoints = 100;

    this.positions = this.setPosition(new Float32Array(this.nbPoints * 3));
  }

  setPosition(array) {
    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;

      const x =
        this.mouseMove.cursor.x == 0
          ? this.fairy.mesh.position.x
          : (i / (this.nbPoints - 1) - 0.5) * 3;
      const y =
        this.mouseMove.cursor.y == 0
          ? this.fairy.mesh.position.y
          : Math.sin(i / 10.5) * 0.5;

      array[i3] = x;
      array[i3 + 1] = y;
      array[i3 + 2] = 1;
    }
    return array;
  }

  updatePosition() {
    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;
      const previous = (i - 1) * 3;

      if (i3 === 0) {
        this.positions[0] = this.mouseMove.cursor.x;
        this.positions[1] = this.mouseMove.cursor.y + 0.05;
        this.positions[2] = this.mouseMove.cursor.z;
      } else {
        const currentPoint = new THREE.Vector3(
          this.positions[i3],
          this.positions[i3 + 1],
          this.positions[i3 + 2]
        );

        const previousPoint = new THREE.Vector3(
          this.positions[previous],
          this.positions[previous + 1],
          this.positions[previous + 2]
        );

        this.lerpPoint = currentPoint.lerp(previousPoint, 0.8);

        this.positions[i3] = this.lerpPoint.x;
        this.positions[i3 + 1] = this.lerpPoint.y;
        this.positions[i3 + 2] = this.mouseMove.cursor.z;
      }
    }
  }

  moveFairy() {
    const x = this.positions[this.positions.length - 3];
    const y = this.positions[this.positions.length - 2];
    const z = this.positions[this.positions.length - 1];
    this.fairy.mesh.position.set(x, y, z);

    this.trigger("moveFairy", [x, y]);
  }

  isFairyMoving() {
    if (this.fairy) {
      if (
        Math.floor(this.positions[this.positions.length - 3] * 1000) ===
        Math.floor(this.mouseMove.cursor.x * 1000)
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  update() {
    if (this.positions) {
      this.updatePosition();
      this.moveFairy();
    }
  }
}
