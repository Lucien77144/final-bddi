import * as THREE from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";

import Experience from "../Experience.js";

import FairyPosition from "./FairyPosition.js";

import fairyDustVertexShader from "../Shaders/fairyDust/vertex.glsl";
import fairyDustFragmentShader from "../Shaders/fairyDust/fragment.glsl";
import fragmentSimulation from "../Shaders/fairyDust/fragmentSimulation.frag";

export default class FairyDust {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.renderer = this.experience.renderer.instance;

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
        uSize: { value: 100 }
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });

    console.log(this.experience);

    this._options = {
      width: 100,
    };

    this._setGeometry();
    this._setMaterial();

    this._setMesh();

    this.initGPGPU();
    // this.addParticles();
  }

  // addParticles() {
  //   const particlesGeometry = new THREE.BufferGeometry();
  //   const particlesCnt = 10;

  //   const posArray = new Float32Array(particlesCnt * 3);
  //   const scaleArray = new Float32Array(particlesCnt);
  //   this.lifeArray = new Float32Array(particlesCnt);

  //   const radius = Math.random() * 2;

  //   for (let i = 0; i < particlesCnt; i++) {
  //     posArray[i * 3 + 0] =
  //       this.fairyPosition.positions[this.fairyPosition.positions.length - 3] -
  //       Math.pow(Math.random(), 5) *
  //         (Math.random() < 0.5 ? 1 : -1) *
  //         0.2 *
  //         radius;
  //     posArray[i * 3 + 1] =
  //       this.fairyPosition.positions[this.fairyPosition.positions.length - 2];

  //     posArray[i * 3 + 2] =
  //       this.fairyPosition.positions[this.fairyPosition.positions.length - 1] +
  //       Math.pow(Math.random(), 5) *
  //         (Math.random() < 0.5 ? 1 : -1) *
  //         0.2 *
  //         radius;

  //     scaleArray[i] = Math.random();

  //     this.lifeArray[i] = this.time.elapsed;
  //   }

  //   particlesGeometry.setAttribute(
  //     "position",
  //     new THREE.BufferAttribute(posArray, 3)
  //   );

  //   particlesGeometry.setAttribute(
  //     "aScale",
  //     new THREE.BufferAttribute(scaleArray, 1)
  //   );

  //   particlesGeometry.setAttribute(
  //     "life",
  //     new THREE.BufferAttribute(this.lifeArray, 1)
  //   );

  //   const particlesMesh = new THREE.Points(
  //     particlesGeometry,
  //     this.particlesMaterial
  //   );

  //   particlesMesh.life = 0;

  //   this.particles.add(particlesMesh);
  // }

  _setGeometry() {
    this._geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(
      this._options.width * this._options.width * 3
    );
    const reference = new Float32Array(
      this._options.width * this._options.width * 2
    );

    const scaleArray = new Float32Array(this._options.width ** 2);

    const lifeArray = new Float32Array(this._options.width ** 2);

    for (let i = 0; i < this._options.width ** 2; i++) {
      const x = Math.random();
      const y = Math.random();
      const z = Math.random();
      const xx = (i % this._options.width) / this._options.width;
      const yy = ~~(i / this._options.width) / this._options.width;

      lifeArray[i] = this.time.elapsed;

      scaleArray[i] = Math.random();

      positions.set([x, y, z], i * 3);
      reference.set([xx, yy], i * 2);
    }

    this._geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    this._geometry.setAttribute(
      "reference",
      new THREE.BufferAttribute(reference, 2)
    );

    this._geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    this._geometry.setAttribute(
      "life",
      new THREE.BufferAttribute(lifeArray, 1)
    );
  }

  _setMaterial() {
    this._material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        time: { value: 0 },
        positionTexture: { value: null },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });
  }

  _setMesh() {
    this._mesh = new THREE.Points(this._geometry, this._material);
    this._mesh.name = "Dust";
    this.scene.add(this._mesh);
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

  initGPGPU() {
    this.gpuCompute = new GPUComputationRenderer(
      this._options.width,
      this._options.width,
      this.renderer
    );
    this.dtPosition = this.gpuCompute.createTexture();
    this.fillPositions(this.dtPosition);
    console.log(this.dtPosition);

    this.positionVariable = this.gpuCompute.addVariable(
      "positionTexture",
      fragmentSimulation,
      this.dtPosition
    );

    this.positionVariable.material.uniforms = {
      time: { value: 0 },
      fairyPosition: { value: new THREE.Vector2(0, 0) },
    };

    this.fairyPosition.on("moveFairy", (x, y) => {
      this.positionVariable.material.uniforms.fairyPosition.value =
        new THREE.Vector2(x, y);
    });

    this.positionVariable.wrapS = this.positionVariable.wrapT =
      THREE.RepeatWrapping;
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
    ]);

    const error = this.gpuCompute.init();

    if (error !== null) {
      console.error(error);
    }
  }

  fillPositions(textureData) {
    const posArr = textureData.image.data;

    // console.log("pos", posArr);
    for (let i = 0; i < posArr.length; i = i + 4) {
      //const x = Math.random() * 1 - 0.5;
      const x =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 3] -
        Math.pow(Math.random(), 5) * (Math.random() < 0.5 ? 1 : -1) * 0.2;
      // const y = Math.random() * 1 - 0.5;
      const y =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 2];
      // const z = Math.random() * 0.1 - 0.05 + 0.1;
      const z =
        this.fairyPosition.positions[this.fairyPosition.positions.length - 1] +
        Math.pow(Math.random(), 5) * (Math.random() < 0.5 ? 1 : -1) * 0.2;

      posArr[i] = x;
      posArr[i + 1] = y;
      posArr[i + 2] = z;
      posArr[i + 3] = 1;
    }
  }

  update() {
    if (this.fairyPosition) this.fairyPosition.update();

    // if (this.particlesMaterial) {
    //   this.particlesMaterial.uniforms.uTime.value = this.time.elapsed;
    // }

    // if (this.fairyPosition.positions) {
    //   if (Math.floor(this.time.elapsed / 50) != this.timeElapsed) {
    //     this.timeElapsed = Math.floor(this.time.elapsed / 50);
    //     if (this.fairyPosition.isFairyMoving()) {
    //       this.addParticles();
    //     }
    //     this.updateParticles();
    //   }
    // }

    this.positionVariable.material.uniforms.time.value += this.time.delta;

    this.gpuCompute.compute();
    this._material.uniforms.positionTexture.value =
      this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;
  }
}
