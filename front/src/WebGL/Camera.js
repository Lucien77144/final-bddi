import Experience from "webgl/Experience.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PerspectiveCamera } from "three";
import MouseMove from "./Utils/MouseMove";

export default class Camera {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.debug = this.experience.debug;

    this.options = {
      fov: 45,
      near: 1,
      far: 100,
      position: {
        x: 8,
        y: 4,
        z: 0,
      },
      rotate: {
        x: 0,
        y: Math.PI / 2,
        z: 0,
      },
    };

    this.setInstance();
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

    this.instance.position.x = -4.3;

    this.instance.rotation.set(
      this.options.rotate.x,
      this.options.rotate.y,
      this.options.rotate.z
    );

    this.scene.add(this.instance);
  }

  setControls() {
    this.controls = new OrbitControls(this.instance, this.canvas);
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
      expanded: true,
    });

    this.debugFolder
      .addButton({
        title: "Reset Camera",
      })
      .on("click", this.resetControls.bind(this));

    this.debugFolder.addInput(this.instance.position, "x", {
      label: "Position X",
      min: -20,
      max: 100,
      step: 0.01,
    });

    if (this.controls) {
      this.debugFolder.addInput(this.controls, "enabled", {
        label: "Orbit Controls",
      });
    }
  }

  update() {
    if (this.controls) this.controls.update();
    if (!this.mouseMove) {
      this.mouseMove = new MouseMove();
    }
  }
}
