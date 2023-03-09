import Experience from "../Experience.js";
import Cube from "components/Cube/Cube.js";
import Sizes from "../Utils/Sizes.js";
import * as THREE from "three";
import Time from "../Utils/Time.js";
import { Vector3 } from "three";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.time = new Time();
    this.sizes = new Sizes();
    this.camera = this.experience.camera;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.cube = new Cube();
      this.setMouseEvents();
    });
    this.vectors = [];
    this.animationElapsedTime = 0;
  }

  setMouseEvents() {
    const cursor = {};
    cursor.x = 0;
    cursor.y = 0;
    this.isDown = false;

    addEventListener("mousedown", () => {
      this.isDown = true;
    });
    addEventListener("mouseup", () => {
      this.path();
      this.isDown = false;
    });
    addEventListener("mousemove", (event) => {
      if (this.isDown && this.animationElapsedTime == 0) {
        const vector = new THREE.Vector3(
          (event.clientX / this.sizes.width) * 2 - 1,
          -(event.clientY / this.sizes.height) * 2 + 1,
          0.8
        );

        vector.unproject(this.camera.instance);

        this.vectors = [...this.vectors, vector];
      }
    });
  }

  path() {
    let curve = new THREE.CatmullRomCurve3(this.vectors, false, "chordal");

    this.vertices = curve.getSpacedPoints(this.vectors.length);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(
      this.vertices
    );
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffff00,
      visible: true,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);

    this.scene.add(line);
  }

  update() {
    // edit position
    if (this.cube && this.vertices) {
      this.animationElapsedTime++;
      this.cube.mesh.position.set(
        this.vertices[this.animationElapsedTime].x,
        this.vertices[this.animationElapsedTime].y,
        this.vertices[this.animationElapsedTime].z
      );
      if (
        this.vertices[this.animationElapsedTime].x ==
          this.vertices[this.vertices.length - 1].x &&
        this.vertices[this.animationElapsedTime].y ==
          this.vertices[this.vertices.length - 1].y &&
        this.vertices[this.animationElapsedTime].z ==
          this.vertices[this.vertices.length - 1].z
      ) {
        this.animationElapsedTime = 0;
        this.vectors = [];
        this.vertices = null;
      }
    }
  }
}
