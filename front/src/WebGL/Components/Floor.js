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
    this.grassGroups = [];

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: "grass" });
    }

    this.setTextures();
    this.setMesh();

    this.setGround();

    this.time.on("tick", () => {
      this.update();
    });
  }

  setGrass(mesh) {
    const group = new THREE.Group();
    const positions = mesh.geometry.attributes.position.array;
    const normals = mesh.geometry.attributes.normal.array;

    for (var i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const anglePower = 0.75;
      const normal = new THREE.Vector3(normals[i], normals[i+1], normals[i+2]);
      const angleX = -Math.atan2(normal.y, normal.z) + Math.PI/2;
      const angleZ = -Math.atan2(normal.x, normal.y);

      this.grass = new Grass(mesh.scale, this.grassParameters.size, this.grassParameters.count, x, y, z);
      this.grass.rotation.x = angleX * anglePower;
      this.grass.rotation.z = angleZ * anglePower;
  
      group.add(this.grass);
    }
    group.position.copy(mesh.position);
    this.grassGroups.push(group);
    this.scene.add(group);
  }

  setGrassDebug() {
    if (this.debug.active) {
      this.debugFolder.addInput(this.grassParameters, "count", { min: 100, max: 10000, step : 50 })
        .on("change", () => {
          this.grassGroups.forEach((group) => {
            group.children.forEach((e) => {
              e.updateGrass(this.grassParameters.size, this.grassParameters.count)
            });
          })
        })
      ;
      this.debugFolder.addInput(this.grassParameters, "size", { min: 1, max: 10, step : 1 })
        .on("change", () => {
          this.grassGroups.forEach((group) => {
            group.children.forEach((e) => {
              e.updateGrass(this.grassParameters.size, this.grassParameters.count)
            });
          })
        })
      ;
    }
  }

  update() {
    this.grassGroups.forEach((group) => {
      group.children.forEach((e) => {
        e.update(this.time.elapsed);
      });
    })
  }

  setGround() {
    this.ground = this.resources.items.groundModel.scene;
    this.ground.position.set(0, 0, 0);
    this.scene.add(this.ground);

    this.setGrass(this.ground.children[2]);
    this.setGrass(this.ground.children[3]);
    this.setGrassDebug();
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