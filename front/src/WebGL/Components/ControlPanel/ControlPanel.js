import { Vector2, Raycaster, Vector3 } from 'three';
import Experience from '@/WebGL/Experience';

export default class ControlPanel {
    constructor(experience, _position = new Vector3(-5, 2.5, 9), _rotation = new Vector3(0, 0, 0)) {
        this.experience = experience;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.position = _position;
        this.rotation = _rotation;
        this.name = "controlPanel";

        this.resource = this.resources.items.controlReferenceModel;
        this.selectedObject = null;

        this.setModel();

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
            }
        });

        this.experience.renderer.instance.domElement.addEventListener('mousemove', (event) => {
            if (mouseDown && this.selectedObject) {
                let rect = this.experience.renderer.instance.domElement.getBoundingClientRect();
                let centerX = rect.left + (rect.width / 2);
                let centerY = rect.top + (rect.height / 2);

                let currentAngle = Math.atan2(centerY - event.clientY, event.clientX - centerX);

                if (this.previousAngle && this.previousAngle !== currentAngle) {
                    let deltaAngle = currentAngle - this.previousAngle;
                    if (deltaAngle > Math.PI) {
                        deltaAngle -= 2 * Math.PI;
                    } else if (deltaAngle < -Math.PI) {
                        deltaAngle += 2 * Math.PI;
                    }

                    this.selectedObject.rotation.y += deltaAngle;
                }

                this.previousAngle = currentAngle;
            }
        });

        this.experience.renderer.instance.domElement.addEventListener('mouseup', (event) => {
            mouseDown = false;
            this.selectedObject = null;
            this.previousAngle = null;
        });

        

    }

    setModel() {
        this.model = this.resource.scene;
        this.model.position.copy(this.position);
        console.log(this.model);
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
