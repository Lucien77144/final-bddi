import Experience from "../Experience.js";
import Cube from "../Components/Cube/Cube.js";
import Floor from "../Components/Floor/Floor.js";
import Environment from "../Components/Environment.js";
import Liana from "../Components/Liana/Liana.js";
import * as THREE from "three";

export default class Trial2Scene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    
    this.song = [];
    this.currentNote = null;
    this.notes = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    this.canPlay = true;

    // Wait for resources
    if(this.resources.loaded == this.resources.toLoad) {
      this.buildScene();
    } else {
      this.resources.on("ready", () => {
        this.buildScene();
      });
    }
  }

  buildScene() {
    
    this.floor = new Floor();
    this.environment = new Environment();
    // Build 3 sticks 
    this.liana1 = new Liana(new THREE.Vector3(-2, 2, 0));
    this.liana2 = new Liana(new THREE.Vector3(0, 2, 0));
    this.liana3 = new Liana(new THREE.Vector3(2, 2, 0));
    // Raycaster to detect mouse on liana
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    // Mouse move event
    window.addEventListener("mousemove", (event) => {
      if(this.canPlay) {
        this.handleMouseMove(event);
      }
    });
    
    // Position sticks 
  }

    handleMouseMove(event) {

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        this.mouse.z = 1;
        this.raycaster.setFromCamera(this.mouse, this.experience.camera.instance);
        // Intersect liana1
        const intersects1 = this.raycaster.intersectObject(this.liana1.mesh);
        if (intersects1.length > 0) {

          if(intersects1[0].point.y > 1 && intersects1[0].point.y < 2) {
            
            if(this.currentNote != this.notes[0]) {
                this.currentNote = this.notes[0];
                this.song.push(this.currentNote);
            }

              this.liana1.mesh.material.color.set(0xff0000);

          } else if(intersects1[0].point.y > 2 && intersects1[0].point.y < 3) {

            if(this.currentNote != this.notes[1]) {
              this.currentNote = this.notes[1];
              this.song.push(this.currentNote);
          }

              this.liana1.mesh.material.color.set(0x0000ff);

          }

        } else {
            this.liana1.mesh.material.color.set(0x00ff00);
        }

        // Intersect liana2
        const intersects2 = this.raycaster.intersectObject(this.liana2.mesh);

        if (intersects2.length > 0) {

          if(intersects2[0].point.y > 1 && intersects2[0].point.y < 2) {

            if(this.currentNote != this.notes[2]) {
              this.currentNote = this.notes[2];
              this.song.push(this.currentNote);
          }
            this.liana2.mesh.material.color.set(0x0a465d);
            } else if(intersects2[0].point.y > 2 && intersects2[0].point.y < 3) {

              if(this.currentNote != this.notes[3]) {
                this.currentNote = this.notes[3];
                this.song.push(this.currentNote);
            }

                this.liana2.mesh.material.color.set(0xf8526c);
            }

        } else {
            this.liana2.mesh.material.color.set(0x00ff00);
        }
        // Intersect liana3
        const intersects3 = this.raycaster.intersectObject(this.liana3.mesh);
        if (intersects3.length > 0) {
          if(intersects3[0].point.y > 1 && intersects3[0].point.y < 2) {

            if(this.currentNote != this.notes[4]) {
              this.currentNote = this.notes[4];
              this.song.push(this.currentNote);
          }

            this.liana3.mesh.material.color.set(0x5271ff);

            } else if(intersects3[0].point.y > 2 && intersects3[0].point.y < 3) {

              if(this.currentNote != this.notes[5]) {
                this.currentNote = this.notes[5];
                this.song.push(this.currentNote);
            }
                this.liana3.mesh.material.color.set(0xe9f204);
            }
        } else {
            this.liana3.mesh.material.color.set(0x00ff00);
        }

    }

    playSong() {
      this.canPlay = false;
      const currentSong = this.song;
      this.song = [];
      // Reset sticks
      this.liana1.mesh.material.color.set(0x00ff00);
      this.liana2.mesh.material.color.set(0x00ff00);
      this.liana3.mesh.material.color.set(0x00ff00);
      // Play song
      console.log(currentSong);
      currentSong.forEach((note, index) => {
        setTimeout(() => {
          switch(note) {
            case 'A1':
              this.liana1.mesh.material.color.set(0xff0000);

              break;
            case 'A2':
              this.liana1.mesh.material.color.set(0x0000ff);
              
              break;
            case 'B1':
              this.liana2.mesh.material.color.set(0x0a465d);
              
              break;
            case 'B2':
              this.liana2.mesh.material.color.set(0xf8526c);
              break;
            case 'C1':
              this.liana3.mesh.material.color.set(0x5271ff);
              
              break;
            case 'C2':
              this.liana3.mesh.material.color.set(0xe9f204);
              
              break;
          }
        }, 1000 * index);
      });
      setTimeout(() => {
        this.canPlay = true;
      }, 1000 * currentSong.length);
    }


  update() { 
    if(this.song.length > 5) {
      this.playSong();
    }
  }
}
