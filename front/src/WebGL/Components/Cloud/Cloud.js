// import shaders
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import Experience from "@/WebGL/Experience";
import * as THREE from "three";

export default class Cloud {
  constructor(_size = new THREE.Vector3(150, 8, 30)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.activeScene = this.experience.activeScene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.size = _size;
    this.camera = this.experience.camera.instance;

    this.setCloud();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(this.size.x, this.size.z, 60, 20);
  }

  setMaterial() {
    const textureB = this.resources.items.cloudBack;
    textureB.wrapS = THREE.RepeatWrapping;
    textureB.wrapT = THREE.RepeatWrapping;
    textureB.repeat.set(1, 1);

    const textureM = this.resources.items.mountain;
    textureM.wrapS = THREE.RepeatWrapping;
    textureM.wrapT = THREE.RepeatWrapping;
    textureM.repeat.set(1, 1);

    const shadowM = this.resources.items.mountainS;
    shadowM.wrapS = THREE.RepeatWrapping;
    shadowM.wrapT = THREE.RepeatWrapping;
    shadowM.repeat.set(1, 1);

    const floorColors = this.activeScene?.floors && this.activeScene?.floors[0].grassParameters?.colors;

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uBack: { value: textureB },
        uMountain: { value: textureM },
        uMountainS: { value: shadowM },
        uPrimary: { value: floorColors?.base || (new THREE.Color('#11382a')) },
        uSecondary: { value: new THREE.Color('#fafafa') },
        uSecondary2: { value: new THREE.Color('#777777') },
        uShadowColor: { value: new THREE.Color('#161616') },
      },
      vertexShader,
      fragmentShader,
    });
  }

  setCloud() {
    this.setGeometry();
    this.setMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "cloudBackground";
    this.mesh.position.set(-this.size.x/2, this.size.y + 8, 0);
    this.mesh.rotation.set(0, Math.PI/2, 0);

    this.scene.add(this.mesh);
  }

  update() {
    this.uTime = this.time.elapsed * 0.0005;
    this.material.uniforms.uTime.value = this.time.elapsed * .001;
    this.mesh.position.z = this.camera.position.z / 1.75; 
  }
}