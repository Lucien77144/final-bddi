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

    // Créez un monde de simulation Cannon.js
    this.world = new CANNON.World();

    // Créez des corps rigides pour l'objet "fée" et l'objet "garçon"
    const fairyShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    this.fairyBody = new CANNON.Body({
      mass: 1,
      shape: fairyShape,
      position: this.fairyPosition.fairy.mesh.position,
    });
    this.world.addBody(this.fairyBody);

    const urmaShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));
    this.urmaBody = new CANNON.Body({
      mass: 1,
      shape: urmaShape,
      position: this.urma.mesh.position,
    });
    this.world.addBody(this.urmaBody);

    // Écoutez les événements de collision dans le monde de simulation Cannon.js
    this.urmaBody.addEventListener("collide", (event) => {
      this.fairyPosition.invertDir = -1;
      console.log("Collision");
      // Vérifiez si la collision implique l'objet "fée" et l'objet "garçon"
      if (
        (event.body === this.fairyBody && event.otherBody === this.urmaBody) ||
        (event.body === this.urmaBody && event.otherBody === this.fairyBody)
      ) {
        console.log("Collision detected!");
      }
    });
  }

  update() {
    // console.log(this.world);
    // Mettez à jour la position des corps rigides Cannon.js pour qu'ils correspondent à l'emplacement des objets Three.js
    this.fairyBody.position.set(
      this.fairyPosition.fairy.mesh.position.x,
      this.fairyPosition.fairy.mesh.position.y,
      this.fairyPosition.fairy.mesh.position.z
    );

    this.urmaBody.position.set(
      this.urma.mesh.position.x,
      this.urma.mesh.position.y,
      this.urma.mesh.position.z
    );

    // Mettez à jour la simulation Cannon.js
    this.world.step(1 / 60);
  }
}
