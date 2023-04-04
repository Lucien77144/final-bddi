import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as ROOM from '../scripts/room.js'

export default class RoleSelection {
  constructor() {
    /**
     * Base
     */
    // Canvas
    this.canvas = document.querySelector('canvas#roleSelectionCanvas')
    
    console.log(this.canvas);
    
    // Scene
    this.scene = new THREE.Scene()
    
    // Image
    this.urmaCadre = new Image()
    this.urmaCadre.src = '/img/urma-cadre.png'
    // Make the image a 3d object
    // load the texture

    
    this.texture = new THREE.Texture(this.urmaCadre)
    this.texture.needsUpdate = true
    // this.texture.minFilter = THREE.LinearFilter
    // this.texture.magFilter = THREE.LinearFilter
    // this.texture.format = THREE.RGBFormat
    // this.texture.encoding = THREE.sRGBEncoding
    // this.texture.flipY = false




    // object
    this.geometry = new THREE.PlaneGeometry(2, 3, 1, 1)
    this.material = new THREE.MeshBasicMaterial({ 
        map: this.texture,
        side: THREE.DoubleSide })
    this.urmaCadre = new THREE.Mesh(this.geometry, this.material)
    this.urmaCadre.name = "urma"
    this.urmaCadre.position.set(-3.5, 0, 0)
    
    this.scene.add(this.urmaCadre)

    this.hedaCadre = new THREE.Mesh(this.geometry, this.material)
    // flip the image
    this.hedaCadre.scale.x = -1
    this.hedaCadre.name = "heda"
    this.hedaCadre.position.set(3.5, 0, 0)

    this.scene.add(this.hedaCadre)

  
    // Make the urmaCadre move with the mouse
    this.mouse = new THREE.Vector2()
    this.raycaster = new THREE.Raycaster()
    this.intersects = []
    
    this.onMouseMove = (event) =>
    {
        // Update the mouse variable
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera)

        // Calculate objects intersecting the picking ray
        this.intersects = this.raycaster.intersectObjects(this.scene.children)

        // console.log(this.intersects);
        
        if (this.intersects.length > 0) {
          const objectToMove = this.intersects[0].object
            // rotate the urmaCadre in the direction of the mouse
            // console.log(this.mouse);
            objectToMove.rotation.x = (this.mouse.y * 0.1) 
            objectToMove.rotation.y = (this.mouse.x * 0.1)
            objectToMove.scale.x = 1.1
            objectToMove.scale.y = 1.1
        } else {
            this.urmaCadre.rotation.x = 0
            this.urmaCadre.rotation.y = 0
            this.urmaCadre.scale.x = 1
            this.urmaCadre.scale.y = 1

            this.hedaCadre.rotation.x = 0
            this.hedaCadre.rotation.y = 0
            this.hedaCadre.scale.x = 1
            this.hedaCadre.scale.y = 1
        }
    }

    window.addEventListener('mousemove', this.onMouseMove)

    // Click event
    this.onClick = () =>
    {
        if (this.intersects.length > 0) {
            console.log(this.intersects);
            ROOM.roleSelectionEvent(this.intersects[0].object.name)
        }
    }

    window.addEventListener('click', this.onClick)
 
    // Sizes
    this.sizes = {
        width: window.innerWidth,
        height: window.innerHeight / 2
    }
    
    window.addEventListener('resize', () =>
    {
        // Update sizes
        this.sizes.width = window.innerWidth 
        this.sizes.height = window.innerHeight / 2
    
        // Update camera
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix()
    
        // Update renderer
        this.renderer.setSize(this.sizes.width, this.sizes.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })
    
    // Camera
    this.camera = new THREE.PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 100)
    this.camera.position.z = 3
    this.scene.add(this.camera)
    
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
}
