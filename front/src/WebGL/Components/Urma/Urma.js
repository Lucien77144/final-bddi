import Experience from "webgl/Experience.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
import { BoxGeometry, Mesh, ShaderMaterial, Vector3 } from "three";
import InputManager from "utils/InputManager.js";

export default class Urma {
  constructor(_position = new Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.time = this.experience.time;

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
    const getDeltaTime = (value) => {

    }
    let isMoving = false;
    let startTime;
    let velocity = 0;
    InputManager.on("right", (value) => {
      if (value && !isMoving) {
        isMoving = true;
      } else if (!value && isMoving) {
        startTime = null;
        isMoving = false;
      } else if(isMoving && value){
        startTime = startTime ? this.time.current - startTime : this.time.current;
        console.log(startTime);
      };
    });
    InputManager.on("left", (value) => {
      if (value && !isMoving) {
        isMoving = true;
      } else if (!value && isMoving) {
        isMoving = false;
      }
    });
  }

  update() {
    this.updatePosition();
  }

  updatePosition() {
    
  }
}
