import Experience from "webgl/Experience.js";
import { Vector3 } from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";

export default class Stairs {
  constructor({
    _position = new Vector3(0, 0, 0),
    _rotation = new Vector3(0, 0, 0),
    _scale = .01,
  } = {}) {
    this.experience = new Experience();
    this.world = this.experience.activeScene.world;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;
    this.time = this.experience.time;

    this.position = _position;
    this.rotation = _rotation;
    this.scale = _scale;
    this.name = `stairs`;

    // Resource
    this.resource = this.resources.items.stairsModel;

    this.setModel();
    // if(this.debug.active) this.setDebug();
  }

  setModel() {
    this.model = SkeletonUtils.clone(this.resource.scene);

    this.model.position.copy(this.position);
    this.model.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
    this.model.scale.set(this.scale, this.scale, this.scale);
    this.model.name = this.name;

    this.world.add(this.model);
  }
  
  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: this.name,
      expanded: true,
    });

    this.debugFolder.addInput(this.model.position, "x", {
      label: "positionX",
      min: -50,
      max: 50,
      step: 0.1,
    });
    this.debugFolder.addInput(this.model.position, "y", {
      label: "positionY",
      min: -3,
      max: 3,
      step: 0.1,
    });
    this.debugFolder.addInput(this.model.position, "z", {
      label: "positionZ",
      min: -50,
      max: 50,
      step: .1,
    });
    
    this.debugFolder.addInput(this.model.rotation, "y", {
      label: "rotationY",
      min: -Math.PI,
      max: Math.PI,
      step: .1,
    });
    
    this.debugFolder.addBlade({
      view: 'slider',
      label: "scale",
      min: 0,
      max: .05,
      step: .001,
      value: this.scale,
    }).on('change', (e) => {
      this.model.scale.set(e.value, e.value, e.value);
    })
  }
}