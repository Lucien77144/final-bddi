import Experience from "@/WebGL/Experience";
import * as THREE from "three";

export default class Symbol {
    constructor({_symbolName = 'symbol1', _position = new THREE.Vector3(0, 0, 0)} = {}) {
        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.scene = this.experience.scene;
        
        this.symbolName = _symbolName;
        this.resource = this.resources.items[_symbolName.name];
        this.position = _position;
        this.model = null;
        this.setSymbol();
    }

    setSymbol() {
        // Fetch the symbol group from the loaded resources
        // const symbolGroup = this.resource;
        // // Position the symbol
        // symbolGroup.position.copy(this.position);

        // // Scale the symbol
        // symbolGroup.scale.set(0.1, 0.1, 0.1);
        
        // // Rotate the symbol
        // symbolGroup.rotation.y = Math.PI / 2;

        // // Add the symbol to the scene
        // this.scene.add(symbolGroup);
    
        // // Save the symbol group in the model property for further use
        // this.model = symbolGroup;
        // console.log(this.model);

        // Set a plane geometry as the symbol model
        const symbolGeometry = new THREE.PlaneGeometry(1, 1, 1, 1);
        // Set a material for the symbol model
        const symbolMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            map: this.resource,
            transparent: true,
            side: THREE.DoubleSide,
        });
        // Create the symbol model
        this.model = new THREE.Mesh(symbolGeometry, symbolMaterial);
        // Position the symbol
        this.model.position.copy(this.position);
        // Scale the symbol
        this.model.scale.set(1.1, 1.1, 1.1);
        // Rotate the symbol
        this.model.rotation.y = Math.PI / 2;
        // Add the symbol to the scene
        this.scene.add(this.model);
    }
    
    update() {
        //make the symbol float
        // this.model.position.y = Math.sin(this.experience.time.elapsed * 0.001) * 0.1;
        // console.log(this.model.position.y);
    }
}