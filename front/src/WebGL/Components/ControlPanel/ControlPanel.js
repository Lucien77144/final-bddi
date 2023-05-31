import { Vector2, Raycaster, Vector3 } from 'three';
import * as THREE from 'three';
import Experience from '@/WebGL/Experience';

export default class ControlPanel {
    constructor (
        _position = new Vector3(-6, 2.7, 8),
        _rotation = new Vector3(0, 0, 0)
    ) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.position = _position;
        this.rotation = _rotation;
        this.name = "controlPanel";

        this.resource = this.resources.items.controlReferenceModel;
        this.selectedObject = null;

        this.setModel();

        this.correctSections = {
            'Disk_0003': 0,  // Replace these values with the correct angles for your disks
            'Disk_1003': 4,
            'Disk_2004': 6
        };        

        this.raycaster = new Raycaster();
        this.mouse = new Vector2();
        this.previousAngle = null;

        let mouseDown = false;

        this.experience.renderer.instance.domElement.addEventListener('mousedown', (event) => {
            mouseDown = true;
        
            // Update the mouse pos
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        
            // Find meshes that are under the mouse pointer
            this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
            let intersects = this.raycaster.intersectObjects(this.model.children, true);
        
            // If there are some intersections, select the first one (the closest)
            if (intersects.length > 0 && intersects[0].object.disk) {
                this.selectedObject = intersects[0].object;
                
                let rect = this.experience.renderer.instance.domElement.getBoundingClientRect();
                let centerX = rect.left + (rect.width / 2);
                let centerY = rect.top + (rect.height / 2);
        
                // Calculate the vector from the center of the canvas to the initial mouse position
                this.initialVector = new THREE.Vector2(event.clientX - centerX, event.clientY - centerY);
                this.initialVector.normalize();
        
                this.previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        });
        
        this.experience.renderer.instance.domElement.addEventListener('mousemove', (event) => {
            if (mouseDown && this.selectedObject) {
                let rect = this.experience.renderer.instance.domElement.getBoundingClientRect();
                let centerX = rect.left + (rect.width / 2);
                let centerY = rect.top + (rect.height / 2);
        
                // Calculate the vector from the center of the canvas to the current mouse position
                let currentVector = new THREE.Vector2(event.clientX - centerX, event.clientY - centerY);
                currentVector.normalize();
        
                // Calculate the rotation angle
                let angle = Math.atan2(
                    this.initialVector.x * currentVector.y - this.initialVector.y * currentVector.x,
                    this.initialVector.x * currentVector.x + this.initialVector.y * currentVector.y
                );
        
                // Calculate the sign of the cross product of initialVector and currentVector
                let crossSign = Math.sign(this.initialVector.x * currentVector.y - this.initialVector.y * currentVector.x);
        
                // Apply the rotation to the disk
                this.selectedObject.rotation.y -= angle * crossSign;
        
                // Update the initial vector and the previous mouse position for the next mouse move event
                this.initialVector = currentVector;
                this.previousMousePosition = {
                    x: event.clientX,
                    y: event.clientY
                };
            }
        });
        
        this.experience.renderer.instance.domElement.addEventListener('mouseup', (event) => {
            mouseDown = false;
            this.previousAngle = null;
            this.selectedObject = null;

            if (this.checkGameWon()) {
                console.log("You won the game!");
            }
        });

    }

    checkGameWon() {
        // Iterate backwards through children
        for (let i = this.model.children.length - 1; i >= 0; i--) {
            const child = this.model.children[i];
            
            if(child.name.includes('Disk')) {
                const euler = new THREE.Euler();
    
                // Set the rotation order to 'YXZ' or 'YZX'
                euler.setFromQuaternion(child.quaternion, 'YXZ');
    
                const angleInDegrees = euler.y * (180 / Math.PI);
    
                // Normalize the angle to be in range [0, 360)
                const normalizedAngle = ((angleInDegrees % 360) + 360) % 360;
                // Determine the current section of the disk
                const currentSection = Math.floor(normalizedAngle / 45);
                // Check if the disk's current section is the correct one
                if (currentSection !== this.correctSections[child.name]) {
                    return false; // If not, the game is not won yet
                }
            }
        }
    
        // If all disks are showing the correct section, the game is won
        return true;
    }
    
    setModel() {
        this.model = this.resource.scene;
        this.model.position.copy(this.position);
        this.model.scale.set(1.5, 1.5, 1.5);
        this.model.name = this.name;
        this.model.interactive = true;
        this.model.children.forEach((child) => {
            if(child.name.includes('Disk')) {
                child.disk = true;
                // child.interactive = true;
            } else if(child.name.includes('Cube')){
                child.interactive = true;
                child.base = true;
            }
        });
        this.scene.add(this.model);
    }
}
