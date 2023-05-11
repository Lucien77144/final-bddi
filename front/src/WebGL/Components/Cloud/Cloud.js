// import shaders
import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";
import Experience from "@/WebGL/Experience";
import * as THREE from "three";

export default class Cloud {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;

    this.setCloud();
  }

  setGeometry() {
    this.geometry = new THREE.PlaneGeometry(150, 50);
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      }
    });
  }

  setCloud() {
    this.setGeometry();
    this.setMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "cloudBackground";
    
    // this.mesh.material.depthTest = true;
    // this.mesh.material.depthWrite = true;

    this.mesh.position.set(-50, 8, 0);
    this.mesh.rotation.set(0, Math.PI/2, 0);

    // this.mesh.material.ignoreEnvironment = true;

    this.scene.add(this.mesh);
  }

  update() {
    this.uTime = this.time.elapsed * 0.0005;
    this.material.uniforms.uTime.value = this.time.elapsed * .001;
  }
}
