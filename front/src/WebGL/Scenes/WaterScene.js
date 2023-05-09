import Environment from "../Components/Environment";
import River from "../Components/River/River";
import Experience from "../Experience";

// import shaders


export default class WaterScene {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
    
        // Wait for resources
        if (this.resources.loaded == this.resources.toLoad) {
        this.buildScene();
        } else {
        this.resources.on("ready", () => {
            this.buildScene();
        });
        }

    }
    
    buildScene() {
        // Setup
        this.environment = new Environment();
        this.river = new River();
    }
    
    update() {
        if (this.river) this.river.update();
    }
}