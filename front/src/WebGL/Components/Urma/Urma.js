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

const speedDelay = 250;

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
  }

  setGeometry() {
    this.geometry = new BoxGeometry(1, 1, 1);
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
        endTime = 0;
        endVelocity = 0;
        velocity = 0;
        isEnding.right = false;
        isEnding.left = false;
      } else if (!value && isMoving.right) {
        isEnding.right = true;
        endTime = this.time.current;
        setTimeout(() => {
          isEnding.right = false;
          isMoving.right = false;
        }, speedDelay);
      }
    });
    InputManager.on("left", (value) => {
      if (value && !isMoving.left) {
        isMoving.left = true;
        startTime = this.time.current;
        endTime = 0;
        endVelocity = 0;
        velocity = 0;
        isEnding.right = false;
        isEnding.left = false;
      } else if (!value && isMoving.left) {
        isEnding.left = true;
        endTime = this.time.current;
        setTimeout(() => {
          isEnding.left = false;
          isMoving.left = false;
        }, speedDelay);
      }
    });
  }

  update() {
    this.updatePosition();
    if(isMoving.left || isMoving.right) {
      velocity = (this.time.current - startTime) / speedDelay;
      velocity = velocity > 1 ? 1 : velocity;

      endVelocity = (this.time.current - endTime) / speedDelay *2;
      endVelocity = endVelocity > 1 ? 1 : endVelocity;

      velocity -= (isEnding.left || isEnding.right) ? endVelocity : 0;
      this.updatePosition();
    } else {
      startTime = 0;
      endTime = 0;
      endVelocity = 0;
    }
  }

  updatePosition() {
    this.mesh.position.z = isMoving.left ? this.mesh.position.z + (velocity / 10) : this.mesh.position.z;
    this.mesh.position.z = isMoving.right ? this.mesh.position.z - (velocity / 10) : this.mesh.position.z;

    const rdm = isMoving.left || isMoving.right ? Math.cos(this.time.current/200) / 8 : 0;

    this.camera.position.z = this.mesh.position.z + (velocity / 2);
    this.camera.position.y = 4 - (velocity / 4) + (rdm * velocity);

    this.camera.rotation.z = isMoving.left ? velocity/75 : -velocity/75;
  }
}
