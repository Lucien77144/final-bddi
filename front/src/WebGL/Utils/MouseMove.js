import Experience from "webgl/Experience.js";
import Sizes from "utils/Sizes.js";
import PathUrma from "components/Urma/PathUrma";
import * as THREE from "three";
import { currentPlayer } from "@/scripts/room";
import { currentRoom } from "@/scripts/movement";

let instance = null;
export default class MouseMove {
  constructor() {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;

    this.experience = new Experience();
    this.sizes = new Sizes();
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.path = new PathUrma();
    this.cursor = new THREE.Vector3();

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildEvent();
    } else {
      this.resources.on("ready", () => {
        this.buildEvent();
      });
    }
  }

  buildEvent() {
    // window.addEventListener("mousemove", (event) => {
    //   this.handleMouseMove(event);
    // });
  }

  // handleMouseMove(event) {
  //   this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
  //   this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;
  // }

    update = () => {
      if(currentRoom) {

          //Find Heda's position from the players array in currentRoom.
          let heda = currentRoom.players.find(player => player.role === "heda");
          if(heda){
            // Assign Heda's position to this.cursor
            this.cursor.x = (heda.position.x / this.sizes.width) * 2 - 1;
            this.cursor.y = -(heda.position.y / this.sizes.height) * 2 + 1;
          } else {
            console.log("Heda not found");
        }
    
      }
      let vector = new THREE.Vector3(this.cursor.x, this.cursor.y, this.cursor.z);
      vector.unproject(this.camera);
      let dir = vector.sub(this.camera.position).normalize();
      let distance = -this.camera.position.x / dir.x + (this.path.position.x + .35) / dir.x;
      let pos = this.camera.position.clone().add(dir.multiplyScalar(distance));
      this.cursor = pos;

      // Keep the loop going
    }  
}
