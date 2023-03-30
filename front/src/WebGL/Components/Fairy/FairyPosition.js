import * as THREE from "three";

import MouseMove from "../../Utils/MouseMove.js";

import Cube from "components/Cube/Cube.js";

import { currentRoom } from "../../../scripts/movement.js"
import { currentPlayer } from "../../../scripts/room.js"

import Sizes from "../../Utils/Sizes.js";
import Experience from "../../Experience.js";


export default class FairyPosition {
  constructor() {
    console.log(currentPlayer);
    this.fairy = new Cube();

    this.fairy.mesh.scale.set(0.2, 0.2, 0.2);

    this.mouseMove = new MouseMove();
    this.experience = new Experience();

    this.sizes = new Sizes();
    this.camera = this.experience.camera.instance;
    // Find the player with heda role
    this.nbPoints = 500;

    this.positions = this.setPosition(new Float32Array(this.nbPoints * 3));

    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    this.cursor.z = 0.8;

  }

  handleMouseMove() {
      const hedaCursor = currentRoom.players.find(player => player.role === "heda").position;
      this.cursor.x = (hedaCursor.x / this.sizes.width) * 2 - 1;
      this.cursor.y = -(hedaCursor.y / this.sizes.height) * 2 + 1;
      this.cursor.z = 1;
  
      var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
      vector.unproject(this.camera);
      var dir = vector.sub(this.camera.position).normalize();
      var distance = -this.camera.position.z / dir.z;
      var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
  
      this.cursor = pos;
  }
  
  setPosition(array) {
    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;

      const x = (i / (this.nbPoints - 1) - 0.5) * 3;
      const y = Math.sin(i / 10.5) * 0.5;

      array[i3] = x;
      array[i3 + 1] = y;
      array[i3 + 2] = 1;
    }
    return array;
  }

  updatePosition() {
    if(currentRoom) {
      this.handleMouseMove();
    }

    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;
      const previous = (i - 1) * 3;

      if (i3 === 0) {
        this.positions[0] = this.cursor.x;
        this.positions[1] = this.cursor.y + 0.05;
        this.positions[2] = this.cursor.z;
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

        this.lerpPoint = currentPoint.lerp(previousPoint, 0.9);

        this.positions[i3] = this.lerpPoint.x;
        this.positions[i3 + 1] = this.lerpPoint.y;
        this.positions[i3 + 2] = this.mouseMove.cursor.z;
      }
    }
  }
  
  moveFairy() {
    this.fairy.mesh.position.set(
      this.positions[this.positions.length - 3],
      this.positions[this.positions.length - 2],
      this.positions[this.positions.length - 1]
    );
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
      this.moveFairy()
    }
  }
}
