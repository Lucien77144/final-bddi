import EventEmitter from "utils/EventEmitter.js";

class InputManager extends EventEmitter {
  constructor() {
    super();

    this.setKeyEvents();
    this.setMouseEvents();
  }

  setKeyEvents() {
    addEventListener("keydown", ({ key }) => {
      this.trigger(key, [true]);
      this.setKeyHandler(key, true);
      this.initAudio();
    });
    addEventListener("keyup", ({ key }) => {
      this.trigger(key, [false]);
      this.setKeyHandler(key, false);
      this.initAudio();
    });
  }

  setKeyHandler(key, value) {
    switch (key) {
      case "ArrowUp":
      case "w":
      case "z":
        this.trigger("up", [value]);
        break;
      case "ArrowDown":
      case "s":
        this.trigger("down", [value]);
        break;
      case "ArrowLeft":
      case "q":
      case "a":
        this.trigger("left", [value]);
        break;
      case "ArrowRight":
      case "d":
        this.trigger("right", [value]);
        break;
      case " ":
        this.trigger("space", [value]);
        break;
      case "Shift":
        this.trigger("shift", [value]);
        break;
      default:
        break;
    }
  }

  setMouseEvents() {
    addEventListener("mousedown", (event) => {
      this.trigger("mousedown", [event]);
      this.initAudio();
    });
    addEventListener("mouseup", ({ event }) => {
      this.trigger("mouseup", [event]);
      this.initAudio();
    });
  }

  initAudio() {
    if(!this.audioLoaded) {
      this.trigger("startAudio");
    }
  }
}

export default new InputManager();