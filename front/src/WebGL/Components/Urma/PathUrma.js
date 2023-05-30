import Experience from "webgl/Experience.js";
import { CatmullRomCurve3, Vector3 } from "three";

const SPEED = .4;

let instance = null;
export default class PathUrma {
  constructor({
    _position = new Vector3(0, 0, 0),
    _factor = 1,
  } = {}) {
    // Singleton
    if (instance) {
      return instance;
    }
    instance = this;
    
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.position = _position;
    this.factor = _factor;

    this.setPath();
  }

  setPath() {
    this.curve = new CatmullRomCurve3([
        new Vector3(-.4, 2.2, 25),
        new Vector3(-5.5, 1.9, 11),
        new Vector3(-5.5, 2, 8),
        new Vector3(-5.5, 2.1, 5),
        new Vector3(-3, 2.8, 1.5),
        new Vector3(-2.7, 3, -.4),
        new Vector3(-.4, 2.2, -3),
        new Vector3(-.4, 2.2, -25),
    ]);
  }

  getPositionAt(pos = this.factor) {
    return this.curve.getPointAt(pos);
  }

  update(delta, height) {
    const nextValue = this.factor + (delta / (20 / SPEED)) * -1;

    if ((nextValue < 1) && (nextValue > 0)) {
      this.factor = nextValue;
    } else if (Math.round(nextValue) === 0) {
      this.factor /= 2;
    } else if (Math.round(nextValue) === 1) {
      this.factor += (1-this.factor)/2;
    }

    const point = this.curve.getPointAt(this.factor);
    this.position.copy(point);
    this.position.y += height/2;
  }
}