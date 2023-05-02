import Experience from "webgl/Experience.js";
import {
  Mesh,
  Vector3,
  LoopRepeat,
  AnimationMixer,
  Quaternion,
  MathUtils,
} from "three";
import cloneGltf from "@/WebGL/Utils/GltfClone";
import MouseMove from "utils/MouseMove.js";

let instance = null;
export default class Fairy {
  constructor(position = new Vector3(0, 0, 0)) {
    // Singleton
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

    // Resource
    this.resource = this.resources.items.fairyModel;

    this.mouseMove = new MouseMove();

    this.setModel();
    this.setAnimation();
  }

  setModel() {
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

    let newpos = new Vector3()
      .copy(this.model.position)
      .add(fairyDir.multiplyScalar(0.25));

    // Calcule la vitesse de l'animation en fonction de la distance entre la fée et le curseur
    const logDist = Math.log(this.distFairyToMouse + 1);
    // La vitesse est de 0.8 (valeur maximale) lorsque la distance est de 0, et diminue à mesure que la distance augmente
    const speed = (MathUtils.clamp(logDist, 0, 4) / 4) * 0.8;

    this.model.position.lerp(newpos, speed);
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
    this.moveFairy();
    // Multiplie le temps delta par la vitesse pour accélérer l'animation lorsque la fée est plus loin du curseur
    this.animation.mixer.update(
      this.time.delta * (0.001 + this.distFairyToMouse * 0.001)
    );
  }
}
