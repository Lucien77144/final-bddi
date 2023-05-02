import * as THREE from "three";
import * as CANNON from "cannon";

import Experience from "webgl/Experience.js";
import FairyPosition from "components/Fairy/FairyPosition";
import Urma from "components/Urma/Urma";

export default class Collision {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.fairyPosition = new FairyPosition();
    this.urma = new Urma();

    this.raycaster = new THREE.Raycaster();
    this.direction = new THREE.Vector3();
    this.collisionDetected = false;
  }

  update() {
    this.fairyBox = new THREE.Box3().setFromObject(
      this.fairyPosition.fairy.mesh
    );
    this.fairyBox.expandByScalar(0.1);

    // create a Box3 instance for the urma's bounding box
    this.urmaBox = new THREE.Box3().setFromObject(this.urma.mesh);

    // check for collision between the fairy and urma
    if (this.fairyBox.intersectsBox(this.urmaBox)) {
      // collision detected
      if (!this.collisionDetected) {
        this.collisionDetected = true;
        this.avoidObstacle();
      }
    } else {
      this.collisionDetected = false;
    }
  }

  avoidObstacle() {
    // calculate the direction from the fairy to the urma object
    this.direction.subVectors(
      this.urma.mesh.position,
      this.fairyPosition.fairy.mesh.position
    );
    this.direction.normalize();

    // set the raycaster's position to the fairy's position
    this.raycaster.set(this.fairyPosition.fairy.mesh.position, this.direction);

    // raycast towards the urma object
    const intersections = this.raycaster.intersectObject(this.urma.mesh);

    if (intersections.length > 0) {
      // calculate the distance from the fairy to the intersection point
      const distance = intersections[0].distance;

      // calculate the new position for the fairy that avoids the urma object
      const newPosition = this.fairyPosition.fairy.mesh.position
        .clone()
        .add(this.direction.multiplyScalar(distance))

      // set the fairy's new position
      this.fairyPosition.fairy.mesh.position.set(
        newPosition.x,
        newPosition.y,
        newPosition.z
      );
    }
  }
}
