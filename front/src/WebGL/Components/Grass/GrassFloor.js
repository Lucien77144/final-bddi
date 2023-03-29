import Experience from "../../Experience.js";
import Grass from "./Grass.js";
import * as THREE from "three";

import {
  RepeatWrapping,
  sRGBEncoding,
} from "three";

export default class GrassFloor {
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
      this.debugFolder = this.debug.ui.addFolder({ title: "grass", expanded: false });
    }

    this.setTextures();
    this.setMaterials();
    this.setGround();
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
        });
      this.debugFolder.addInput(this.grassParameters, "size", { min: 1, max: 10, step : 1 })
        .on("change", () => {
          this.grassGroups.forEach((group) => {
            group.children.forEach((e) => {
              e.updateGrass(this.grassParameters.size, this.grassParameters.count)
            });
          })
        });
    }
  }

  setGround() {
    this.ground = this.resources.items.groundModel.scene;
    this.ground.position.set(0, 0, 0);
    this.ground.children[0].material = this.material;
    this.scene.add(this.ground);

    this.setGrass(this.ground.children[0]);
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

  setMaterials() {
    this.material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#148538"),
    });
  }

  update() {
    this.grassGroups.forEach((group) => {
      group.children.forEach((e) => {
        e.update(this.time.elapsed);
      });
    })
  }
}