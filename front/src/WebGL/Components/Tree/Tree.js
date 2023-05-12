import Experience from "webgl/Experience.js";
import {
  Mesh,
  Vector3,
  LoopRepeat,
  AnimationMixer,
  ShaderMaterial,
  Color,
} from "three";
import cloneGltf from "@/WebGL/Utils/GltfClone";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";

let instance = null;
export default class Tree {
  constructor(position = new Vector3(0, 0, 0)) {
    if (instance) {
      return instance;
    }
    instance = this;

    const { scene, resources, debug, time } = new Experience();
    this.scene = scene;
    this.resources = resources;
    this.debug = debug;
    this.time = time;
    this.position = position;

    console.log(this.resources);
    this.resource = this.resources.items.treeModel;
    this.setModel();
    // this.setAnimation();
  }

  setModel() {
    console.log(this.resource);
    this.model = cloneGltf(this.resource).scene;

    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.copy(this.position);
    this.model.name = "tree";

    this.scene.add(this.model);

    const material = new ShaderMaterial({
      wireframe: true,
      uniforms: {
        colorMap: {
          value: [
            new Color("#427062"),
            new Color("#33594e"),
            new Color("#234549"),
            new Color("#1e363f"),
          ],
        },
        brightnessThresholds: { value: [0.9, 0.45, 0.001] },
        lightPosition: {
          value: new Vector3(15, 15, 15),
        },
      },
      fragmentShader: fragmentShader,
      vertexShader: vertexShader,
    });

    for (const child of this.model.children) {
      if (child instanceof Mesh) {
        child.castShadow = true;
        child.material = material;
      }
    }
  }

  setAnimation() {
    const clip = this.resource.animations[0];

    this.animation = {
      mixer: new AnimationMixer(this.model),
      action: null,
    };

    this.animation.action = this.animation.mixer.clipAction(clip);
    this.animation.action.timeScale = 1;
    this.animation.action.setLoop(LoopRepeat, Infinity);
    this.animation.action.play();
  }

  update() {}
}
