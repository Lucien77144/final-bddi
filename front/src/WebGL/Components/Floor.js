import Experience from "../Experience.js";
import Grass from "./Grass/Grass.js";
import * as THREE from "three";

import {
  Mesh,
  RepeatWrapping,
  sRGBEncoding,
} from "three";

export default class Floor {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.grassParameters = {
      count: 750,
      size: 3,
    };

    this.grassGroup = new THREE.Group();

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: "grass" });
    }

    this.setGeometry();
    this.setTextures();
    this.setMesh();

    this.setGround();

    this.time.on("tick", () => {
      this.update();
    });
  }

  setGrass() {
    if (this.debug.active) {
      this.debugFolder.addInput(this.grassParameters, "count", { min: 100, max: 100000, step : 1 })
        .on("change", () => {
          this.grassGroup.children.forEach((grass) => {
            grass.updateGrass(this.grassParameters.size, this.grassParameters.count)
          })
        })
      ;
      this.debugFolder.addInput(this.grassParameters, "size", { min: 1, max: 100, step : 1 })
        .on("change", () => {
          this.grassGroup.children.forEach((grass) => {
            grass.updateGrass(this.grassParameters.size, this.grassParameters.count)
          })
        })
      ;
      
    }

    var mesh = this.ground.children[2]; // Votre mesh
    console.log(mesh.material);
    var positions = mesh.geometry.attributes.position.array;
    var normals = mesh.geometry.attributes.normal.array;

    for (var i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const normal = new THREE.Vector3(normals[i], normals[i+1], normals[i+2]);
      const angleX = -Math.atan2(normal.y, normal.z) + Math.PI/2;
      const angleZ = -Math.atan2(normal.x, normal.y);

      this.grass = new Grass(this.grassParameters.size, this.grassParameters.count, x, y, z).clone();
      this.grass.rotation.x = angleX * .75;
      this.grass.rotation.z = angleZ * .75;
  
      this.grassGroup.add(this.grass);
    }
    this.grassGroup.position.set(0, 0.5, 2.5);
    this.scene.add(this.grassGroup);
  }

  update() {
    this.grassGroup.children.forEach(element => {
      element.update(this.time.elapsed);
    });
  }

  setGeometry() {}

  setGround() {
    this.ground = this.resources.items.groundModel.scene;
    this.ground.position.set(0, 0, 0);
    this.setGrass();
    this.scene.add(this.ground);
  }

  setTextures() {
    this.textures = {};

    this.textures.color = this.resources.items.grassColorTexture;
    this.textures.color.encoding = sRGBEncoding;
    this.textures.color.repeat.set(1.5, 1.5);
    this.textures.color.wrapS = RepeatWrapping;
    this.textures.color.wrapT = RepeatWrapping;

    this.textures.normal = this.resources.items.grassNormalTexture;
    this.textures.normal.repeat.set(1.5, 1.5);
    this.textures.normal.wrapS = RepeatWrapping;
    this.textures.normal.wrapT = RepeatWrapping;
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.mesh.name = "floor";
    this.scene.add(this.mesh);
  }
}