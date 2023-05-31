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
    this.position = _position;
    this.size = _size;

    this.noiseMap = this.resources.items.noiseMap;
    this.noiseMap.wrapS = this.noiseMap.wrapT = THREE.RepeatWrapping;
    this.noiseMap.minFilter = THREE.NearestFilter;
    this.noiseMap.magFilter = THREE.NearestFilter;

    this.dudvMap = this.resources.items.dudvMap;
    this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;

    this.envMap = this.resources.items.environmentMapTexture

    this.setMaterial();
    this.setWater();
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.merge([
        THREE.UniformsLib['fog'],
        this.uniforms = {
          uTime: { value: this.uTime },
          tNoise: { value: this.noiseMap },
          tDudv: { value: this.dudvMap },
          topDarkColor : { value: new THREE.Color('#ffffff') }, // 8C8C8C
          bottomDarkColor : { value: new THREE.Color('#dbdbdb') }, // 2D2D2D
          topLightColor : { value: new THREE.Color('#334dc1') }, //080D22
          bottomLightColor : { value: new THREE.Color('#0d4886') }, // 031222
          foamColor : { value: new THREE.Color('#ffffff') },
          uColorMask: { value: new THREE.Color('#212032') },
          uEnvMap: { value: this.envMap },
          uSize: { value: this.size },
        }
      ]),
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentShader,
      fog : true,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }

  setWater() {
    this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.y, this.size.x, this.size.y, 1, true);

    this.water = new THREE.Mesh(this.geometry, this.material);
    this.water.position.set(this.position.x, this.position.y, this.position.z);
    this.water.rotation.x = -Math.PI / 2;
    this.water.rotation.z = Math.PI / 2;

    this.world.add(this.water);
  }

  update() {
    this.uTime = this.time.elapsed * 0.0005;
    this.material.uniforms.uTime.value = this.uTime;
  }
}
