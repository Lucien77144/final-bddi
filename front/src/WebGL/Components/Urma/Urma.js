import Experience from "webgl/Experience.js";
import { AnimationMixer, Box3, Group, LoopRepeat, Vector3 } from "three";
import InputManager from "utils/InputManager.js";
import PathUrma from "./PathUrma";
import cloneGltf from "@/WebGL/Utils/GltfClone";
import Fairy from "../Fairy/Fairy";
import AudioManager from "@/WebGL/Utils/AudioManager";
import { gsap } from "gsap";

const OPTIONS = {
  SPEED: 90,
  SPEEDEASE: 1000,
};

let data = {
  time: {
    start: 0,
    end: 0,
  },
  status: {
    left: {
      start: false,
      end: false,
    },
    right: {
      start: false,
      end: false,
    },
  },
  move: {
    delta: 0,
    velocity: 0,
    flag: true,
  },
  lastDirection: "right",
};

let instance = null;
export default class Urma {
  constructor(_position = new Vector3(0, 0, 0)) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;
    this.path = new PathUrma();
    this.grassScene = this.experience.activeScene;
    this.fairy = new Fairy();
    this.resources = this.experience.resources;
    this.resource = this.resources.items.urmaModel;
    this.ponchoResource = this.resources.items.ponchoModel;

    this.triggerRockDialog = false;
    this.gameIsCompleted = false;

    this.position = _position;

    this.place = document.querySelector(".place");
    this.place.innerHTML = "Les ruines sacrées"

    this.sound = new AudioManager({
      _path: "runUrmaAudio",
      _status: false,
      _loop: true,
    });

    this.keyState = {
      right: false,
      left: false,
    };

    this.setModel();
    this.setAnimation();
    this.setInputs();
  }

  setModel() {
    this.model = new Group();
    this.model.position.copy(this.position);
    this.model.scale.set(1.5, 1.5, 1.5);

    this.urma = cloneGltf(this.resource).scene;
    this.urma.name = "urma";
    this.urma.castShadow = true;
    this.model.add(this.urma);

    // PONCHO
    this.poncho = cloneGltf(this.ponchoResource).scene;
    this.poncho.name = "poncho";
    this.poncho.castShadow = true;
    this.model.add(this.poncho);

    this.scene.add(this.model); // Add model (with poncho) to the scene

    this.camera.position.z = this.model.position.z;

    const traverseModel = (object) => {
      object.traverse((child) => {
        if (child.isMesh) {
          // Calculate the height
          const boundingBox = new Box3();
          boundingBox.setFromObject(child);
          this.height = boundingBox.max.y - boundingBox.min.y;
        }
      });
    };
    traverseModel(this.model);
  }


  setAnimation() {
    const idleClip = this.resource.animations.find(
      (animation) => animation.name === "Idle"
    );
    const runClip = this.resource.animations.find(
      (animation) => animation.name === "run"
    );

    // Poncho
    const ponchoIdleClip = this.ponchoResource.animations.find(
      (animation) => animation.name === "Idle.poncho"
    );

    const ponchoRunClip = this.ponchoResource.animations.find(
      (animation) => animation.name === "run"
    );

    this.animation = {
      mixer: new AnimationMixer(this.model),
      ponchoMixer: new AnimationMixer(this.poncho), // Poncho mixer
      actions: {
        idle: null,
        run: null,
      },
      ponchoActions: { // Poncho actions
        idle: null,
        run: null,
      },
    };

    this.animation.actions.idle = this.animation.mixer.clipAction(idleClip);
    this.animation.actions.run = this.animation.mixer.clipAction(runClip);
    this.animation.actions.current = this.animation.actions.idle;

    this.animation.ponchoActions.idle = this.animation.ponchoMixer.clipAction(ponchoIdleClip); // Poncho animation
    this.animation.ponchoActions.run = this.animation.ponchoMixer.clipAction(ponchoRunClip); // Poncho animation
    this.animation.ponchoActions.current = this.animation.ponchoActions.idle; // Set poncho current action

    this.animation.actions.current.play();
    this.animation.ponchoActions.current.play(); // Play poncho animation

    this.animation.play = (name) => {
      const nextAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      nextAction.reset();
      nextAction.play();
      nextAction.crossFadeFrom(oldAction, 0.5);

      this.animation.actions.current = nextAction;
    };

    this.animation.ponchoPlay = (name) => { // Poncho play
      const nextAction = this.animation.ponchoActions[name];
      const oldAction = this.animation.ponchoActions.current;

      nextAction.reset();
      nextAction.play();
      nextAction.crossFadeFrom(oldAction, 0.5);

      this.animation.ponchoActions.current = nextAction;
    };
  }


  setInputs() {
    ["right", "left"].forEach((dir) => {
      InputManager.on(dir, (val) => {
        if (val) {
          this.animation?.action && (this.animation.action.paused = false);

          if (!this.sound?.isPlaying) {
            this.sound.play();
          }
        } else {
          this.animation?.action && (this.animation.action.paused = true);

          if (this.sound?.isPlaying) {
            this.sound.stop();
          }
        }

        if (val && !data.status[dir].start) {
          this.animation.play("run");
          this.animation.ponchoPlay("run"); // Poncho play
          data.status[dir].start = true;
          data.time.start = this.time.current;
          data.lastDirection = dir; // Ajoutez cette ligne
          this.orientateBody(); // Appel à la méthode orientateBody() lorsque la direction du mouvement change
        } else if (!val && data.status[dir].start && data.move.flag) {
          this.animation.play("idle");
          this.animation.ponchoPlay("idle"); // Poncho play
          data.move.flag = false;
          data.status[dir].end = true;
          data.time.end = this.time.current;
          this.orientateBody(); // Appel à la méthode orientateBody() lorsque la direction du mouvement change
        }
      });
    });
  }

  updatePosition() {
    const { model, camera, time } = this;
    const { position: modelPos } = model;
    const { position: cameraPos, rotation: cameraRot } = camera;

    const isOneWay = data.status.left.start !== data.status.right.start;

    if (!this.grassScene.onGame) {
      data.move.delta = isOneWay
        ? data.move.velocity *
          (OPTIONS.SPEED / 1000) *
          (data.status.left.start ? 1 : -1)
        : data.move.delta * 0.95;

      modelPos.copy(this.path.position);

      let tl = gsap.timeline();
      let currentState = this.place.innerHTML;

      if (Math.floor(modelPos.z) >= -11.5 && currentState !== "Les ruines sacrées") {
        tl.to(this.place, { autoAlpha: 0, duration: 0.5 })
          .add(() => { 
            this.place.innerHTML = "Les ruines sacrées"; 
            currentState = this.place.innerHTML;
          })
          .to(this.place, { autoAlpha: 1, duration: 0.5 });
      } else if (Math.floor(modelPos.z) < -11.5 && currentState !== "La forêt ensorboisée") {
        tl.to(this.place, { autoAlpha: 0, duration: 0.5 })
          .add(() => { 
            this.place.innerHTML = "La forêt ensorboisée"; 
            currentState = this.place.innerHTML;
          })
          .to(this.place, { autoAlpha: 1, duration: 0.5 });
      }

      if (Math.floor(modelPos.z) <= -28) {
        if (!this.triggerRockDialog && !this.gameIsCompleted) {
          this.rockDialog = "Un rocher semble bloquer le chemin, il n’est pas accessible pour le moment";
          this.triggerRockEvent(this.rockDialog);
          this.triggerRockDialog = true;
        } else if (!this.triggerRockDialog && this.gameIsCompleted) {
          this.winDialog();
        }
      } else if (Math.floor(modelPos.z) >= 1.5 && Math.floor(modelPos.z) <= 5) {
        if (!this.triggerRockDialog) {
          this.triggerRockEvent("Tiens, il semble y avoir des inscriptions qu'on peut manipuler sur cette stèle.");
          this.triggerRockDialog = true;
        }
      } else {
      switch (Math.floor(modelPos.z)) {
        // Add more cases as needed...
        default:
          if (this.triggerRockDialog && this.dialogBox) {
            // Hide dialog box with GSAP
            gsap.to(this.dialogBox, { autoAlpha: 0, duration: 1, ease: 'power1.in', onComplete: () => {
              // Remove dialog box from DOM
              this.dialogBox.parentNode.removeChild(this.dialogBox);
              this.dialogBox = null; // Nullify reference
            }});
            this.triggerRockDialog = false;
          }
          break;
      }}


      cameraPos.z = modelPos.z - data.move.delta * 5;
      const rdmCamera =
        Math.abs(data.move.delta) * 2 +
        ((Math.cos(time.current / 200) * data.move.velocity) / 15) *
          data.move.delta *
          4;
      cameraPos.y = 3 - rdmCamera;
      cameraRot.z =
        cameraRot.z < data.move.delta / 10
          ? cameraRot.z / 2
          : data.move.delta / 10;

      this.updateCameraX(cameraPos, modelPos);

      this.animation.mixer.update(this.time.delta * 0.001);
      this.animation.ponchoMixer.update(this.time.delta * 0.001);
    }
  }

  triggerRockEvent(message) {
    this.dialogBox = document.createElement("div");
    this.dialogBox.id = "dialog-box";

    let dialogContent = document.createElement("p");
    dialogContent.textContent = message;

    this.dialogBox.appendChild(dialogContent);
    document.body.appendChild(this.dialogBox);

    gsap.set(this.dialogBox, { autoAlpha: 0 });
    gsap.to(this.dialogBox, { autoAlpha: 1, duration: 1, ease: 'power1.out' });
  }

  winDialog() {
    if (this.triggerRockDialog && this.dialogBox) {
      // Hide dialog box with GSAP
      gsap.to(this.dialogBox, { autoAlpha: 0, duration: 1, ease: 'power1.in', onComplete: () => {
        // Remove dialog box from DOM
        this.dialogBox.parentNode.removeChild(this.dialogBox);
        this.dialogBox = null; // Nullify reference
        this.rockDialog = "Le rocher a disparu, le chemin est libre";
        this.triggerRockEvent(this.rockDialog);
        this.triggerRockDialog = true;
        this.winDialogCompletedOnce = true;
      }});
      this.triggerRockDialog = false;
    } else if (!this.triggerRockDialog && this.winDialogCompletedOnce) {
      this.rockDialog = "Le rocher a disparu, le chemin est libre";
      this.triggerRockEvent(this.rockDialog);
      this.triggerRockDialog = true;
    }
  }

  updateCameraX(cameraPos, modelPos) {
    const activeDist = 0.15;
    const variation = 3;
    const baseDist = 7;

    let factor = 1 - Math.abs(this.path.factor - 0.5) * 2;
    factor = 1 - Math.min(factor, activeDist) / activeDist;

    let x = baseDist - factor * variation;

    const dist = Math.abs(modelPos.x - cameraPos.x);
    if (dist > 10) {
      x -= (dist - baseDist) * 0.75;
    }
  }

  orientateBody() {
    const lerpFactor = 0.1;
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    const nextFactor =
      this.path.factor + (data.lastDirection === "right" ? -0.01 : 0.01);
    const nextPos = this.path.getPositionAt(clamp(nextFactor, 0, 1));
    const targetRotationY =
      Math.atan2(
        nextPos.z - this.path.position.z,
        nextPos.x - this.path.position.x
      ) +
      Math.PI / 2;

    this.model.rotation.y +=
      (targetRotationY - this.model.rotation.y) * lerpFactor;
  }

  update() {
    if (data.move.velocity == 0) {
      data.move.flag = true;

      data.status.left.start && (data.status.left.start = false);
      data.status.right.start && (data.status.right.start = false);
      data.status.right.end && (data.status.right.end = false);
      data.status.left.end && (data.status.left.end = false);
    }

    let endVelocity = (this.time.current - data.time.end) / OPTIONS.SPEEDEASE * 2;
    endVelocity = endVelocity > 1 ? 1 : endVelocity;

    data.move.velocity = (this.time.current - data.time.start) / OPTIONS.SPEEDEASE;
    data.move.velocity = data.move.velocity > 1 ? 1 : data.move.velocity;
    data.move.velocity -= (data.status.left.end || data.status.right.end) ? data.move.velocity * endVelocity : 0;

    this.path.update(data.move.delta);
    this.updatePosition();
    this.orientateBody();
  }
}
