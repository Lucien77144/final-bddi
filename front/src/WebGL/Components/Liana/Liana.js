import Experience from "webgl/Experience.js";
import * as THREE from "three";

export default class Liana {
  constructor(_position = new THREE.Vector3(0, 2, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;

    this.position = _position;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(0.5, 2);
  }

  setMaterial() {
    this.material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        side: THREE.DoubleSide,
    })
  }

  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.name = "liana";
    this.scene.add(this.mesh);
  }
}

