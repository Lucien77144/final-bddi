import EventEmitter from "utils/EventEmitter.js";

export default class Sizes extends EventEmitter {
  constructor() {
    super();

    // Setup
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(devicePixelRatio, 2);

    // Resize event
    addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.pixelRatio = Math.min(devicePixelRatio, 2);

      this.trigger("resize");
    });
  }
}
