import * as THREE from "three";
import Experience from "../Experience";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import gsap from "gsap";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import vertexShader from "../Components/worldShaders/vertexShader.glsl";
import fragmentShader from "../Components/worldShaders/fragmentShader.glsl";

export default class OutlineModule {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera.instance;
    this.grassScene = this.experience.activeScene;
    this.resources = this.experience.resources;

    this.debug = this.experience.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "vignette",
        expanded: true,
      });
    }

    this.originalPosition = null;
    this.originalUp = null;
    this.onGame = false;

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.backupCamPosition = this.camera.position.clone();

    this.activeObject = null;
    this.base = null;

    this.mouseDown = false;

    window.addEventListener("mousedown", (event) => {
      this.mouseDown = true;
    });

    window.addEventListener("mouseup", (event) => {
      this.mouseDown = false;
      this.activeObject = null; // clear active object on mouse up
      this.getInteractiveObjects(); // refresh interactive objects
    });

    window.addEventListener("click", (event) => {
      if (this.outlinePass.selectedObjects[0]?.interactive === true) {
        this.activeObject = this.outlinePass.selectedObjects[0];
        this.controlPanelChildren = this.activeObject.parent.children;
        this.controlPanelChildren.forEach((child) => {
          if (child.name.includes("Disk")) {
            child.interactive = true;
          }
        });
        if (this.activeObject.base) {
          console.log(this.activeObject);
          this.base = this.activeObject;
          console.log(this.base);
          this.handleBaseClick();
        } else if (this.activeObject.disk) {
          this.handleDiskClick();
        }
      }
    });

    window.addEventListener("keydown", (event) => {
      if (this.onGame) {
        if (event.code === "Space" || event.code === "Escape") {
          this.returnCamera();

          // Reset outlined object
          this.outlinePass.selectedObjects = [];

          // Reset active object
          this.activeObject = null;

          // If any objects have been modified during the interaction, reset them
          // For example, you might reset any objects that have been moved or changed color
          this.interactiveObjects.forEach((object) => {
            // Add code here to reset each object to its original state
            object.interactive = false;
          });
          this.base.interactive = true;
        }
      }
    });

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildUtils();
    } else {
      this.resources.on("ready", () => {
        this.buildUtils();
      });
    }
  }

  moveCamera() {
    this.grassScene.onGame = true;

    const targetPosition = new THREE.Vector3();

    // Copy the intersected object's position
    this.stelePosition = this.outlinePass.selectedObjects[0].position.clone();

    // Move the target position a bit to the left (negative x) and up (positive y)
    targetPosition.x -= -3;
    targetPosition.y += 0;
    targetPosition.z += 10;

    const newPosition = { x: -5, y: 8, z: 3 };
    const newUp = { x: 0, y: 6, z: 0 };

    this.originalPosition = this.camera.position.clone();
    this.originalUp = this.camera.up.clone();

    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    this.originalTarget = new THREE.Vector3();
    this.originalTarget.copy(this.camera.position).add(direction);

    // Use GSAP to animate the camera's movement
    gsap.to(this.camera.position, {
      duration: 1, // duration of the animation in seconds
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      onUpdate: () => {
        // Ensure the camera's up vector is set to signify the y-axis as up
        this.camera.up.set(newUp.x, newUp.y, newUp.z);
        this.camera.lookAt(-5, 2.5, 9);
      },
      onComplete: () => {
        this.onGame = this.grassScene.onGame;
      },
      ease: "power1.out", // easing function for the animation
    });
  }

  returnCamera() {
    if (this.originalPosition && this.originalUp) {
      this.camera.position.copy(this.originalPosition);
      this.camera.up.copy(this.originalUp);
      this.camera.lookAt(this.originalTarget);

      this.grassScene.onGame = false;
      this.onGame = this.grassScene.onGame;
    }
  }

  buildUtils() {
    this.getInteractiveObjects();

    this.composer = new EffectComposer(this.renderer.instance);

    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      this.scene,
      this.camera,
      this.getInteractiveObjects(),
      this.target
    );
    this.outlinePass.visibleEdgeColor.set("#ffffff");
    this.outlinePass.hiddenEdgeColor.set("#ffffff");
    this.outlinePass.edgeStrength = 5;
    this.outlinePass.edgeGlow = 0;

    this.composer.addPass(this.outlinePass);

    this.filmPath = new FilmPass(0.2, 0, 0, false);
    this.filmPath.clear = true;
    this.composer.addPass(this.filmPath);

    this.shaderPath = this.setShaderPath();
    this.composer.addPass(this.shaderPath);

    this.composer.renderer.physicallyCorrectLights = false;

    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();

    window.addEventListener("mousemove", (event) => {
      this.onMouseMove(event);
      if (this.activeObject && this.activeObject.disk) {
        this.handleDiskHover();
      }
    });

    this.setDebug();
  }

  setShaderPath() {
    return new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        vignette: { value: 0.5 },
        exposure: { value: 1 },
        color: { value: new THREE.Color("#ffffff") },
      },
      vertexShader,
      fragmentShader,
    });
  }

  setDebug() {
    if (this.debug.active) {
      // Ajoutez la propriété isVignette à la classe OutlineModule et initialisez-la avec une valeur booléenne
      this.isVignette = { enabled: true };
      this.debugFolder.addInput(this.isVignette, "enabled");
    }
  }

  getInteractiveObjects() {
    this.interactiveObjects = [];
    this.scene.children.filter((object) => {
      if (object.isGroup) {
        object.children.forEach((child) => {
          child.interactive === true && this.interactiveObjects.push(child);
        });
      } else {
        object.interactive === true && this.interactiveObjects.push(object);
      }
    });
  }

  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    if (!this.mouseDown) {
      this.raycaster.setFromCamera(this.mouse, this.camera);
    }
  }

  handleBaseClick() {
    this.activeObject.traverse((child) => {
      if (child.base) {
        child.interactive = false;
        this.moveCamera();
      } else if (child.disk) {
        child.interactive = true;
      }
    });

    this.getInteractiveObjects(); // Refresh interactive objects
    this.activeObject = null;
  }

  handleDiskClick() {
    // You might have additional behavior you want to implement when a disk is clicked.
    // For example, you could change the color of the disk or move it to a different location.
  }

  handleDiskHover() {
    this.activeObject.traverse((child) => {
      if (child.disk) {
        child.interactive = false;
      }
    });

    this.activeObject.interactive = true; // Make the currently hovered disk interactive
    this.getInteractiveObjects(); // Refresh interactive objects
  }

  update() {
    if (this.shaderPath) {
      this.shaderPath.uniforms.vignette.value = this.isVignette?.enabled
        ? 0.5
        : 0.0;
    }

    // Only perform raycasting and outlining if mouse is not down, or if it's down and active object is a disk.
    if (!this.mouseDown || (this.mouseDown && this.activeObject?.disk)) {
      const intersects = this.raycaster?.intersectObjects(
        this.interactiveObjects,
        true
      );
      if (intersects?.length > 0) {
        intersects.forEach((i) => {
          if (i.object.type === "Points") {
            // DELETE object from intersect array
            intersects.splice(intersects.indexOf(i), 1);
          }
        });
        const obj = intersects[0]?.object;
        if (obj.interactive === true) {
          const object = obj;
          this.outlinePass.selectedObjects = [object];

          // Translate interact text on top of object position
          const screenPosition = object.position.clone();
          screenPosition.project(this.camera);
          screenPosition.x = ((screenPosition.x + 1) * window.innerWidth) / 2;
          screenPosition.y = (-(screenPosition.y - 1) * window.innerHeight) / 2;
        }
      } else {
        this.outlinePass &&
          this.outlinePass?.selectedObjects != [] &&
          (this.outlinePass.selectedObjects = []);
      }
    }
    this.composer?.render();
  }
}
