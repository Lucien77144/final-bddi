import Experience from '@/WebGL/Experience';
import * as THREE from 'three';

export default class Stele {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.geometry = new THREE.BoxGeometry(1, 1, 1); // Change this to adjust the size of the cube
        this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Change this to adjust the color of the cube
        this.cube = new THREE.Mesh(this.geometry, this.material);
        this.cube.interactive = true;
        this.cube.name = "stele";
        this.addToScene();
        this.setPosition(-5, 2.5, 9);
    }

    addToScene() {
        this.scene.add(this.cube);
    }

    // If you want to update the position, you can create a setPosition method
    setPosition(x, y, z) {
        this.cube.position.set(x, y, z);
    }

    // Similarly, if you want to remove the cube from the scene, you can create a removeFromScene method
    removeFromScene() {
        this.scene.remove(this.cube);
    }
}