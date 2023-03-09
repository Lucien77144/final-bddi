import Experience from "../Experience.js";
import Cube from "components/Cube/Cube.js";
import Sizes from "../Utils/Sizes.js";
import * as THREE from "three";
import Time from "../Utils/Time.js";
import fairyDustVertexShader from "../Shaders/fairyDust/vertex.glsl";
import fairyDustFragmentShader from "../Shaders/fairyDust/fragment.glsl";

export default class Main {
  constructor() {
    this.experience = new Experience();
    this.time = new Time();
    this.sizes = new Sizes();
    this.camera = this.experience.camera.instance;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      // Setup
      this.cube = new Cube();

      this.positions = this.setPosition(new Float32Array(this.nbPoints * 3));

      window.addEventListener("mousemove", (event) => {
        this.handleMouseMove(event);
      });

      this.cube.mesh.scale.set(0.2, 0.2, 0.2);
    });
    this.cursor = {};
    this.cursor.x = 0;
    this.cursor.y = 0;
    this.cursor.z = 0.8;

    this.nbPoints = 500;

    this.elapsedTime = this.time.elapsed;

    this.particles = new THREE.Group();
    this.scene.add(this.particles);

    this.particlesMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader: fairyDustVertexShader,
      fragmentShader: fairyDustFragmentShader,
    });
  }

  handleMouseMove(event) {
    this.cursor.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.cursor.y = -(event.clientY / this.sizes.height) * 2 + 1;
    this.cursor.z = 1;

    var vector = new THREE.Vector3(this.cursor.x, this.cursor.y, 0.5);
    vector.unproject(this.camera);
    var dir = vector.sub(this.camera.position).normalize();
    var distance = -this.camera.position.z / dir.z;
    var pos = this.camera.position.clone().add(dir.multiplyScalar(distance));

    this.cursor = pos;
  }

  isCubeMoving() {
    if (this.cube) {
      if (
        Math.floor(this.positions[this.positions.length - 3] * 1000) ===
        Math.floor(this.cursor.x * 1000)
      ) {
        return false;
      } else {
        return true;
      }
    }
  }

  addParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 10;

    const posArray = new Float32Array(particlesCnt * 3);
    const scaleArray = new Float32Array(particlesCnt);
    this.lifeArray = new Float32Array(particlesCnt);

    const radius = Math.random() * 2;

    for (let i = 0; i < particlesCnt; i++) {
      posArray[i * 3 + 0] =
        this.positions[this.positions.length - 3] -
        Math.pow(Math.random(), 5) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.2 *
          radius;
      posArray[i * 3 + 1] = this.positions[this.positions.length - 2];

      posArray[i * 3 + 2] =
        this.positions[this.positions.length - 1] +
        Math.pow(Math.random(), 5) *
          (Math.random() < 0.5 ? 1 : -1) *
          0.2 *
          radius;

      scaleArray[i] = Math.random();

      this.lifeArray[i] = this.time.elapsed;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    particlesGeometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );

    particlesGeometry.setAttribute(
      "life",
      new THREE.BufferAttribute(this.lifeArray, 1)
    );

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      this.particlesMaterial
    );

    particlesMesh.life = 0;

    this.particles.add(particlesMesh);
  }

  updateParticles() {
    this.particles.children.forEach((el, cur) => {
      //console.log(el.geometry.attributes);
      if (el.life > 50) {
        const object = this.particles.children[cur];

        object.geometry.dispose();
        this.particles.remove(object);
      } else {
        el.life++;
      }
    });
  }

  setPosition(array) {
    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;

      const x = (i / (this.nbPoints - 1) - 0.5) * 3;
      const y = Math.sin(i / 50.5) * 0.5;

      array[i3] = x;
      array[i3 + 1] = y;
      array[i3 + 2] = 1;
    }
    return array;
  }

  updatePosition() {
    for (let i = 0; i < this.nbPoints; i++) {
      const i3 = i * 3;
      const previous = (i - 1) * 3;

      if (i3 === 0) {
        this.positions[0] = this.cursor.x;
        this.positions[1] = this.cursor.y + 0.05;
        this.positions[2] = this.cursor.z;
      } else {
        const currentPoint = new THREE.Vector3(
          this.positions[i3],
          this.positions[i3 + 1],
          this.positions[i3 + 2]
        );

        const previousPoint = new THREE.Vector3(
          this.positions[previous],
          this.positions[previous + 1],
          this.positions[previous + 2]
        );

        this.lerpPoint = currentPoint.lerp(previousPoint, 0.9);

        this.positions[i3] = this.lerpPoint.x;
        this.positions[i3 + 1] = this.lerpPoint.y;
        this.positions[i3 + 2] = this.cursor.z;
      }

      this.cube.mesh.position.set(
        this.positions[i3],
        this.positions[i3 + 1],
        this.positions[i3 + 2]
      );
    }
  }

  update() {
    if (this.particlesMaterial) {
      //console.log(this.particlesMaterial.uniforms.uTime.value);
      this.particlesMaterial.uniforms.uTime.value = this.time.elapsed;
    }

    if (this.positions) {
      this.updatePosition();

      if (Math.floor(this.time.elapsed / 50) != this.timeElapsed) {
        this.timeElapsed = Math.floor(this.time.elapsed / 50);

        //console.log(this.timeElapsed);

        if (this.isCubeMoving()) {
          this.addParticles();
        }

        this.updateParticles();
      }
    }
  }
}
