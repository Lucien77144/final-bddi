import * as THREE from "three";
// import * as CANNON from "cannon";

import Experience from "webgl/Experience.js";
import FairyPosition from "components/Fairy/FairyPosition";
import Urma from "components/Urma/Urma";

export default class Collision {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.fairyPosition = new FairyPosition();
    this.urma = new Urma();

    // this.world = new CANNON.World();

    // this.fairyBody = createBodyFromModel(this.fairy, { mass: 1 });
    // world.addBody(this.fairyBody);

    this.raycasterHelpers = [];
    this.raycasters = [];

    // Crée les raycasters et aides associées
    for (let i = 0; i < 3; i++) {
      const raycaster = new THREE.Raycaster();
      const color =
        i === 0 ? 0xff0000 : i === 1 ? 0x00ff00 : i === 2 ? 0x0000ff : 0xffffff;
      const arrowHelper = new THREE.ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        1,
        color
      );
      this.raycasters.push(raycaster);
      this.raycasterHelpers.push(arrowHelper);
      this.scene.add(arrowHelper);
    }

    this.intersectObjects = this.scene.children.filter(
      (child) => child.name == "urma"
    );
    console.log(this.intersectObjects);
  }

  update() {
    this.rayOrigin = this.fairyPosition.fairy.mesh.position;

    // Met à jour les raycasters et aides associées
    for (let i = 0; i < 3; i++) {
      const raycaster = this.raycasters[i];
      const arrowHelper = this.raycasterHelpers[i];

      let rayDirection;
      switch (i) {
        case 0:
          rayDirection = new THREE.Vector3(0, 0, 1);
          break;
        case 1:
          rayDirection = new THREE.Vector3(0, 0, -1);
          break;
        case 2:
          rayDirection = new THREE.Vector3(0, -1, 0);
          break;
      }

      raycaster.set(this.rayOrigin, rayDirection);
      arrowHelper.position.copy(raycaster.ray.origin);
      arrowHelper.setDirection(raycaster.ray.direction);
    }

    this.isCollision =
      this.raycasters
        .map((raycaster) => {
          return raycaster.intersectObjects(this.intersectObjects, true).length;
        })
        .filter((el) => el == 1) == 1;

    console.log(this.isCollision);
  }
}
