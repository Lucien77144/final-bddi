import Experience from "webgl/Experience.js";
import {
  Mesh,
  Vector3,
  LoopRepeat,
  AnimationMixer,
  Quaternion,
  MathUtils,
  Color,
  RepeatWrapping,
} from "three";
import EventEmitter from "utils/EventEmitter.js";
import cloneGltf from "@/WebGL/Utils/GltfClone";
import MouseMove from "utils/MouseMove.js";
import PathUrma from "../Urma/PathUrma";
import AudioManager from "@/WebGL/Utils/AudioManager";
import FairyDust from "./FairyDust";

let instance = null;
export default class Fairy extends EventEmitter {
  constructor(_position) {
    super();
    if (instance) {
      return instance;
    }
    instance = this;

    const { scene, resources, debug, time, activeScene } = new Experience();
    this.scene = scene;
    this.resources = resources;
    this.debug = debug;
    this.time = time;
    this.position = _position || new PathUrma().getPositionAt();
    this.fairyModel = this.resources.items.fairyModel;
    this.floors = activeScene.floors;
    this.environmentMap = activeScene.environment.environmentMap;
    this.fairyDust = new FairyDust();

    this.sound = new AudioManager({
      _path: "runWingsAudio",
      _status: false,
      _loop: true,
      _volume: 3,
    });

    this.mouseMove = new MouseMove();

    this.getYLimit();
    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = cloneGltf(this.fairyModel).scene;
    this.model.scale.set(.2, .2, .2);
    this.model.position.copy(this.position);
    this.model.name = "fairy";
    this.scene.add(this.model);

    for (const child of this.model.children) {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    }
    this.rebuildMaterials();
  }

  rebuildMaterials() {
    this.model.traverse((child) => {
      if (child.name.toLowerCase().includes("wing")) {
        const newEmisiveMap = this.resources.items.fairyTexture;

        newEmisiveMap.wrapS = newEmisiveMap.wrapT = RepeatWrapping;
        newEmisiveMap.repeat.set(1, 1);

        child.material.map = newEmisiveMap;
        child.material.emissiveMap = null;

        child.material.transparent = true;
        child.material.opacity = 0.35;
      } else if (child.name.toLowerCase().includes("sphere")) {
        child.material.color = new Color("#ff9d00");
        child.material.emissive = new Color("#ffee8e");
        
        child.material.envMap = this.environmentMap.texture;
        child.material.needsUpdate = true;
        child.material.envMapIntensity = this.environmentMap.intensity;
      }
    })
  }

  moveFairy() {
    if (!this.model) return;

    const fairyDir = new Vector3()
      .copy(this.mouseMove.cursor)
      .sub(this.model.position)
      .normalize();

    this.distFairyToMouse = this.model.position.distanceTo(
      this.mouseMove.cursor
    );

    this.model.lookAt(this.mouseMove.cursor);

    this.model.rotateY(-Math.atan2(fairyDir.z, fairyDir.x));
    this.model.rotateZ(Math.asin(fairyDir.y));

    const lerpFactor = 0.5;
    this.model.quaternion.slerp(
      new Quaternion().setFromEuler(this.model.rotation),
      lerpFactor
    );

    const newPos = new Vector3()
      .copy(this.model.position)
      .add(fairyDir.multiplyScalar(0.2));

    const canGoDown = newPos.y > this.minY;

    const resPos = {
      ...new Vector3().copy(this.model.position),
      x: newPos.x,
      y: canGoDown || this.model.position.y < newPos.y ? newPos.y : this.minY,
      z: newPos.z,
    };

    const logDist = Math.log(this.distFairyToMouse + 1);
    let speed = (MathUtils.clamp(logDist, 0, 4) / 4) * 0.8;

    this.model.position.lerp(resPos, speed);

    this.trigger("moveFairy", [
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    ]);

    // Check if the fairy is moving
    if (this.isFairyMoving()) {
      if (!this.sound.isPlaying) {
        this.sound.play(); // If the fairy is moving, play the sound
      }
    } else {
      if (this.sound.isPlaying) {
        this.sound.stop(); // If the fairy is not moving, stop the sound
      }
    }
  }

  isFairyMoving() {
    if (!this.model) return false;

    return (
      Math.round(this.model.position.z * 10) !==
      Math.round(this.mouseMove.cursor.z * 10)
    );
  }

  setAnimation() {
    const clip = this.fairyModel.animations[0];

    this.animation = {
      mixer: new AnimationMixer(this.model),
      action: null,
    };

    this.animation.action = this.animation.mixer.clipAction(clip);
    this.animation.action.timeScale = 1;
    this.animation.action.setLoop(LoopRepeat, Infinity);
    this.animation.action.play();
  }

  getYLimit() {
    const filteredFloors = this.floors.filter((floor) => {
      const pos = new Vector3(0, 0, floor.position.z - floor.size.z / 2);
      return (
        pos.z < this.model?.position.z &&
        this.model?.position.z < pos.z + floor.size.z
      );
    });

    this.minY =
      Math.max(
        ...filteredFloors.map((floor) => floor.position.y + floor.size.y)
      ) * 1.5;
  }

  update() {
    this.moveFairy();
    this.getYLimit();
    this.fairyDust?.update(Math.floor(this.model.position.y * 1000) != Math.floor(this.minY * 1000));
    if (this.distFairyToMouse) {
      this.animation.mixer.update(
        this.time.delta * (0.0005 + this.distFairyToMouse * 0.0005)
      );
    }
  }
}
