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
    // this.setCloudBackground();
  }

  setSunLight() {
    // this.sunLight = new AmbientLight("#fffb96", 1);
    this.ambiantLight = new AmbientLight("#ffffff", 1);
    this.ambiantLight.position.set(3.5, 2, -1.25);
    this.ambiantLight.name = "ambiantLight";

    this.scene.add(this.ambiantLight);


    this.sunLight =  new THREE.DirectionalLight( 0xffffff, 0.5 );
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
        label: "sunLightIntensity",
      });
    }
  }
  

  setEnvironmentMap() {
    this.environmentMap = {};
    this.environmentMap.intensity = 1;
    this.environmentMap.texture = this.resources.items.environmentMapTexture;
    this.environmentMap.texture.encoding = THREE.SRGBColorSpace;

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

  setCloudBackground() {
    // set video
    this.videoTexture = this.resources.items.cloudBackgroundTexture;

    this.videoTexture.source.data.muted = true;
    this.videoTexture.source.data.loop = true;
    this.videoTexture.source.data.play();

    this.videoTexture.SRGBColorSpace = THREE.SRGBColorSpace;
    this.videoTexture.minFilter = THREE.LinearFilter;
    this.videoTexture.magFilter = THREE.LinearFilter;

    // set plane with texture
    this.geometry = new THREE.PlaneGeometry(150, 50);
    this.material = new THREE.MeshBasicMaterial({
      map: this.videoTexture,
      side : THREE.DoubleSide,
      transparent: false,
      toneMapped: false,
    });
    
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.name = "cloudBackground";
    this.mesh.material.depthTest = true;
    this.mesh.material.depthWrite = true;

    this.mesh.position.set(-50, 8, 0);
    this.mesh.rotation.set(0, Math.PI/2, 0);
    this.mesh.material.ignoreEnvironment = true;

    this.scene.add(this.mesh);
  }
}