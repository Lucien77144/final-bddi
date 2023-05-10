import Experience from "webgl/Experience.js";
import Cube from "components/Cube/Cube.js";
import Floor from "components/Floor/Floor.js";
import Environment from "components/Environment.js";
import * as THREE from "three";

export default class CubeScene {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    // Créer le shader pour le matériau de la plane
    this.vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;

    this.fragmentShader = `
    uniform float time;
    varying vec2 vUv;

    void main() {
        float progress = step(time, vUv.x);
        vec3 startColor = vec3(0.0, 1., 1.0); // Bleu
        vec3 endColor = vec3(1.0, 1.0, 1.0); // Blanc
        vec3 color = mix(startColor, endColor, progress);
        gl_FragColor = vec4(color, 1.0);
    }`;

    this.uniforms = {
        time: { value: 0.0 },
    };

    // Wait for resources
    if (this.resources.loaded == this.resources.toLoad) {
      this.buildScene();
    } else {
      this.resources.on("ready", () => {
        this.buildScene();
      });
    }
  }

  buildScene() {
    // this.cube = new Cube();
    this.environment = new Environment();
    // Créer la géométrie de la plane
    this.geometry = new THREE.PlaneGeometry(5, 5);

    

    // Créer le matériau avec le shader
    this.material = new THREE.ShaderMaterial({
        vertexShader : this.vertexShader,
        fragmentShader : this.fragmentShader,
        uniforms : this.uniforms,
        // side: THREE.DoubleSide,
    });

    // Créer la plane
    this.plane = new THREE.Mesh(this.geometry, this.material);
    // rotate 45deg
    this.plane.rotation.y = Math.PI / 2;
    this.scene.add(this.plane);
}

  update() {

    this.uniforms.time.value += 0.02;
  }
}
