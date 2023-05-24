import Experience from "webgl/Experience.js";
import {
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  PlaneGeometry,
  RepeatWrapping,
  ShaderMaterial,
  Vector3,
  sRGBEncoding,
} from "three";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import { Color } from "three";

let instance = null;
export default class Tree {
  constructor(_position = new Vector3(0, 0, 0)) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.camera = this.experience.camera.instance;
    this.resources = this.experience.resources;
    // this.debug = this.experience.debug;
    this.position = _position;

    this.setGroup();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();

    // if (this.debug.active) this.setDebug();
  }

  setGroup() {
    this.treeGroup = new Group();
    this.treeGroup.position.copy(this.position);
    this.scene.add(this.treeGroup);
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(2, 2, 250, 250);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      uniforms: {
        uMask: { value: this.resources.items.treeMask },
        colorLight: { value: new Color("#1e363f") },
        colorDark: { value: new Color("#427062") },
        brightnessThresholds: { value: [0.7, 0.3, 0.001] },
        lightPosition: {
          value: new Vector3(12, 6, -4),
        },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.treeGroup.add(this.mesh);
    this.mesh.rotation.y = Math.PI / 2;
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: "Tree",
      expanded: true,
    });

    this.debugFolder
      .addInput(this.mesh.rotation, "y", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "Tree y",
      })
      .onChange((value) => {
        this.mesh.rotation.y = value;
      });
  }

  update() {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const targetPosition = this.camera.position.clone();

    this.mesh.lookAt(targetPosition);

    const meshRotation = this.mesh.rotation.clone();
    const targetRotationY = clamp(meshRotation.y, 0.9, 1.05);
    const smoothness = 0.05; // Valeur pour ajuster la vitesse de rotation (plus la valeur est petite, plus la rotation sera lente)

    meshRotation.y = MathUtils.lerp(
      meshRotation.y,
      targetRotationY,
      smoothness
    );
    this.mesh.rotation.copy(meshRotation);
  }
}
