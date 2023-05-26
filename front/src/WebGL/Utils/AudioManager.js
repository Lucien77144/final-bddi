import { Audio, AudioListener } from "three";
import Experience from "../Experience";

let listener = null;
export default class AudioManager {
    constructor({
      _path = null,
      _loop = false,
      _volume = 1,
    } = {}) {
      if(!_path) return;
      console.log('pass');
      
      this.experience = new Experience();
      this.camera = this.experience.camera.instance;
      this.resources = this.experience.resources;
      
      this.path = _path;
      this.isAudioLoaded = false;
      this.isPlaying = false;
      this.loop = _loop;
      this.volume = _volume;
      
      // Singleton of audio listener
      if (listener) {
        return listener;
      } else {
        this.initAudio();
      }
      
      // Wait for resources
      if (this.resources.loaded == this.resources.toLoad) {
        this.buildSound();
      } else {
        this.resources.on("ready", () => {
          this.buildSound();
        });
      }
    }

    buildSound() {
      this.audio = this.resources.items[this.path];
      
      this.sound = new Audio( listener );

      this.sound.setBuffer( this.audio );
      this.sound.setLoop( this.loop );
      this.sound.setVolume( this.volume );
      this.sound.play();
    }
  
    initAudio() {
      listener = new AudioListener();
      this.camera.add( listener );
    }
  
    play() {
      if (!this.isAudioLoaded) {
        console.error("Audio not loaded yet");
        return;
      }
      this.source.start(0);
      this.isPlaying = true;
    }
  
    stop() {
      if (!this.isAudioLoaded) {
        console.error("Audio not loaded yet");
        return;
      }
      this.source.stop(0);
      this.isPlaying = false;
      // We need to create a new source after stopping the old one
      // this.source = this.audioContext.createBufferSource();
      this.loadAudio();
    }
  
    toggle() {
      if (this.isPlaying) {
        this.stop();
      } else {
        this.play();
      }
    }
  }
  