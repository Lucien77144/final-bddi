import { Audio, AudioListener } from "three";
import Experience from "../Experience";
import InputManager from "./InputManager";

let listener = null;
export default class AudioManager {
    constructor({
      _path = null,
      _loop = false,
      _volume = 1,
    } = {}) {
      this.experience = new Experience();
      this.camera = this.experience.camera.instance;
      this.resources = this.experience.resources;
      
      this.path = _path;
      this.isAudioLoaded = false;
      this.isPlaying = false;
      this.loop = _loop;
      this.volume = _volume;
      
      // Wait for resources & event
      this.resources.on("ready", () => {
        if (this.resources.loadedAudios == this.resources.toLoadAudios) {
          InputManager.audioLoaded = true;
          this.buildSound();
        }
      });
    }

    buildSound() {
      // Singleton of audio listener
      if (listener) {
        return listener;
      } else {
        this.initListener();
      }

      this.audio = this.resources.items[this.path];
      
      this.sound = new Audio( listener );

      this.sound.setBuffer( this.audio );
      this.sound.setLoop( this.loop );
      this.sound.setVolume( this.volume );
      this.sound.play();
    }
  
    initListener() {
      listener = new AudioListener();
      this.camera.add( listener );
    }
  
    play() {
      this.source.start(0);
      this.isPlaying = true;
    }
  
    stop() {
      this.source.stop(0);
      this.isPlaying = false;
    }
  
    toggle() {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.play();
      }
    }
  }
  