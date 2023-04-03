import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";

export default class Cube {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    this.position = _position;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "cube_debug",
        expanded: false,
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
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
      this.debugFolder.addInput(this.mesh.position, "x", { min: -15, max: 15, step : .1 });
      this.debugFolder.addInput(this.mesh.position, "y", { min: -15, max: 15, step : .1 });
      this.debugFolder.addInput(this.mesh.position, "z", { min: -15, max: 15, step : .1 });
    }
  }
}
