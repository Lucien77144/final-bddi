import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";
import InputManager from "utils/InputManager.js";

let isMoving = {
  left: false,
  right: false,
};
let isEnding = {
  left: false,
  right: false,
};
let startTime = 0;
let endTime = 0;
let velocity = 0;
let endVelocity = 0;

let moveOptions = {
  speed: 90,
  speedEase: 1000,
}

const sizeFactor = 2;
let status = {

}

export default class Urma {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;
    this.camera = this.experience.camera.instance;

    this.position = _position;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.setInputs();
    this.updatePosition();
  }

  setGeometry() {
    this.geometry = new BoxGeometry(.75/sizeFactor, 1.40/sizeFactor, .75/sizeFactor);
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
    this.mesh.name = "cube";
    this.scene.add(this.mesh);
  }

  setInputs() {
    InputManager.on("right", (value) => {
      if (value && !isMoving.right) {
        isMoving.right = true;
        startTime = this.time.current;
      } else if (!value && isMoving.right) {
        isEnding.right = true;
        endTime = this.time.current >= startTime ? this.time.current : startTime;
      }
    });
    InputManager.on("left", (value) => {
      if (value && !isMoving.left) {
        isMoving.left = true;
        startTime = this.time.current;
      } else if (!value && isMoving.left) {
        isEnding.left = true;
        endTime = this.time.current ? this.time.current : startTime;
      }
    });
  }

  update() {
    if (isMoving.left || isMoving.right) {
      endVelocity = (this.time.current - endTime) / moveOptions.speedEase * 2;
      endVelocity = endVelocity > 1 ? 1 : endVelocity;

      velocity = (this.time.current - startTime) / moveOptions.speedEase;
      velocity = velocity > 1 ? 1 : velocity;
      velocity -= (isEnding.left || isEnding.right) ? velocity * endVelocity : 0;

      this.updatePosition();
    }
    if (velocity == 0) {
      isMoving.left && (isMoving.left = false);
      isMoving.right && (isMoving.right = false);

      isEnding.right && (isEnding.right = false);
      isEnding.left && (isEnding.left = false);
    }
  }

  updatePosition() {
    const meshPos = this.mesh.position;
    const cameraPos = this.camera.position;
    const cameraRot = this.camera.rotation;

    const isOneWay = (isMoving.left && !isMoving.right) || (!isMoving.left && isMoving.right);

    meshPos.z += isOneWay ? velocity * (moveOptions.speed / 1000) * (isMoving.left ? 1 : isMoving.right ? -1 : 0): 0;
    cameraPos.z = isOneWay ? meshPos.z + (isMoving.left ? velocity / 2 : -velocity / 2) : meshPos.z - ((cameraPos.z - meshPos.z) / 2);

    cameraPos.z = meshPos.z + (isMoving.left ? velocity / 2 : -velocity / 2);

    const rdmCamera = (Math.cos(this.time.current/200) * velocity / 15);
    cameraPos.y = 4 - velocity / 6 + rdmCamera;
    
    cameraRot.z = isMoving.left ? velocity/75 : -velocity/75;
  }
}