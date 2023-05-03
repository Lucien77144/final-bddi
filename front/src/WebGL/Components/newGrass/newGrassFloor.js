import Experience from "webgl/Experience.js";
import Grass from "./Grass.js";
import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, Vector3 } from "three";
import vertexShader from "./shaders/Displacement/vertexShader.glsl";
import fragmentShader from "./shaders/Displacement/fragmentShader.glsl";

export default class newGrassFloor {
  constructor(
    _position = new Vector3(0, 0, 0),
    _displacement = "displacementMap"
  ) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.position = _position;
    this.name = `grassFloor-${this.experience.scene.children.filter((child) => child.name.includes("rock")).length}`;

    this.grassParameters = {
      count: 75000,
      size: { 
        x: 20, 
        z: 20
      },
      displacementMap: this.resources.items[_displacement],

    };
    this.grassGroups = [];

    // if (this.debug.active) {
    //   this.debugFolder = this.debug.ui.addFolder({ title: "grass", expanded: false });
    // }

    this.setGeometry();
    this.setMaterials();
    this.setGround();

    this.setGrass();
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.grassParameters.size.x, this.grassParameters.size.z, 100, 100);
  }

  setMaterials() {
    this.material = new ShaderMaterial({
      uniforms: {
        uDisplacement: { value: this.grassParameters.displacementMap },
        uBaseColor: { value: new Color('#11382a') },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader,
      fragmentShader,
    });
  }

  setGround() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.name = this.name;
    this.scene.add(this.mesh);
  }

  setGrass() {
    // let grassColors = {
    //   color1: '#0a9044',
    //   color2: '#0ca855',
    //   color3: '#148538',
    //   color4: '#15293b',
    //   color5: '#348bd9',
    //   baseColor: '#11382a',
    // }

    this.grass = new Grass(this.grassParameters);
    this.grass.position.copy(this.mesh.position);

    this.scene.add(this.grass);
  }

  update() {
    this.grassGroups.forEach((group) => {
      group.children.forEach((e) => {
        e.update(this.time.elapsed);
      });
    })
  }
}