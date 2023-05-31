import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";

export default class Cube {
  constructor({
    _pos = new Vector3(0, 0, 0),
    _size = new Vector3(1, 1, 1),
  } = {}) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.position = _pos;
    this.size = _size;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "cube_debug",
        expanded: true,
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(this.size.x, this.size.y, this.size.z);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.name = "cube";
    this.scene.add(this.mesh);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder.addInput(this.mesh.position, "x", {
        min: -50,
        max: 15,
        step: 0.01,
      });
      this.debugFolder.addInput(this.mesh.position, "y", {
        min: 0,
        max: 4,
        step: 0.001,
      });
      this.debugFolder.addInput(this.mesh.position, "z", {
        min: -20,
        max: 25,
        step: 0.001,
      });
    }
  }
}
