import * as THREE from "three";
import Experience from "webgl/Experience.js";

export default class Water {
  constructor(width, height, density, strength) {
    // Initialisation des propriétés
    this.width = width || 10;
    this.height = height || 10;
    this.density = density || 20;
    this.strength = strength || 1;

    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.scene = this.experience.scene;

    // Création de la géométrie de l'eau
    this.geometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.density,
      this.density
    );

    // Création du matériel de l'eau
    // this.material = new THREE.ShaderMaterial({
    //   uniforms: {
    //     time: { value: 0 },
    //     resolution: { value: new THREE.Vector2() },
    //     strength: { value: this.strength },
    //     textureWater: {
    //       value: new THREE.TextureLoader().load(
    //         this.resources.items.waterTexture
    //       ),
    //     },
    //   },
    //   vertexShader: `
    //     uniform float time;
    //     uniform float strength;
    //     uniform vec2 resolution;
    //     varying vec2 vUv;

    //     void main() {
    //       vUv = uv;

    //       vec3 newPosition = position;
    //       float distance = length(uv - 0.5);
    //       float amplitude = 1.0 - distance * distance;
    //       amplitude *= sin(time * 3.0 + position.x * 0.5);
    //       newPosition.z += amplitude * strength;

    //       gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    //     }
    //   `,
    //   fragmentShader: `
    //     uniform sampler2D textureWater;
    //     varying vec2 vUv;

    //     void main() {
    //       vec4 color = texture(textureWater, vUv);
    //       gl_FragColor = color;
    //     }
    //   `,
    // });

    this.material = new THREE.MeshBasicMaterial({
      color: 0xff0000, // red
      side: THREE.DoubleSide, // render both front and back faces of the geometry
    });

    // Création du mesh de l'eau
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 4, 0);
    this.scene.add(this.mesh);
  }

  update() {
    // Mise à jour de l'uniforme time
    // this.material.uniforms.time.value = this.time;

    // Mise à jour de l'uniforme resolution
    // const resolution = new THREE.Vector2(window.innerWidth, window.innerHeight);
    // this.material.uniforms.resolution.value.copy(resolution);
  }
}
