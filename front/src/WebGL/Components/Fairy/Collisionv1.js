import * as THREE from "three";
import Experience from "webgl/Experience.js";
import Fairy from "components/Fairy/Fairy";
import GrassFloor from "components/Grass/GrassFloor";
import MouseMove from "utils/MouseMove.js";

export default class CollisionV1 {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;

    this.mouseMove = new MouseMove();

    this.fairy = new Fairy();
    this.grassFloor = new GrassFloor();

    // Créer les arrowHelpers pour visualiser la direction des raycasts
    this.arrowHelpers = {
      down: new THREE.ArrowHelper(
        new THREE.Vector3(0, -1, 0), // Direction vers le bas
        this.fairy.model.position, // Position de la fée
        2, // Longueur de l'arrowHelper
        0xff0000 // Couleur de l'arrowHelper
      ),
      left: new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, -1), // Direction vers la gauche
        this.fairy.model.position, // Position de la fée
        2, // Longueur de l'arrowHelper
        0x00ff00 // Couleur de l'arrowHelper
      ),
      right: new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1), // Direction vers la droite
        this.fairy.model.position, // Position de la fée
        2, // Longueur de l'arrowHelper
        0x0000ff // Couleur de l'arrowHelper
      ),
    };

    for (const arrowHelper of Object.values(this.arrowHelpers)) {
      this.scene.add(arrowHelper);
    }

    // Raycaster pour détecter les collisions
    this.raycaster = new THREE.Raycaster();
    this.collisions = {
      down: [],
      left: [],
      right: [],
    };
    this.distances = {
      down: 10,
      left: 10,
      right: 10,
    };
  }

  getIntersect(direction) {
    this.arrowHelpers[direction].position.copy(this.fairy.model.position);

    // Raycast dans la direction spécifiée
    this.raycaster.set(
      this.fairy.model.position.clone(),
      new THREE.Vector3(
        0,
        direction == "down" ? -1 : 0,
        direction == "left" ? 1 : direction == "right" ? -1 : 0
      )
    );

    // Tester chaque floor du groupe GrassFloor.grounds pour détecter les collisions
    this.grassFloor.grounds.children.forEach((floor) => {
      // Calculer les intersections entre le raycast et chaque floor
      const intersections = this.raycaster.intersectObject(floor);

      // Si le raycast intersecte le floor
      if (intersections.length > 0) {
        // Ajouter les points d'intersection à la liste des collisions
        intersections.forEach((intersection) => {
          this.distances[direction] = intersection.distance;
          this.collisions[direction].push({
            floor,
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

    console.log(this.distances);

    this.fairy.canGoDown = !(this.distances.down < 0.2);
    this.fairy.canGoLeft = !(
      this.collisions.left.sort((a, b) => a.distance - b.distance)[0]
        ?.distance < 0.6
    );
    this.fairy.canGoRight = !(
      this.collisions.right.sort((a, b) => a.distance - b.distance)[0]
        ?.distance < 0.6
    );

    // console.log(this.fairy.canGoLeft, this.distances.left);

    this.fairy.moveFairy();

    // console.log(this.collisions);
    // console.log(this.fairy.canGoDown, this.fairy.canGoLeft, this.fairy.canGoRight);

    // Trier les collisions par ordre de distance croissante
    for (const direction in this.collisions) {
      this.collisions[direction].sort((a, b) => a.distance - b.distance);
    }

    // Réinitialiser la liste des collisions pour la prochaine frame
    this.collisions = {
      down: [],
      left: [],
      right: [],
    };
  }
}
