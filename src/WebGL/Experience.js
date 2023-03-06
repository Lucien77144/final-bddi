import Debug from "utils/Debug.js";
import Sizes from "utils/Sizes.js";
import Time from "utils/Time.js";
import Camera from "./Camera.js";
import Renderer from "./Renderer.js";
import Resources from "utils/Resources.js";
import SceneManager from "utils/SceneManager.js";
import { Mesh, Scene } from "three";
import sources from "./sources.js";
import config from "./Scenes/config.js";
import Transition from "./Components/Transition/Transition.js";

let instance = null;

export default class Experience {
  constructor(_canvas) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    // Global access
    window.experience = this;

    // Options
    this.canvas = _canvas;

    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.debug = new Debug();
    this.resources = this.loadSources(1);
    this.camera = new Camera();
    this.renderer = new Renderer();
    this.activeScene = new SceneManager();

    // Resize event
    this.sizes.on("resize", () => {
      this.resize();
    });

    // Time tick event
    this.time.on("tick", () => {
      this.update();
    });
  }

  switchScene(nextName) {
    this.debug = new Debug();
    this.resources = this.loadSources(Object.keys(config).indexOf(nextName) + 1);
    this.oldScene = this.scene;
    this.scene = new SceneManager(nextName).scene;
    this.transition = new Transition(this.oldScene, this.scene);
    this.renderer = new Renderer();

    this.update();
  }

  loadSources(index) {
    const filteredSources = sources[index].concat(sources[0]).filter((e, i, self) => i === self.findIndex((t) => t.name === e.name));
    return new Resources(filteredSources);
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.instance && this.camera.update();
    this.activeScene.update();
    this.renderer.update();
    this.debug.update();
  }

  destroy() {
    this.sizes.off("resize");
    this.time.off("tick");

    // Traverse the whole scene
    this.scene.traverse((child) => {
      // Test if it's a mesh
      if (child instanceof Mesh) {
        child.geometry.dispose();

        // Loop through the material properties
        for (const key in child.material) {
          const value = child.material[key];

          // Test if there is a dispose function
          if (value && typeof value.dispose === "function") {
            value.dispose();
          }
        }
      }
    });

    this.camera.controls.dispose();
    this.renderer.instance.dispose();

    if (this.debug.active) this.debug.ui.destroy();
  }
}
