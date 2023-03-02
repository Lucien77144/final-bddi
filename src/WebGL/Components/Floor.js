import Experience from "../Experience.js";
import Grass from "./Grass/Grass.js";
import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
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
      count: 1000,
      size: 0,
    };

    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: "grass" });

    }

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    this.setGrass();

    this.time.on("tick", () => {
      this.update();
    });
  }

  setGrass() {
    // Debug

    if (this.debug.active) {
      this.debugFolder.addInput(this.grassParameters, "count", { min: 100, max: 100000, step : 1 })
        .on("change", () => {
          this.grass.updateGrass(this.grassParameters.size, this.grassParameters.count)
        })
      ;
      this.debugFolder.addInput(this.grassParameters, "size", { min: 1, max: 100, step : 1 })
        .on("change", () => {
          this.grass.updateGrass(this.grassParameters.size, this.grassParameters.count)
        })
      ;
      
    }
    this.grass = new Grass(this.grassParameters.size, this.grassParameters.count);
    this.scene.add(this.grass);
  }

  update() {
    this.grass.update(this.time.elapsed);
  }

  setGeometry() {
    this.geometry = new CircleGeometry(5, 64);
    this.grassParameters.size = this.geometry.parameters.radius * 2
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

  setMaterial() {
    this.material = new MeshStandardMaterial({
      map: this.textures.color,
      normalMap: this.textures.normal,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.mesh.name = "floor";
    this.scene.add(this.mesh);
  }
}
