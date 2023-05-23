import waterVertexShader from "./shaders/vertexShader.glsl";
import waterFragmentShader from "./shaders/fragmentShader.glsl";
import Experience from "@/WebGL/Experience";
import * as THREE from "three";

export default class River {
  constructor({
    _position = new THREE.Vector3(0, 0, 0),
    _size = new THREE.Vector2(8, 16),
  } = {}) {
    this.experience = new Experience();
    this.world = this.experience.activeScene.world;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.uTime = 0;

    this.noiseMap = this.resources.items.noiseMap;
    this.noiseMap.wrapS = this.noiseMap.wrapT = THREE.RepeatWrapping;
    this.noiseMap.minFilter = THREE.NearestFilter;
    this.noiseMap.magFilter = THREE.NearestFilter;

    this.dudvMap = this.resources.items.dudvMap;
    this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;

    this.setUniforms();
    this.setMaterial();
    this.setWater(_position, _size);
  }

  setUniforms() {
    this.uniforms = {
      uTime: { value: this.uTime },
      tNoise: { value: this.noiseMap },
      tDudv: { value: this.dudvMap },
      topDarkColor : { value: new THREE.Color('#4e7a71') },
      bottomDarkColor : { value: new THREE.Color('#0e7562') },
      topLightColor : { value: new THREE.Color('#b0f7e9') },
      bottomLightColor : { value: new THREE.Color('#14c6a5') },
      foamColor : { value: new THREE.Color('#ffffff') },
      uColorMask: { value: new THREE.Color('#313042') },
      uWaveFrequency : { value: 0.5 },
      uWaveAmplitude : { value: 0.5 },
    }
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['fog'],
        this.uniforms  
      ]),
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      fog : true,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }

  setWater(position, size) {
    this.geometry = new THREE.PlaneGeometry(size.x, size.y, size.x, size.y, 1, true);

    this.water = new THREE.Mesh(this.geometry, this.material);
    this.water.position.set(position.x, position.y, position.z);
    this.water.rotation.x = -Math.PI / 2;
    this.water.rotation.z = Math.PI / 2;

    this.world.add(this.water);
  }

  update() {
    this.uTime = this.time.elapsed * 0.0005;
    this.material.uniforms.uTime.value = this.uTime;
  }
}
