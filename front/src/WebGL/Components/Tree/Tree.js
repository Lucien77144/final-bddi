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
import cloneGltf from "@/WebGL/Utils/GltfClone";

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
    this.trunkModel = this.resources.items.treeModel;
    // this.debug = this.experience.debug;
    this.position = _position;

    this.setGroup();
    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setModel();

    // if (this.debug.active) this.setDebug();
  }

  setGroup() {
    this.treeGroup = new Group();
    this.treeGroup.position.copy(this.position);
    this.scene.add(this.treeGroup);
    // this.treeGroup.rotation.y = Math.PI / 2;
  }

  setModel() {
    this.model = cloneGltf(this.trunkModel).scene;
    // this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.copy(this.position);
    this.model.name = "trunk";
    this.treeGroup.add(this.model);
    this.model.position.set(0, 2.5, 0);
    this.model.rotation.y = -Math.PI / 2;

    for (const child of this.model.children) {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    }
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(8, 8, 250, 250);
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
    this.leafMeshes = [];
    const leafCount = 1;
    for (let i = 0; i < leafCount; i++) {
      const mesh = new Mesh(this.geometry, this.material);
      mesh.rotation.y = Math.PI / 2;
      this.treeGroup.add(mesh);
      this.leafMeshes.push(mesh);
    }
    this.leafMeshes[0].position.set(-1, 10, -1);
    this.leafMeshes[0].scale.set(2, 2, 2);
    // this.leafMeshes[1].position.set(0, 10, 2);
    // this.leafMeshes[2].position.set(-2, 12, -1);
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: "leaves",
      expanded: true,
    });

    this.debugFolder
      .addInput(this.mesh.rotation, "y", {
        min: 0,
        max: Math.PI * 2,
        step: 0.1,
        label: "leaves y",
      })
      .onChange((value) => {
        this.mesh.rotation.y = value;
      });
  }

  // setOrientation() {
  //   const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
  //   const targetPosition = this.camera.position.clone();

  //   this.mesh.lookAt(targetPosition);

  //   const meshRotation = this.mesh.rotation.clone();
  //   const targetRotationY = clamp(meshRotation.y, 0.9, 1.05);
  //   const smoothness = 0.05; // Valeur pour ajuster la vitesse de rotation (plus la valeur est petite, plus la rotation sera lente)

  //   meshRotation.y = MathUtils.lerp(
  //     meshRotation.y,
  //     targetRotationY,
  //     smoothness
  //   );
  //   this.mesh.rotation.copy(meshRotation);
  // }

  setOrientation() {
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    const targetPosition = this.camera.position.clone();

    for (const mesh of this.leafMeshes) {
      mesh.lookAt(targetPosition);

      const meshRotation = mesh.rotation.clone();
      const targetRotationY = clamp(meshRotation.y, 0.9, 1.05);
      const smoothness = 0.05; // Valeur pour ajuster la vitesse de rotation (plus la valeur est petite, plus la rotation sera lente)

      meshRotation.y = MathUtils.lerp(
        meshRotation.y,
        targetRotationY,
        smoothness
      );
      mesh.rotation.copy(meshRotation);
    }
  }

  update() {
    // this.setOrientation();
  }
}
