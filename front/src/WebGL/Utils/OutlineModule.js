import * as THREE from "three";
import Experience from "../Experience";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass.js";
import gsap from "gsap";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import vertexShader from "../Components/WorldShaders/vertexShader.glsl";
import fragmentShader from "../Components/WorldShaders/fragmentShader.glsl";
import { currentPlayer } from "@/scripts/room";
import * as ROOM from "@/scripts/room";

let instance = null;
export default class OutlineModule {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.renderer = this.experience.renderer;
    this.camera = this.experience.camera.instance;
    this.grassScene = this.experience.activeScene;
    this.resources = this.experience.resources;

    this.originalPosition = null;
    this.originalUp = null;
    this.onGame = false;
    this.onLetter = false;
    this.debug = this.experience.debug;
    this.activeObject = null;
    this.base = [];
    this.mouseDown = false;
    this.isInForest = false;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder({
        title: "vignette",
        expanded: false,
      });
    }

    this.isLetterAnimationFinished = false;

    this.outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.scene,
      this.camera
    );
    this.backupCamPosition = this.camera.position.clone();

    this.activeObject = null;
    this.base = [];
    this.baseInteractive = true;

    this.mouseDown = false;

    this.handleLetterClick = this.handleLetterClick.bind(this);

    window.addEventListener('mousedown', (event) => {
        if ( currentPlayer.role === "heda" ) return;
        this.mouseDown = true;
    });

    window.addEventListener('mouseup', (event) => {
        if ( currentPlayer.role === "heda" ) return;
        this.mouseDown = false;
        this.activeObject = null;  // clear active object on mouse up
        this.getInteractiveObjects();  // refresh interactive objects
    });

        window.addEventListener('click', (event) => {
            if ( currentPlayer.role === "heda" ) return;
            if (this.outlinePass.selectedObjects[0]?.interactive === true) {
                this.activeObject = this.outlinePass.selectedObjects[0];
        if (this.activeObject.name === "controlPanel") {
          this.controlPanelChildren = this.activeObject.parent.children;
          this.controlPanelChildren.forEach((child) => {
            if (child.name.includes("Disk")) {
              child.interactive = true;
            }
          })
          if (this.activeObject.base) {
            this.base.push(this.activeObject);
            this.handleBaseClick();
          }
        } else if (this.activeObject.type === "letter") {
          this.handleLetterClick();
        }
      }
    });

        window.addEventListener('keydown', (event) => {
            if(this.onGame) {
                if ((event.code === 'Space') || (event.code === 'Escape')) {
                    this.returnCamera();
        
                    // Reset outlined object
                              this.outlinePass.selectedObjects = [];

          this.activeObject = null;

          this.baseInteractive = true;

          this.interactiveObjects.forEach((object) => {
            if(object.name.includes("Disk")) {
              object.interactive = false;
            }
          });
        }
      } else if (this.onLetter) {
        if (event.code === "Space" || event.code === "Escape") {
          this.returnLetter();
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

  handleLetterClick() {
    if ( currentPlayer.role === "urma" ) {
      this.letter  = this.activeObject.parent
      ROOM.letterClicked();
      this.activeObject.interactive = false;
      // console.log(this.activeObject);
    } else {
      this.letter = this.scene.children.filter((child) => child.name === "letter")[0];
      // console.log(this.letter);
      this.letter.children[0].interactive = false
    }
    this.onLetter = true;
    // Define how far in front of the camera the object should appear
    const distanceInFrontOfCamera = 5;
    // Get a new position in front of the camera
    const direction = new THREE.Vector3();
    this.camera.getWorldDirection(direction);
    const newPosition = new THREE.Vector3();
    newPosition
      .copy(this.camera.position)
      .add(direction.multiplyScalar(distanceInFrontOfCamera));

    // Define the new scale you want for the object
    const newScale = new THREE.Vector3(1, 1, 1); // Scale up by 3

    const newRotation = new THREE.Vector3(-Math.PI / 2, 0, -Math.PI / 2);
    // Use GSAP to animate the letter's scale and position
    gsap.to(this.letter.scale, {
      duration: 1, // duration of the animation in seconds
      x: newScale.x,
      y: newScale.y,
      z: newScale.z,
      ease: "power1.out", // easing function for the animation
    });

    gsap.to(this.letter.position, {
      duration: 1, // duration of the animation in seconds
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      ease: "power1.out", // easing function for the animation
    });

    gsap.to(this.letter.rotation, {
      duration: 1, // durée de l'animation en secondes
      x: newRotation.x,
      y: newRotation.y,
      z: newRotation.z,
      ease: "power1.out", // fonction d'interpolation pour l'animation
      onComplete: () => {
        this.isLetterAnimationFinished = true;
      },
    });

    // const dialogBox = document.getElementById("dialogBox");
    // gsap.to(dialogBox.style, {
    //   duration: 0.5,
    //   width: "500px", // The final width of the dialog box
    //   height: "300px", // The final height of the dialog box
    //   opacity: "1",
    //   ease: "power1.out", // easing function for the animation
    // });
  }

  returnLetter() {
    this.onLetter = false;

    // Hide activeObject
    this.activeObject.parent.visible = false;

    // Get the SVG element
    const letterIcon = document.querySelector(".letter-icon");

    // Make the SVG visible
    letterIcon.style.display = "block";

    // letterIcon.style.transform = 'scale(2.5)';
    // gsap.to(letterIcon.style, {
    //     duration: 1, // duration of the animation in seconds
    //     left: '0px', // replace with original x position
    //     top: '0px', // replace with original y position
    //     scale: 1, // replace with original scale
    //     ease: "power1.out" // easing function for the animation
    // });
    const dialogBox = document.getElementById("dialogBox");
    gsap.to(dialogBox.style, {
      duration: 0.5,
      width: "500px", // The final width of the dialog box
      height: "300px", // The final height of the dialog box
      opacity: "1",
      ease: "power1.out", // easing function for the animation
    });
  }

  returnLetter() {
    this.onLetter = false;

    // Hide activeObject
    this.letter.visible = false;

    // remove letter container
    document.querySelector(".letter-container").remove();

    // Get the SVG element
    const letterIcon = document.querySelector(".letter-icon");

    // Make the SVG visible
    letterIcon.style.display = "block";

    // letterIcon.style.transform = 'scale(2.5)';
    // gsap.to(letterIcon.style, {
    //     duration: 1, // duration of the animation in seconds
    //     left: '0px', // replace with original x position
    //     top: '0px', // replace with original y position
    //     scale: 1, // replace with original scale
    //     ease: "power1.out" // easing function for the animation
    // });

    //gsap from to
    gsap.fromTo(
      letterIcon.style,
      {
        left: "-40px", // replace with original x position
        top: "-25px", // replace with original y position
        scale: 2, // replace with original scale
      },
      {
        duration: 1, // duration of the animation in seconds
        left: "0px", // replace with original x position
        top: "0px", // replace with original y position
        scale: 1, // replace with original scale
        ease: "power1.out", // easing function for the animation
      }
    );
  }

  forestFilter(factor) {
    if (factor > 0.7 && !this.isInForest) {
      // entering forest
      this.isInForest = true;
      gsap.to(this.shaderPath.uniforms.vignette, {
        duration: 2,
        value: 0.75,
        ease: "power1.out",
      });

      gsap.to(this.grassScene.clouds.material.uniforms.uFogColor.value, {
        duration: 2,
        ...new THREE.Color("#43795a"),
        ease: "power1.out",
      });
    } else if (factor <= 0.7 && this.isInForest) {
      // leaving forest
      this.isInForest = false;
      gsap.to(this.shaderPath.uniforms.vignette, {
        duration: 2,
        value: 0.5,
        ease: "power1.out",
      });

      gsap.to(this.grassScene.clouds.material.uniforms.uFogColor.value, {
        duration: 2,
        ...new THREE.Color("#d8d8d8"),
        ease: "power1.out",
      });
    }
  }

  moveCamera() {
    this.onGame = true;


    const newPosition = { x: -5, y: 6, z: 3 };
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
        this.camera.lookAt(-5, 2.4, 6);
      },
      onComplete: () => {
        this.onGame = true;
      },
      ease: "power1.out", // easing function for the animation
    });
  }

  returnCamera() {
    if (this.originalPosition && this.originalUp) {
      this.camera.position.copy(this.originalPosition);
      this.camera.up.copy(this.originalUp);
      this.camera.lookAt(this.originalTarget);

      this.onGame = false;
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
  }

  setShaderPath() {
    return new ShaderPass({
      uniforms: {
        tDiffuse: { value: null },
        vignette: { value: 0.5 },
        uTime: { value: 0 },
        isLetterOpen: { value: false },
        uSteamColor: { value: new THREE.Color("#c9c9c9") },
        uPosZ: { value: 0 },
      },
      vertexShader,
      fragmentShader,
    });
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
        this.baseInteractive = false;
        this.moveCamera();
      } else if (child.disk) {
        this.baseInteractive = true;
      }
    });

    this.getInteractiveObjects(); // Refresh interactive objects
    this.activeObject = null;

    // const dialogBox = document.getElementById("dialogBox");

    // if (dialogBox) {
    //   dialogBox.textContent = "Your text here..."; // Set the text before starting the animation

    //   // Create a GSAP timeline
    //   var tl = gsap.timeline();
    //   tl.from(dialogBox, { opacity: 0, duration: 0.1 }) // First animate the opacity
    //     .to(dialogBox, {
    //       paddingLeft: "20px", // Then animate the padding
    //       paddingRight: "20px", // Then animate the padding
    //       duration: 0.5,
    //       opacity: 1,
    //       ease: "power1.out",
    //     });
    // } else {
    //   console.log("Dialog box element not found");
    // }
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
    if(this.shaderPath) {
      this.shaderPath.uniforms.uTime.value = this.experience.time.elapsed;
      this.shaderPath.uniforms.uPosZ.value = this.camera.position.z;
      this.shaderPath.uniforms.isLetterOpen.value = this.onLetter;
    }

    if (!this.mouseDown || (this.mouseDown && this.activeObject?.disk)) {
      const intersects = this.raycaster?.intersectObjects(
        this.interactiveObjects,
        true
        );
        if (currentPlayer.role === "urma") {
          if (intersects?.length > 0) {
            intersects.forEach((i) => {
              if (i.object.type === "Points") {
                intersects.splice(intersects.indexOf(i), 1);
              }
            });
            const obj = intersects[0]?.object;
          if (obj.interactive === true) {
            const object = obj;
            if (object?.name === "controlPanel") {
              this.outlinePass.selectedObjects = this.interactiveObjects.filter((e) => e.name.includes("controlPanel") && this.baseInteractive);
            } else {
              this.outlinePass.selectedObjects = [object];
            }
  
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
    }
    this.composer?.render();
  }
}