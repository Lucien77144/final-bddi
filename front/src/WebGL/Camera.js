import Experience from "./Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera } from "three";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.options = {
      fov: 35,
      near: 1,
      far: 100,
      position: {
        x: 16,
        y: 4,
        z: 0,
      },
      rotate: {
        x: 0,
        y: Math.PI/2,
        z: 0,
      },
    };

    this.setInstance();
    // this.updatePosition();
    // this.setControls();
    if (this.debug.active) this.setDebug();
  }

  setInstance() {
    this.instance = new PerspectiveCamera(
      this.options.fov,
      this.sizes.width / this.sizes.height,
      this.options.near,
      this.options.far
    );
    this.instance.name = "camera";

    this.instance.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z
    );

    this.instance.rotation.set(
      this.options.rotate.x,
      this.options.rotate.y,
      this.options.rotate.z
    )

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
    // this.controls.enabled = false;
  }
  resetControls() {
    this.controls.reset();
    this.instance.position.set(
      this.options.position.x,
      this.options.position.y,
      this.options.position.z
    );
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: "Camera",
      expanded: false,
    });

    this.debugFolder
      .addButton({
        title: "Reset Camera",
      })
      .on("click", this.resetControls.bind(this));

    if(this.controls) {
      this.debugFolder
        .addInput(this.controls, "enabled", {
          label: "Orbit Controls",
        });
    }
  }

  updatePosition() {
    this.instance.position.z = this.urma.position.z;
  }

  update() {
    if (!this.urma && this.experience.activeScene) {
      this.urma = this.experience.activeScene.urma;
    }
    if(this.controls) this.controls.update();
  } 
}
