import * as THREE from "three";


import MouseMove from "utils/MouseMove.js";

import Cube from "components/Cube/Cube.js";
import PathUrma from "../Urma/PathUrma";

// Server
import { currentPlayer } from "@/scripts/room";
import { currentRoom } from "@/scripts/movement";
import Experience from "@/WebGL/Experience";

export default class FairyPosition {
  constructor() {
    this.fairy = new Cube();
    this.path = new PathUrma();

    this.fairy.mesh.scale.set(0.2, 0.2, 0.2);

    this.mouseMove = new MouseMove();

    this.nbPoints = 500;

    this.positions = this.setPosition(new Float32Array(this.nbPoints * 3));

    // Changes for server

    this.experience = new Experience();
    this.camera = this.experience.camera.instance;
    this.sizes = this.experience.sizes;

    this.player = currentPlayer;
    
    console.log(this.player);

    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    this.cursor.z = 8;

    window.addEventListener("mousemove", (event) => {
        this.handleMouseMove(event);
    });
  }

  handleMouseMove(event) {
    if(this.player.role === 'heda') {
      this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
      this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;
      this.cursor.z = 1;
  
      var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
      vector.unproject(this.camera);
      var dir = vector.sub(this.camera.position).normalize();
      var distance = -this.camera.position.x / dir.x;
      var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
  
      this.cursor = pos;
    } 
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
        this.positions[i3 + 2] = this.lerpPoint.z;
      }
    }
  }
  
  moveFairy() {
    // this.positions[this.positions.length - 3] = this.path.position.x;
    if(this.player.role === 'urma') {
      if(currentRoom) {
        this.player.position = currentRoom.players.filter((player) => player.role === 'heda')[0].position;
        this.cursor.x = (this.player.position.x / this.sizes.width) * 2 - 1;
        this.cursor.y = -(this.player.position.y / this.sizes.height) * 2 + 1;
        this.cursor.z = 1;
    
        var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
        vector.unproject(this.camera);
        var dir = vector.sub(this.camera.position).normalize();
        var distance = -this.camera.position.x / dir.x;
        var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    
        this.cursor = pos;
      }
    }
    this.fairy.mesh.position.set(
      this.positions[this.positions.length - 3],
      this.positions[this.positions.length - 2],
      this.positions[this.positions.length - 1]
    );
  }

  isFairyMoving() {
    if (this.fairy) {
      if (
        Math.floor(this.positions[this.positions.length - 1] * 1000) ===
        Math.floor(this.cursor.z * 1000)
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