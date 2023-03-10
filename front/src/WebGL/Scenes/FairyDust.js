import * as THREE from "three";

import Experience from "../Experience.js";

import FairyPosition from "./FairyPosition.js";

import fairyDustVertexShader from "../Shaders/fairyDust/vertex.glsl";
import fairyDustFragmentShader from "../Shaders/fairyDust/fragment.glsl";

export default class FairyDust {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;

    this.fairyPosition = new FairyPosition();

    this.particles = new THREE.Group();
    this.scene.add(this.particles);

    this.particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });
  }

  addParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 10;

    const posArray = new Float32Array(particlesCnt * 3);
    const scaleArray = new Float32Array(particlesCnt);
    this.lifeArray = new Float32Array(particlesCnt);

    const radius = Math.random() * 2;

    for (let i = 0; i < particlesCnt; i++) {
      posArray[i * 3 + 0] =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 3] -
        Math.pow(Math.random(), 5) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.2 *
          radius;
      posArray[i * 3 + 1] =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 2];

      posArray[i * 3 + 2] =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 1] +
        Math.pow(Math.random(), 5) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.2 *
          radius;

      scaleArray[i] = Math.random();

      this.lifeArray[i] = this.time.elapsed;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    particlesGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    particlesGeometry.setAttribute(
      "life",
      new THREE.BufferAttribute(this.lifeArray, 1)
    );

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      this.particlesMaterial
    );

    particlesMesh.life = 0;

    this.particles.add(particlesMesh);
  }

  updateParticles() {
    this.particles.children.forEach((el, cur) => {
      //console.log(el.geometry.attributes);
      if (el.life > 50) {
        const object = this.particles.children[cur];

        object.geometry.dispose();
        this.particles.remove(object);
      } else {
        el.life++;
      }
    });
  }

  update() {
    if (this.fairyPosition) this.fairyPosition.update();

    if (this.particlesMaterial) {
      this.particlesMaterial.uniforms.uTime.value = this.time.elapsed;
    }

    if (this.fairyPosition.positions) {
      if (Math.floor(this.time.elapsed / 50) != this.timeElapsed) {
        this.timeElapsed = Math.floor(this.time.elapsed / 50);
        if (this.fairyPosition.isFairyMoving()) {
          this.addParticles();
        }
        this.updateParticles();
      }
    }
  }
}
