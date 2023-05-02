import * as THREE from "three";

import MouseMove from "utils/MouseMove.js";
import Cube from "components/Cube/Cube.js";

let instance = null;

export default class FairyPosition {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }

    instance = this;

    this.fairy = new Cube();

    this.fairy.mesh.scale.set(0.2, 0.2, 0.2);

    this.mouseMove = new MouseMove();

    this.fairy.mesh.position.set(0, 5, 8);
  }

  moveFairy() {
    let fairyDir = this.mouseMove.cursor.clone().sub(this.fairy.mesh.position);
    this.distFairyToMouse = this.fairy.mesh.position.distanceTo(
      this.mouseMove.cursor
    );

    if (this.distFairyToMouse > 0.1) {
      fairyDir = fairyDir.normalize();

      let newpos = this.fairy.mesh.position
        .clone()
        .add(fairyDir.multiplyScalar(0.25));

      // Utiliser un logarithme de la distance pour réduire le lerp
      let logDist = Math.log(this.distFairyToMouse + 1);
      let speed = Math.min(logDist / 2, 1);

      // Multiplier la vitesse pour augmenter l'amplitude de variation
      speed *= 0.8;

      this.fairy.mesh.position.lerp(newpos, speed);
    }
  }

  isFairyMoving() {
    if (this.fairy) {
      if (
        Math.floor(this.fairy.mesh.position.z) ===
        Math.floor(this.mouseMove.cursor.z)
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  update() {
    this.moveFairy();
  }
}
