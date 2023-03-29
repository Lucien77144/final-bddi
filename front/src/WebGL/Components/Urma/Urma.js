import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";
import InputManager from "utils/InputManager.js";

let options = {
  speed: 90,
  speedEase: 1000,
}

const SIZE_FACTOR = 2;
let data = {
  time: {
    start: 0,
    end: 0,
  },
  status: {
    left: {
      move: false,
      end: false,
    },
    right: {
      move: false,
      end: false,
    },
  },
  move: {
    delta: 0,
    velocity: 0,
    flag: true,
  }
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
    this.camera.position.z = this.mesh.position.z
  }

  setInputs() {
    InputManager.on("right", (value) => {
      console.log(this.time.current, data.time.end);
      if (value && !data.status.right.move) {
        data.status.right.move = true;
        data.time.start = this.time.current;
      } else if (!value && data.status.right.move && data.move.flag) {
        data.move.flag = false;
        data.status.right.end = true;
        data.time.end = this.time.current;
      }
    });
    InputManager.on("left", (value) => {
      if (value && !data.status.left.move) {
        data.status.left.move = true;
        data.time.start = this.time.current;
      } else if (!value && data.status.left.move && data.move.flag) {
        data.move.flag = false;
        data.status.left.end = true;
        data.time.end = this.time.current;
      }
    });
  }

  update() {
    if (data.move.velocity == 0) {
      data.status.left.move && (data.status.left.move = false);
      data.status.right.move && (data.status.right.move = false);

      data.status.right.end && (data.status.right.end = false);
      data.status.left.end && (data.status.left.end = false);
      data.move.flag = true;
    }

    let endVelocity = (this.time.current - data.time.end) / options.speedEase * 2;
    endVelocity = endVelocity > 1 ? 1 : endVelocity;

    data.move.velocity = (this.time.current - data.time.start) / options.speedEase;
    data.move.velocity = data.move.velocity > 1 ? 1 : data.move.velocity;
    data.move.velocity -= (data.status.left.end || data.status.right.end) ? data.move.velocity * endVelocity : 0;

    this.updatePosition();
  }

  updatePosition() {
    const meshPos = this.mesh.position;
    const cameraPos = this.camera.position;
    const cameraRot = this.camera.rotation;

    const isOneWay = (data.status.left.move && !data.status.right.move) || (!data.status.left.move && data.status.right.move);

    data.move.delta = isOneWay ? data.move.velocity * (options.speed / 1000) * (data.status.left.move ? 1 : -1): data.move.delta*.95;
    meshPos.z += data.move.delta;
    cameraPos.z = meshPos.z - data.move.delta*5;

    const rdmCamera = (Math.cos(this.time.current/200) * data.move.velocity / 15) * data.move.delta*4;
    cameraPos.y = 4 - Math.abs(data.move.delta)*2 + rdmCamera;
    
    cameraRot.z = data.move.delta/10;
  }
}