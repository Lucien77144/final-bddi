import Experience from "webgl/Experience.js";
import {
  Mesh,
  Vector3,
  LoopRepeat,
  AnimationMixer,
  Quaternion,
  MathUtils,
} from "three";
import EventEmitter from "utils/EventEmitter.js";
import cloneGltf from "@/WebGL/Utils/GltfClone";
import MouseMove from "utils/MouseMove.js";

let instance = null;
export default class Fairy extends EventEmitter {
  constructor(position = new Vector3(0, 0, 0)) {
    super();
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

    this.resource = this.resources.items.fairyModel;

    this.mouseMove = new MouseMove();

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    console.log(this.resource);
    this.model = cloneGltf(this.resource).scene;

    this.model.scale.set(0.2, 0.2, 0.2);
    this.model.position.copy(this.position);
    this.model.name = "fairy";

    this.scene.add(this.model);

    for (const child of this.model.children) {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    }
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

    const resPos = new Vector3().copy(this.model.position);

    const newPos = new Vector3()
      .copy(this.model.position)
      .add(fairyDir.multiplyScalar(0.25));

    const moveY = this.canGoDown || this.model.position.y < newPos.y;
    const right = this.canGoRight || this.model.position.z < newPos.z;
    const left = this.canGoLeft || newPos.z < this.model.position.z;

    if (moveY) {
      resPos.y = newPos.y;
    } else {
      resPos.y += 0.01;
    }
    if ((this.canGoLeft || left) && (this.canGoRight || right)) {
      resPos.z = newPos.z;
    }

    resPos.x = newPos.x;

    const logDist = Math.log(this.distFairyToMouse + 1);
    const speed = (MathUtils.clamp(logDist, 0, 4) / 4) * 0.8;
    this.model.position.lerp(resPos, speed);

    this.trigger("moveFairy", [
      this.model.position.x,
      this.model.position.y,
      this.model.position.z,
    ]);
  }

  isFairyMoving() {
    if (!this.model) return false;

    return (
      Math.round(this.model.position.z * 10) !==
      Math.round(this.mouseMove.cursor.z * 10)
    );
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

  update() {
    this.animation.mixer.update(
      this.time.delta * (0.001 + this.distFairyToMouse * 0.001)
    );
  }
}
