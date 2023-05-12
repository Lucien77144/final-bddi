import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { AnimationMixer, BoxGeometry, LoopRepeat, Mesh, ShaderMaterial, Vector3 } from "three";
import InputManager from "utils/InputManager.js";
import PathUrma from "./PathUrma";
import cloneGltf from "@/WebGL/Utils/GltfClone";

const SIZE_FACTOR = 1.25;
const OPTIONS = {
  SPEED: 90,
  SPEEDEASE: 1000,
}

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
  lastDirection: 'right',  
}

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
    this.resources = this.experience.resources;
    this.resource = this.resources.items.urmaModel;

    this.position = _position;

    // this.setGeometry();
    // this.setMaterial();
    // this.setMesh();
    this.setModel();
    this.setAnimation();
    this.setInputs();
  }

  setModel() {
    this.model = cloneGltf(this.resource).scene;
    this.model.name = "urma";
    this.model.position.copy(this.position);
    this.model.castShadow = true;
    this.scene.add(this.model);
    this.camera.position.z = this.model.position.z;
    console.log(this.model);

  }

  setAnimation() {
    const clip = this.resource.animations[0];
    console.log(this.resource);
    this.animation = {
      mixer: new AnimationMixer(this.model),
      action: null,
    };

    this.animation.action = this.animation.mixer.clipAction(clip);
    this.animation.action.timeScale = 1;
    this.animation.action.setLoop(LoopRepeat, Infinity);
    this.animation.action.play();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(.75/SIZE_FACTOR, 1.40/SIZE_FACTOR, .75/SIZE_FACTOR);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
      fragmentShader,
      vertexShader,
    });
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.name = "urma";
    this.scene.add(this.mesh);
    this.camera.position.z = this.mesh.position.z;
    for (const child of this.model.children) {
      if (child instanceof Mesh) {
        child.castShadow = true;
      }
    }
  }

  setInputs() {
    ["right", 'left'].forEach((dir) => {
      InputManager.on(dir, (val) => {
        if (val) {
          // start model animation
          this.animation.action.paused = false;
        } else {
          // pause model animation
          this.animation.action.paused = true;
        }
  
        if (val && !data.status[dir].start) {
          data.status[dir].start = true;
          data.time.start = this.time.current;
          data.lastDirection = dir;  // Ajoutez cette ligne
          this.orientateBody();  // Appel à la méthode orientateBody() lorsque la direction du mouvement change
        } else if (!val && data.status[dir].start && data.move.flag) {
          data.move.flag = false;
          data.status[dir].end = true;
          data.time.end = this.time.current;
          this.orientateBody();  // Appel à la méthode orientateBody() lorsque la direction du mouvement change
        }
      });
    })
  }
  

  updatePosition() {
    const { model, camera, time } = this;
    const { position: modelPos } = model;
    const { position: cameraPos, rotation: cameraRot } = camera;

    const isOneWay = (data.status.left.start !== data.status.right.start);
    
    if(!this.grassScene.onGame) {
    data.move.delta = isOneWay ? data.move.velocity * (OPTIONS.SPEED / 1000) * (data.status.left.start ? 1 : -1): data.move.delta*.95;

    // console.log(this.grassScene);
    modelPos.copy(this.path.position);

      cameraPos.z = modelPos.z - data.move.delta*5;
      const rdmCamera = Math.abs(data.move.delta)*2 + ((Math.cos(time.current/200) * data.move.velocity / 15) * data.move.delta*4);
      cameraPos.y = 4 - rdmCamera;
      cameraRot.z = cameraRot.z < data.move.delta/10 ? cameraRot.z/2 : data.move.delta/10;
      
      this.animation.mixer.update(this.time.delta * 0.001);
    }

  }

  orientateBody() {
    const targetRotationY = data.lastDirection === 'right' ? Math.PI : 0;  // Modifiez cette ligne
    const lerpFactor = 0.1;  
  
    this.model.rotation.y += (targetRotationY - this.model.rotation.y) * lerpFactor;
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
    
    this.path.update(data.move.delta, 1.40/SIZE_FACTOR);
    this.updatePosition();
    this.orientateBody();
    // update animation
  }
}