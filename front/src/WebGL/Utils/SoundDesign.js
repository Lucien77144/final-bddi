export default class SoundDesign {
    constructor(audioContext, audioFilePath) {
      this.audioContext = audioContext;
      this.audioFilePath = audioFilePath;
      this.source = this.audioContext.createBufferSource();
      this.isAudioLoaded = false;
      this.isPlaying = false;
    }
  
    async loadAudio() {
      let response = await fetch(this.audioFilePath);
      let arrayBuffer = await response.arrayBuffer();
      this.source.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
      this.source.connect(this.audioContext.destination);
      this.isAudioLoaded = true;
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
      this.source = this.audioContext.createBufferSource();
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
  