import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import sources from './sources';
import { gsap } from "gsap";
import { roleSelectionEvent } from '@/scripts/room';

export default class RoleSelection {
  constructor(_canvas) {

    this.canvas = _canvas;

    this.swipeButton = document.querySelector('#swipeButton');
  
    // Create scene
    this.scene = new THREE.Scene();
  
    // Create camera
    const fov = 75;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const near = 0.1;
    const far = 1000;
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = 5; // Move camera away
  
    // Create renderer with alpha
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.selectionRoleContinue = document.querySelector('#selectionRoleContinue');
  
    // Adjust canvas and camera aspect ratio on resize
    window.addEventListener('resize', () => {
      this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
      this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
      this.camera.updateProjectionMatrix();

    });
    
    this.clock = new THREE.Clock();
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // soft white light
    this.scene.add(ambientLight);

    this.sunLight = new THREE.DirectionalLight( 0xffffff, 0.4 );
    this.sunLight.position.set(0, 10, 0);
    this.sunLight.name = "sunLight";
    this.sunLight.castShadow = true;
    this.scene.add(this.sunLight);
 
  
    // Load models
    this.loaders = {};
    this.loaders.gltfLoader = new GLTFLoader();
    this.sources = sources;
    this.loadModels();
    // Start rendering
    this.animate();

    // Define a property to keep track of which model is active
    this.activeModel = 'urmaModel';
    this.role = 'urma';

    // Add event listener to the button
    this.swipeButton.addEventListener('click', () => this.handleSwipeButton());

    this.selectionRoleContinue.addEventListener('click', () => this.handleContinueButton());
  }
  

  loadModels() {
    // Find URMA and Fairy models
    const urmaModel = this.sources.find((source) => source.name === 'urmaModel');
    const ponchoModel = this.sources.find((source) => source.name === 'ponchoModel');
    const fairyModel = this.sources.find((source) => source.name === 'fairyModel');

  
    // URMA Model
    this.loaders.gltfLoader.load(
      urmaModel.path,
      (gltf) => {
        this.urmaModel = gltf.scene;
  
        // Set model position
        this.urmaModel.position.set(0, -1, 3); // In front
        this.urmaModel.scale.set(1.5, 1.5, 1.5); // Scale down
        this.urmaModel.castShadow = true; // Enable shadow

        this.loaders.gltfLoader.load(
          ponchoModel.path,
          (gltf) => {
            this.ponchoModel = gltf.scene;
            this.scene.add(this.ponchoModel); // Add model to scene
            this.ponchoModel.position.set(0, -0.2, 0); // In front
            this.ponchoModel.scale.set(1.2, 1.2, 1.2); // Scale down
            this.ponchoModel.castShadow = true; // Enable shadow
            // this.ponchoModel.rotation.y = Math.PI / 4;
            this.urmaModel.add(this.ponchoModel);

            this.scene.add(this.urmaModel); // Add model to scene

            this.ponchoMixer = new THREE.AnimationMixer(this.ponchoModel);
            const idleAnimation = gltf.animations.find((animation) => animation.name === 'Main_idle');
            this.ponchoAction = this.ponchoMixer.clipAction(idleAnimation);
            this.ponchoAction.play();

          },
          undefined,
          (error) => {
            console.error(error);
          }
        );
  
        // Store animation mixer and idle animation
        this.urmaMixer = new THREE.AnimationMixer(this.urmaModel);
        const idleAnimation = gltf.animations.find((animation) => animation.name === 'Idle');
        this.urmaAction = this.urmaMixer.clipAction(idleAnimation);
        this.urmaAction.play();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Poncho Model
    
  
    // Fairy Model
    this.loaders.gltfLoader.load(
      fairyModel.path,
      (gltf) => {
        this.fairyModel = gltf.scene;
        this.fairyModel.rotation.y = Math.PI / 2;
        this.scene.add(this.fairyModel); // Add model to scene
        
        // Set model positionà
        this.fairyModel.position.set(3, 0, 3); // To the right of urmaModel
        this.fairyModel.scale.set(0.2, 0.2, 0.2); // Scale down
        // Store animation mixer and fly animation
        this.fairyMixer = new THREE.AnimationMixer(this.fairyModel);
        const flyAnimation = gltf.animations.find((animation) => animation.name === 'fly');
        this.fairyAction = this.fairyMixer.clipAction(flyAnimation);
        this.fairyAction.play();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }
  

  handleSwipeButton() {
    // Toggle active model
    this.activeModel = this.activeModel === 'urmaModel' ? 'fairyModel' : 'urmaModel';
    this.role = this.role === 'urma' ? 'heda' : 'urma';
    
    // Determine the target position
    const targetPosition = this.activeModel === 'urmaModel'
      ? { x: 0, y: 0, z: 5 }  // Adjust position as needed
      : { x: 3, y: 0, z: 5 }; // Adjust position as needed
    
    // Use GSAP to animate the camera movement
    gsap.to(this.camera.position, { 
      duration: 1, // duration of the transition in seconds
      x: targetPosition.x, 
      y: targetPosition.y, 
      z: targetPosition.z, 
      ease: 'power2.inOut', // easing function for the transition
      onUpdate: () => this.camera.updateProjectionMatrix() // update the camera's matrix each frame
    });

    const roleDescription = document.querySelector('.roleDescription');
    roleDescription.innerHTML = this.activeModel === 'urmaModel' ? 'Tu vas jouer Urma' : 'Tu vas jouer Hada';
  }

  handleContinueButton() {
    roleSelectionEvent(this.role);
  }

  animate() {
    requestAnimationFrame(() => this.animate());
  
    // Calculate delta time for mixer updates
    const delta = this.clock.getDelta();
  
    // Update mixers
    if (this.urmaMixer) this.urmaMixer.update(delta);
    if (this.ponchoMixer) this.ponchoMixer.update(delta);
    if (this.fairyMixer) this.fairyMixer.update(delta);
  
    this.renderer.render(this.scene, this.camera);
  }
  
}
