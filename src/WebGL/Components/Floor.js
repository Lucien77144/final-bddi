import Experience from "../Experience.js";
import Grass from "./Grass/Grass.js";
import * as THREE from "three";
import grassVertexShader from "./Grass/shaders/vertexShader.vert"
import grassFragmentShader from "./Grass/shaders/fragmentShader.frag"


import {
  CircleGeometry,
  Mesh,
  MeshStandardMaterial,
  RepeatWrapping,
  ShaderMaterial,
  sRGBEncoding,
} from "three";

export default class Floor {
  constructor() {

    
    this.grassVertexShader = grassVertexShader;
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.grassParameters = {
      count: 1000,
      size: 3,
    };

    this.grassGroup = new THREE.Group();

    // Debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({ title: "grass" });

    }

    this.setGeometry();
    this.setTextures();
    this.setMaterial();
    this.setMesh();
    // this.setGrass();

    // Set ground Model
    this.setGround();

    this.time.on("tick", () => {
      this.update();
    });
  }

  setGrass() {
    // Debug

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
    // for (let i = 0; i < this.ground.children[1].geometry.attributes.position.array.length; i++) {
    //   let zOffset = this.ground.children[1].geometry.attributes.position.array[i];
    //     this.grass = new Grass(this.grassParameters.size, this.grassParameters.count, zOffset, i * 0.03);
    //     this.scene.add(this.grass);
    // }

    // Put grass on ground mesh
    var mesh = this.ground.children[2]; // Votre mesh
    // Displacement map on mesh
    // this.ground.children[2].material.displacementMap = this.resources.items.grassDisplacementTexture;
    console.log(mesh.material);
    var positions = mesh.geometry.attributes.position.array;
    var normals = mesh.geometry.attributes.normal.array;

    for (var i = 0; i < positions.length; i += 3) {
        var x = positions[i];
        var y = positions[i + 1];
        var z = positions[i + 2];
        // Faites quelque chose avec les coordonnées (x, y, z)

        this.grass = new Grass(this.grassParameters.size, this.grassParameters.count, x, y, z);
        // this.grass = new Grass(x, y, z);

        // var nx = normals[i];
        // var ny = normals[i + 1];
        // var nz = normals[i + 2];
        
        // var normal = new THREE.Vector3(nx, ny, nz); // Créer un vecteur normal à partir des coordonnées
        // this.grass.lookAt(normal); // Faire tourner le plan en direction du vecteur normal
    
        this.grassGroup.add(this.grass);
    }
    this.grassGroup.position.set(0, 0.5, 2.5);
    console.log(this.grassGroup);
    this.scene.add(this.grassGroup);

    // var mesh = this.ground.children[2]; // Votre mesh
    // // Put ShaderMaterial on ground mesh
    // mesh.material = this.material;
    // mesh.material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     uTime: { value: 0 },
    //   }, 
    //   vertexShader: grassVertexShader,
    //   fragmentShader: grassFragmentShader,
    //   side: THREE.DoubleSide,
    // })
    // console.log(mesh);
  }

  update() {
    this.grassGroup.children.forEach(element => {
      element.update(this.time.elapsed);
    });
  }

  setGeometry() {
    // this.geometry = new CircleGeometry(5, 64);
    // this.grassParameters.size = this.geometry.parameters.radius * 2
    // Import ground model gltf with draco
    console.log(this.resources.items);

  }

  setGround() {
    this.ground = this.resources.items.groundModel.scene;
    // this.ground.scale.set(0.5, 0.5, 0.5);
    this.ground.position.set(0, 0, 0);
    this.setGrass();
    // this.ground.children[2].material = this.material;
    this.scene.add(this.ground);
    console.log(this.ground);
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
    

  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.receiveShadow = true;
    this.mesh.name = "floor";
    this.scene.add(this.mesh);
  }
}
