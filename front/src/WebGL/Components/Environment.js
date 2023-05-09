import Experience from "webgl/Experience.js";
import {
  AmbientLight,
  Mesh,
  MeshStandardMaterial,
  sRGBEncoding,
} from "three";
import * as THREE from "three";

export default class Environment {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: "environment", expanded: false });
    }

    this.setSunLight();
    this.setEnvironmentMap();
    this.setCloudBackground();
  }

  setSunLight() {
    this.sunLight = new AmbientLight("#96ffd6", 2);
    this.sunLight.position.set(3.5, 2, -1.25);
    this.sunLight.name = "sunLight";
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder.addInput(this.sunLight, "intensity", {
        min: 0,
        max: 10,
        step: 0.001,
        label: "sunLightIntensity",
      });
    }
  }
  

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 1.5;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = sRGBEncoding;

    // this.scene.environment = this.environmentMap.texture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial &&
          !child.ignoreEnvironment
        ) {
          // child.material.envMap = this.environmentMap.texture;
          child.material.envMapIntensity = this.environmentMap.intensity;
          child.material.needsUpdate = true;
        }
      });
    };
    this.environmentMap.updateMaterials();

    // Debug
    if (this.debug.active) {
      this.debugFolder
        .addInput(this.environmentMap, "intensity", {
          min: 0,
          max: 4,
          step: 0.001,
          label: "envMapIntensity",
        })
        .on("change", this.environmentMap.updateMaterials);
    }
  }

  setCloudBackground() {
    // set video
    this.video = document.getElementById("myVideo");

    this.videoTexture = new THREE.VideoTexture(this.video);
    this.videoTexture.encoding = sRGBEncoding;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;


    // set plane with texture
    this.geometry = new THREE.PlaneGeometry(150, 50);
    this.material = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side : THREE.DoubleSide,
      transparent: false,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "cloudBackground";
    this.mesh.material.depthTest = true;
    this.mesh.material.depthWrite = true;
    this.mesh.position.set(-50, 8, 0);
    this.mesh.rotation.set(0, Math.PI/2, 0);

    this.scene.add(this.mesh);
  }
}