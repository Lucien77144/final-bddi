import Experience from "webgl/Experience.js";
import { Color, DoubleSide, Mesh, MeshBasicMaterial, NearestFilter, PlaneGeometry, RepeatWrapping, ShaderMaterial, Vector3 } from "three";
import dispVertex from "./shaders/Displacement/vertexShader.glsl";
import dispFragment from "./shaders/Displacement/fragmentShader.glsl";
import grassVertex from "./shaders/Grass/vertexShader.glsl";
import grassFragment from "./shaders/Grass/fragmentShader.glsl";
import GrassGeometry from "./Grass";

export default class GrassFloor {
  constructor({
    _position = new Vector3(0, 0, 0),
    _size = new Vector3(10, 1, 20),
    _count = 125000,
    _maps = {
      displacementMap: "displacementMap",
      mask: "mask",
      baseTexture: "dirtTexture",
      secondTexture: "mudTexture",
    },
    _colors = {
      base: new Color('#11382a'),
      set: [ // 4 colors to set, only the first not commented set is used
        {
          uColor1: { value: new Color('#15945d') },
          uColor2: { value: new Color('#0a9044') },
          uColor3: { value: new Color('#14857c') },
          uColor4: { value: new Color('#0ca87e') },
        },
      ]
    },
  } = {}) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    this.position = _position;
    this.name = `grassFloor-${this.experience.scene.children.filter((child) => child.name.includes("grassFloor")).length}`;

    this.grassParameters = {
      count: _count,
      size: _size,
      baseTexture: this.resources.items[_maps.baseTexture],
      secondTexture: this.resources.items[_maps.secondTexture],
      displacementMap: this.resources.items[_maps.displacementMap],
      mask: this.resources.items[_maps.mask],
      colors : _colors,
    };

    console.log(this.grassParameters);

    this.setGround();
    this.setGrass();
  }

  setGroundGeometry() {
    this.groundGeometry = new PlaneGeometry(this.grassParameters.size.x, this.grassParameters.size.z, 100, 100);
  }

  setGroundMaterial() {
    this.grassParameters.baseTexture.generateMipmaps = false;
    this.grassParameters.baseTexture.minFilter = NearestFilter;
    this.grassParameters.baseTexture.magFilter = NearestFilter;

    this.grassParameters.secondTexture.generateMipmaps = false;
    this.grassParameters.secondTexture.minFilter = NearestFilter;
    this.grassParameters.secondTexture.magFilter = NearestFilter;

    this.groundMaterial = new ShaderMaterial({
      uniforms: {
        uBaseTexture: { value: this.grassParameters.baseTexture },
        uSecondTexture: { value: this.grassParameters.secondTexture },
        uDisplacement: { value: this.grassParameters.displacementMap },
        uMask: { value: this.grassParameters.mask },
        uSize: { value: this.grassParameters.size },
        uBaseColor: { value: this.grassParameters.colors.base },
      },
      side: DoubleSide,
      transparent: true,
      vertexShader: dispVertex,
      fragmentShader: dispFragment,
    });

    this.grassMaterial = new MeshBasicMaterial({
      map: this.grassParameters.displacementMap,
      side: DoubleSide,
      transparent: true,
    });
  }

  setGround() {
    this.setGroundGeometry();
    this.setGroundMaterial();

    this.ground = new Mesh(this.groundGeometry, this.groundMaterial);
    this.ground.position.copy(this.position);
    this.ground.rotation.x = -Math.PI / 2;
    this.ground.name = this.name;

    this.scene.add(this.ground);
  }

  setGrass() {
    this.setGrassGeometry();
    this.setGrassMaterial();

    this.grass = new Mesh(this.grassGeometry, this.grassMaterial);
    this.grass.position.copy(this.ground.position);
    this.grass.name = this.name + "-blades";
    this.grass.ignoreEnvironment = true;

    this.scene.add(this.grass);
  }

  setGrassGeometry() {
    this.grassGeometry = new GrassGeometry(this.grassParameters);
  }

  setGrassMaterial() {
    this.grassMaterial = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: this.grassParameters.displacementMap },
        uMask: { value: this.grassParameters.mask },
        uSize: { value: this.grassParameters.size },
        uMaxBladeSize: { value: this.grassGeometry.maxHeight },
        uBaseColor: { value: this.grassParameters.colors.base },
        ...this.grassParameters.colors.set[0],
      },
      side: DoubleSide,
      transparent: true,
      alphaTest: 0,
      vertexShader: grassVertex,
      fragmentShader: grassFragment,
    });
  }

  update() {
    if(this.grassMaterial?.uniforms?.uTime) this.grassMaterial.uniforms.uTime.value = this.time.elapsed;
  }
}