import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
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
    this.fairy = new Fairy();

    this.particles = new Group();
    this.scene.add(this.particles);

    this._options = {
      width: 50,
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
        isFairyMoving: { value: false },
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });
  }

  _setMesh() {
    this._mesh = new Points(this._geometry, this._material);
    this._mesh.name = "Dust";
    this.scene.add(this._mesh);
  }

  initGPU() {
    this.gpuCompute = new GPUComputationRenderer(
      this._options.width,
      this._options.width,
      this.renderer
    );
    this.dtPosition = this.gpuCompute.createTexture();
    this.fillPositions(this.dtPosition);

    this.positionVariable = this.gpuCompute.addVariable(
      "positionTexture",
      fragmentSimulation,
      this.dtPosition
    );

    this.positionVariable.material.uniforms = {
      uTime: { value: 0 },
      fairyPosition: { value: new Vector3(0, 0, 0) },
    };

    this.fairy.on("moveFairy", (x, y, z) => {
      this.positionVariable.material.uniforms.fairyPosition.value = new Vector3(
        x,
        y,
        z
      );
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

  fillPositions(textureData) {
    const posArr = textureData.image.data;

    for (let i = 0; i < posArr.length; i = i + 4) {
      //const x = Math.random() * 1 - 0.5;
      const x = this.fairy.model.position.x;
      // const y = Math.random() * 1 - 0.5;
      const y = this.fairy.model.position.y;
      // const z = Math.random() * 0.1 - 0.05 + 0.1;
      const z = this.fairy.model.position.z;

      posArr[i] = x;
      posArr[i + 1] = y;
      posArr[i + 2] = z;
      posArr[i + 3] = 1;
    }
  }

  update() {
    if (this.fairy) this.fairy.update();

    this.positionVariable.material.uniforms.uTime.value += this.time.delta;
    this._material.uniforms.uTime.value += this.time.delta;

    this.gpuCompute.compute();
    this._material.uniforms.positionTexture.value =
      this.gpuCompute.getCurrentRenderTarget(this.positionVariable).texture;

    this._material.uniforms.isFairyMoving.value = this.fairy.isFairyMoving();
  }
}
