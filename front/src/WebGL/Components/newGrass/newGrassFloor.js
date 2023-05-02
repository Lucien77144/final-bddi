import Experience from "webgl/Experience.js";
import Grass from "./Grass.js";
import { DoubleSide, Group, Mesh, MeshBasicMaterial, Plane, Vector3 } from "three";

export default class newGrassFloor {
  constructor(
    _position = new Vector3(8, 4, 0),
    _displacement = "displacementMap"
  ) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.position = _position;
    this.displacement = _displacement;
    this.name = `grassFloor-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`;

    this.grassParameters = {
      count: 1000,
      size: 3,
    };
    this.grassGroups = [];

    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder({ title: "grass", expanded: false });
    // }

    this.setGeometry();
    this.setMaterials();
    this.setGround();
  }

  setGrass(mesh, limitBlend) {
    mesh.material = this.material;
    mesh.ignoreEnvironment = true;

    const group = new Group();
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
      params : limitBlend,
    }

    for (var i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      const anglePower = 0.75;
      const normal = new Vector3(normals[i], normals[i+1], normals[i+2]);
      const angleX = -Math.atan2(normal.y, normal.z) + Math.PI/2;
      const angleZ = -Math.atan2(normal.x, normal.y);

      this.grass = new Grass(
        mesh,
        this.grassParameters.size,
        this.grassParameters.count,
        {x, y, z},
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

  setGeometry() {
    this.geometry = new Plane(1, 1, 1, 1);
  }

  setMaterials() {
    this.material = new MeshBasicMaterial({
      color: 0xff0000,
      side: DoubleSide,
      // map: this.resources.items[this.displacement],
    });
  }

  setGround() {
    console.log(this.geometry);
    console.log(this.material);
    this.mesh = new Mesh(this.geometry, this.material);
    // this.mesh.position.copy(this.position);
    this.mesh.name = this.name;
    this.scene.add(this.mesh);
  }

  update() {
    this.grassGroups.forEach((group) => {
      group.children.forEach((e) => {
        e.update(this.time.elapsed);
      });
    })
  }
}