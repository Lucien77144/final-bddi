import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  RepeatWrapping,
  ShaderMaterial,
  Vector3,
} from "three";
import { GPUComputationRenderer } from "three/examples/jsm/misc/GPUComputationRenderer.js";

import Experience from "../../Experience";

import Fairy from "./Fairy.js";

import fairyDustVertexShader from "./shaders/vertexShader.glsl";
import fairyDustFragmentShader from "./shaders/fragmentShader.glsl";
import fragmentSimulation from "./shaders/fragmentSimulation.glsl";

export default class FairyDust {
  constructor() {
    this.experience = new Experience();
    this.time = this.experience.time;
    this.scene = this.experience.scene;
    this.sizes = this.experience.sizes;
    this.renderer = this.experience.renderer.instance;
    this.camera = this.experience.camera.instance;
    this.fairy = new Fairy();
    this.fairyParams = {
      status: false,
      time: 0,
    };

    this._options = {
      width: 100,
    };

    this._setGeometry();
    this._setMaterial();

    this._setMesh();

    this.initGPU();
  }

  _setGeometry() {
    this._geometry = new BufferGeometry();

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

    this._geometry.setAttribute("position", new BufferAttribute(positions, 3));
    this._geometry.setAttribute("reference", new BufferAttribute(reference, 2));

    this._geometry.setAttribute("aScale", new BufferAttribute(scaleArray, 1));

    this._geometry.setAttribute("life", new BufferAttribute(lifeArray, 1));
  }

  _setMaterial() {
    this._material = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        positionTexture: { value: null },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
        uColor: { value: new Color("#faf2af") },
        uFadeIn: { value: 0.1 },
        uFadeOut: { value: 0.5 },
        uTime: { value: 0 },
        uFairyDistance: { value: 0 },
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });
  }

  _setMesh() {
    this._mesh = new Points(this._geometry, this._material);
    this._mesh.name = "Dust";
    this._mesh.frustumCulled = false;
    this.scene.add(this._mesh);
  }

  initGPU() {
    this.gpuCompute = new GPUComputationRenderer(
      this._options.width,
      this._options.width,
      this.renderer
    );

    this.positionVariable = this.gpuCompute.addVariable(
      "positionTexture",
      fragmentSimulation
    );

    this.positionVariable.material.uniforms = {
      uTime: { value: 0 },
      uFairyPosition: { value: new Vector3(0, 0, 0) },
      uFairyDistance: { value: 0 },
    };

    this.fairy.on("moveFairy", (x, y, z) => {
      this.positionVariable.material.uniforms.uFairyPosition.value = new Vector3(x, y, z);
    });

    this.positionVariable.wrapS = this.positionVariable.wrapT = RepeatWrapping;
    this.gpuCompute.setVariableDependencies(this.positionVariable, [
      this.positionVariable,
    ]);

    const error = this.gpuCompute.init();
    if (error !== null) {
      console.error(error);
    }
  }

  update() {
    if (this.fairy) this.fairy.update();

    this.positionVariable.material.uniforms.uTime.value += this.time.delta;
    this._material.uniforms.uTime.value += this.time.delta;

    this.gpuCompute.compute();
    console.log(this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture);
    this._material.uniforms.positionTexture.value = this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;

    if (this.fairy.distFairyToMouse > 0.5 != this.fairyParams.status) {
      this.fairyParams.status = this.fairy.distFairyToMouse > 0.5;
    }
    if (this.fairyParams.status) {
      this.fairyParams.time = this.time.elapsed;
    }

    if (
      this.fairy.distFairyToMouse > 0.5 &&
      this.time.elapsed - this.fairyParams.time
    ) {
      this.fairyParams.time = this.time.elapsed;
    }

    const time = 1 - Math.min(this.time.elapsed - this.fairyParams.time, 1000) / 1000;
    this.positionVariable.material.uniforms.uFairyDistance.value = time;
    this._material.uniforms.uFairyDistance.value = time;
  }
}
