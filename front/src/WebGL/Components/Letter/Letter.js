import Experience from '@/WebGL/Experience';
import * as THREE from 'three';
import Cube from '../Cube/Cube';

export default class Letter {
    constructor(_position = new THREE.Vector3(0, 0, 0)) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.resource = this.resources.items.letterModel;
        this.scene = this.experience.scene;

        this.position = _position;
        console.log(this.resource);
        // Setting letter
        this.setModel();
    }

    setModel() {
        this.model = this.resource.scene;
        this.model.position.copy(this.position)
        this.model.name = "letter";
        this.model.interactive = true;
        console.log(this.model);
        this.scene.add(this.model);
    }
}