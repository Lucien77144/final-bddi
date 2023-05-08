import * as THREE from 'three';
import Resources from './Utils/Resources';
import sources from './sources';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import Camera from './Camera';
import Renderer from './Renderer';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { roleSelectionEvent } from '../scripts/room';

let instance = null

export default class RoleSelection {
  constructor(_canvas) {

    this.swipeButton = document.querySelector('#swipeButton');
    this.roleDescription = document.querySelector('.roleDescription');
    this.selectionRoleContinue = document.querySelector('#selectionRoleContinue');
    this.roleDescription.innerHTML = "urma"
    this.selectedRole = 'urma';

    this.swipeButton.addEventListener('click', () => {
      this.switchRole();
    });

    this.selectionRoleContinue.addEventListener('click', () => {
      roleSelectionEvent(this.selectedRole);
    });

    this.canvas = _canvas;
    this.scene = new THREE.Scene()

    // Cube
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)
    this.scene.add(cubeMesh)

    // Cube 2

    const cubeGeometry2 = new THREE.BoxGeometry(1, 1, 1)
    const cubeMaterial2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cubeMesh2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2)
    cubeMesh2.position.x = 8
    this.scene.add(cubeMesh2)

    this.sizes = {
      width: window.innerWidth / 2,
      height: window.innerHeight / 2
    }

    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.z = 3
    this.scene.add(this.camera)

    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true

    // Controls
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.enableDamping = true
    
    // Renderer
    this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        // Anti-aliasing
        antialias: true
    })

    

    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    
    // Animate
    this.clock = new THREE.Clock()

    // Make background transparent
    this.renderer.setClearColor(0x000000, 0);

    this.swipeButton.addEventListener('click', () => {
    })

    

    this.tick = () =>
    {
        this.elapsedTime = this.clock.getElapsedTime()
    
        // Update controls
        this.controls.update()
    
        // Render
        this.renderer.render(this.scene, this.camera)
    
        // Call tick again on the next frame
        window.requestAnimationFrame(this.tick)
    }
    
    this.tick()
  }

  switchRole() {
    if (this.selectedRole === 'urma') {
      this.selectedRole = 'heda';
      this.roleDescription.innerHTML = "heda"
    } else {
      this.selectedRole = 'urma';
      this.roleDescription.innerHTML = "urma"
    }
  }
}

