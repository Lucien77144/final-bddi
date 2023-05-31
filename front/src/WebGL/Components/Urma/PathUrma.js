import Experience from "webgl/Experience.js";
import { CatmullRomCurve3, Vector3 } from "three";

const SPEED = 0.4;

let instance = null;
export default class PathUrma {
  constructor({
    _position = new Vector3(0, 0, 0),
    _factor = 0.15,
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
      new Vector3(-6.9, 2.609, 17.174),
      new Vector3(-5.49, 2.348, 15.0),
      new Vector3(-6.7, 2.261, 13.207),
      new Vector3(-6.7, 2.478, 10.598),
      new Vector3(-8.2, 2.85, 1.478),
      new Vector3(-7.2, 2.722, 0.043),
      new Vector3(-6.2, 2.321, -1.13),
      new Vector3(-5.49, 2.351, -2.826),
      new Vector3(-5.49, 2.478, -3.478),
      new Vector3(-5.9, 2.709, -6.522),
      new Vector3(-5.9, 2.913, -7.065),
      new Vector3(-5.9, 3.217, -7.935),
      new Vector3(-5.9, 3.478, -8.913),
      new Vector3(-5.9, 3.522, -9.348),
      new Vector3(-5.9, 3.609, -10.0),
      new Vector3(-5.9, 3.652, -10.326),
      new Vector3(-5.9, 3.7, -10.815),
      new Vector3(-5.9, 3.8, -11.467),
      new Vector3(-5.9, 3.7, -12.4461),
      new Vector3(-5.9, 3.6, -13.261),
      new Vector3(-5.9, 3.5, -14.239),
      new Vector3(-5.9, 3.4, -14.729),
      new Vector3(-5.5, 3.3, -15.381),
      new Vector3(-6.5, 3.2, -15.7076),
      new Vector3(-6.5, 3.1, -16.196),
      new Vector3(-6.5, 2.87, -16.522),
      new Vector3(-6.5, 2.652, -16.848),
      new Vector3(-6.5, 2.565, -18.478),
      new Vector3(-6.9, 2.565, -20.109),
      new Vector3(-9.02, 2.783, -22.935),
      new Vector3(-9.02, 2.826, -24.891),
      new Vector3(-8.32, 2.609, -26.087),
      new Vector3(-8.28, 2.609, -27.064),
      new Vector3(-7.61, 2.435, -28.804),
    ]);
  }

  getPositionAt(pos = this.factor) {
    return this.curve.getPointAt(pos);
  }

  update(delta) {
    const nextValue = this.factor + (delta / (20 / SPEED)) * -1;

    if (nextValue < 1 && nextValue > 0) {
      this.factor = nextValue;
    } else if (Math.round(nextValue) === 0) {
      this.factor /= 2;
    } else if (Math.round(nextValue) === 1) {
      this.factor += (1 - this.factor) / 2;
    }

    const point = this.curve.getPointAt(this.factor);
    this.position.copy(point);
    // this.position.y += height / 2;
  }
}
