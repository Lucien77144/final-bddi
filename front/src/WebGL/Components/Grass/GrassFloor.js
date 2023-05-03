import Experience from "webgl/Experience.js";
import Grass from "./Grass.js";
import * as THREE from "three";

let instance = null;

export default class GrassFloor {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.grassParameters = {
      count: 1750,
      size: 4,
    };
    this.grassGroups = [];

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "grass",
        expanded: false,
      });
    }

    this.setMaterials();
    this.setGround();
  }

  setGrass(mesh, limitBlend) {
    mesh.material = this.material;
    mesh.ignoreEnvironment = true;

    const group = new THREE.Group();
    const positions = mesh.geometry.attributes.position.array;
    const normals = mesh.geometry.attributes.normal.array;

    const limits = {
      min: {
        x: mesh.geometry.boundingBox.min.x * mesh.scale.x,
        y: mesh.geometry.boundingBox.min.y * mesh.scale.y,
        z: mesh.geometry.boundingBox.min.z * mesh.scale.z,
      },
      max: {
        x: mesh.geometry.boundingBox.max.x * mesh.scale.x,
        y: mesh.geometry.boundingBox.max.y * mesh.scale.y,
        z: mesh.geometry.boundingBox.max.z * mesh.scale.z,
      },
      params: limitBlend,
    };

    for (var i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const anglePower = 0.75;
      const normal = new THREE.Vector3(
        normals[i],
        normals[i + 1],
        normals[i + 2]
      );
      const angleX = -Math.atan2(normal.y, normal.z) + Math.PI / 2;
      const angleZ = -Math.atan2(normal.x, normal.y);

      this.grass = new Grass(
        mesh,
        this.grassParameters.size,
        this.grassParameters.count,
        { x, y, z },
        limits
      );
      this.grass.rotation.x = angleX * anglePower;
      this.grass.rotation.z = angleZ * anglePower;

      group.add(this.grass);
    }
    group.position.copy(mesh.position);
    this.grassGroups.push(group);
    this.scene.add(group);
  }

  setGround() {
    this.grounds = this.resources.items.groundModel.scenes[0];
    this.ground = [this.grounds.children[0], this.grounds.children[2]];

    this.grounds.position.set(0, 0, 0);
    this.scene.add(this.grounds);

    this.setGrass(this.ground[0], {
      left: {
        y: 0.2, // y coordinates (under is not printed)
        offset_start: 15, // %, -1 = disabled,
        offset_end: 25, // %
        fade_density: 25, // %
      },
    });
    this.setGrass(this.ground[1], {
      right: {
        y: 0.2, // y coordinates (under is not printed)
        offset_start: 15, // %, -1 = disabled,
        offset_end: 25, // %
        fade_density: 50, // %
      },
    });
    // this.setGrassDebug();
  }

  setMaterials() {
    this.material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#040f0b"),
    });
  }

  setGrassDebug() {
    if (this.debug.active) {
      this.debugFolder
        .addInput(this.grassParameters, "count", {
          min: 0,
          max: 10000,
          step: 50,
        })
        .on("change", () => {
          this.grassGroups.forEach((group) => {
            group.children.forEach((e) => {
              e.updateGrass(
                this.grassParameters.size,
                this.grassParameters.count
              );
            });
          });
        });

      this.debugFolder
        .addInput(this.grassParameters, "size", { min: 1, max: 10, step: 1 })
        .on("change", () => {
          this.grassGroups.forEach((group) => {
            group.children.forEach((e) => {
              e.updateGrass(
                this.grassParameters.size,
                this.grassParameters.count
              );
            });
          });
        });

      this.debugFolder.addInput(this.material, "wireframe");
    }
  }

  update() {
    this.grassGroups.forEach((group) => {
      group.children.forEach((e) => {
        e.update(this.time.elapsed);
      });
    });
  }
}
