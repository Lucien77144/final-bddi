import * as THREE from "three";
import Experience from "webgl/Experience.js";
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import Fairy from "./Fairy.js";

export default class FairyDust {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.fairy = new Fairy(new THREE.Vector3(0, 5, 12));

    console.log(this.fairy);

    this.particles = new THREE.Group();
    this.scene.add(this.particles);

    this.particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      // blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uGravity: { value: .5 },
        uColor: { value: new THREE.Color('#faf2af') },
        uFadeIn: { value: .1 },
        uFadeOut: { value: 0.5 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader,
      fragmentShader,
    });
  }

  addParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 15;

    const posArray = new Float32Array(particlesCnt * 3);
    const scaleArray = new Float32Array(particlesCnt);
    const coordsMax = new Float32Array(particlesCnt * 3);
    this.lifeArray = new Float32Array(particlesCnt);

    for (let i = 0; i < particlesCnt; i++) {
      posArray[i * 3 + 0] = this.fairy.model.position.x;
      posArray[i * 3 + 1] = this.fairy.model.position.y;
      posArray[i * 3 + 2] = this.fairy.model.position.z;

      coordsMax[i * 3 + 0] = (Math.random()-.5) * .5;
      coordsMax[i * 3 + 1] = (Math.random()-.5) * .5;
      coordsMax[i * 3 + 2] = (Math.random()-.5) * .5;

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
      "aCoordsMax",
      new THREE.BufferAttribute(coordsMax, 3)
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

  /**
   * 
   * @param {number} mean La moyenne de la distribution
   * @param {number} stdDev L'écart-type de la distribution
   * @returns {number} Coordonnée y selon la distribution aléatoire gaussienne
   */
  gaussianRandom(mean, stdDev) {
    let u = 0,
      v = 0;
    while (u === 0) u = Math.random(); // Éviter la valeur 0 pour éviter les problèmes de log
    while (v === 0) v = Math.random();
    const rand = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + stdDev * rand;
  }

  /**
   * Get the angle randomly
   * @param {string} axis set if cos or sin.
   * @returns {number} angle
   */
  getAngleFactor(axis) {
    const getFactor = (angle = Math.random() * 2) => Math.random() * angle * 2 * 0.2;
    return Math[axis == "sin" ? "sin" : "cos"](getFactor(Math.PI)) * getFactor() * (1 + Math.random())
  }

  updateParticles() {
    this.particles.children.forEach((el, cur) => {
      if (el.life > 150) {
        const object = this.particles.children[cur];

        object.geometry.dispose();
        this.particles.remove(object);
      } else {
        el.life++;
      }
    });
  }

  update() {
    if (this.fairy) {
      this.fairy.update();

      if (this.particlesMaterial) {
        this.particlesMaterial.uniforms.uTime.value = this.time.elapsed;
      }

      if (Math.floor(this.time.elapsed / 10) != this.timeElapsed) {
        this.timeElapsed = Math.floor(this.time.elapsed / 10);
        if (this.fairy.isFairyMoving()) {
          this.addParticles();
        }
        this.updateParticles();
      }
    }
  }
}
