import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import {
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  RepeatWrapping,
  RedFormat,
  FloatType,
  LinearFilter,
  DataTexture,
} from "three";

export default class River {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "river_debug",
        expanded: false,
      });
    }

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setDebug();
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(1, 1);
  }

  setMaterial() {
    // chargement de la texture de bruit
    var noise_texture = new DataTexture(
      new Float32Array(512 * 512),
      512,
      512,
      RedFormat,
      FloatType
    );
    for (var i = 0; i < 512 * 512; i++) {
      noise_texture.image.data[i] = Math.random(); // génère des valeurs de bruit aléatoires entre 0 et 1
    }
    noise_texture.wrapS = RepeatWrapping;
    noise_texture.wrapT = RepeatWrapping;
    noise_texture.magFilter = LinearFilter;
    noise_texture.minFilter = LinearFilter;
    noise_texture.needsUpdate = true;

    this.material = new ShaderMaterial({
      uniforms: {
        noise_texture: { value: noise_texture },
        time: { value: 0 },
      },
      fragmentShader,
      vertexShader,
      side: DoubleSide,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 4, 0);
    this.mesh.rotation.y = Math.PI / 2;
    this.mesh.name = "river";
    this.scene.add(this.mesh);
  }

  setDebug() {
    if (this.debug.active) {
      this.debugFolder.addInput(this.mesh.position, "x", {
        min: -15,
        max: 15,
        step: 0.1,
      });
      this.debugFolder.addInput(this.mesh.position, "y", {
        min: -15,
        max: 15,
        step: 0.1,
      });
      this.debugFolder.addInput(this.mesh.position, "z", {
        min: -15,
        max: 15,
        step: 0.1,
      });
    }
  }

  update() {
    if (this.material) {
      this.material.uniforms.time.value = this.time.elapsed;
    }
  }
}
