import Experience from "webgl/Experience.js";
import {
  AmbientLight,
  Mesh,
  MeshStandardMaterial,
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
  }

  setSunLight() {
    this.ambiantLight = new AmbientLight("#ffffff", .5);
    // this.ambiantLight = new AmbientLight("#fffb96", 2);
    this.ambiantLight.position.set(3.5, 2, -1.25);
    this.ambiantLight.name = "ambiantLight";
    this.scene.add(this.ambiantLight);

    this.sunLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    this.sunLight.position.set(0, 10, 0);
    this.sunLight.name = "sunLight";
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);

    // Debug
    if (this.debug.active) {
      this.debugFolder.addInput(this.ambiantLight, "intensity", {
        min: 0,
        max: 10,
        step: 0.001,
        label: "ambiantLightIntensity",
      });
    }
  }
  

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = .5;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;

    this.environmentMap.updateMaterials = () => {
      this.scene.traverse((child) => {
        if (
          child instanceof Mesh &&
          child.material instanceof MeshStandardMaterial &&
          !child.ignoreEnvironment
        ) {
          child.material.envMap = this.environmentMap.texture;
          child.material.needsUpdate = true;
          child.material.envMapIntensity = this.environmentMap.intensity;
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
}