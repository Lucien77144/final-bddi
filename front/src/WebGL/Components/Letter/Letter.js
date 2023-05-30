import Experience from '@/WebGL/Experience';
import * as THREE from 'three';
import Cube from '../Cube/Cube';

export default class Letter {
    constructor(_position = new THREE.Vector3(0, 0, 0)) {
        this.experience = new Experience();
        this.resources = this.experience.resources;

        // Setting letter
        this.cube = new Cube(_position);

    }
}