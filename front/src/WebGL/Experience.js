import Debug from "utils/Debug.js";
import Sizes from "utils/Sizes.js";
import Time from "utils/Time.js";
import Camera from "webgl/Camera.js";
import Renderer from "webgl/Renderer.js";
import Resources from "utils/Resources.js";
import SceneManager from "utils/SceneManager.js";
import { Mesh, Scene } from "three";
import sources from "webgl/sources.js";
import OutlineModule from "./Utils/OutlineModule";

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

    // Set Ressources
    this.debug = new Debug();
    this.resources = new Resources(sources);
  }

  setUp() {
    // Setup
    this.sizes = new Sizes();
    this.time = new Time();
    this.scene = new Scene();
    this.camera = new Camera();
    this.renderer = new Renderer(this.scene, this.camera);
    this.activeScene = new SceneManager();
    this.outlineModule = new OutlineModule();
    this.outlineModule.init();

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
    this.scene = new Scene();
    this.debug = new Debug();
    this.camera = new Camera();
    this.activeScene = new SceneManager(nextName);
    this.renderer.scene = this.scene;
    this.renderer.camera = this.camera;
    this.update();
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
  }

  update() {
    this.camera.instance && this.camera.update();
    this.renderer.update();
    this.outlineModule.update();
    this.activeScene.update();
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