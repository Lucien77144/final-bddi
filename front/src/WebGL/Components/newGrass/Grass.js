import * as THREE from 'three';
import vertexShader from './shaders/Grass/vertexShader.glsl';
import fragmentShader from './shaders/Grass/fragmentShader.glsl';

const BLADE_WIDTH = 0.05;
const BLADE_HEIGHT = 0.005;
const BLADE_HEIGHT_VARIATION = 0.5;
const BLADE_VERTEX_COUNT = 5;
const BLADE_TIP_OFFSET = 0.1;

export class GrassGeometry extends THREE.BufferGeometry {
  constructor(size, count) {
    super()

    const positions = [];
    const indices = [];

    const getRandomCoord = (axe) => { return (size[axe] / 2) * (Math.random() - .5) * 2 };
    for (let i = 0; i < count; i++) {
      const x = getRandomCoord('x');
      const z = getRandomCoord('z');
      
      const blade = this.computeBlade([x, 0, z], i);
      positions.push(...blade.positions)
      indices.push(...blade.indices)
    }

    this.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(new Float32Array(positions)), 3)
    );

    this.setIndex(indices)
    this.computeVertexNormals()
  }

  // Grass blade generation, covered in https://smythdesign.com/blog/stylized-grass-webgl
  // TODO: reduce vertex count, optimize & possibly move to GPU
  computeBlade(center, index = 0) {
    const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION;
    const vIndex = index * BLADE_VERTEX_COUNT;

    // Randomize blade orientation and tip angle
    const yaw = Math.random() * Math.PI * 2;
    const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)];
    const bend = Math.random() * Math.PI * 2;
    const bendVec = [Math.sin(bend), 0, -Math.cos(bend)];

    // Calc bottom, middle, and tip vertices
    const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i])
    const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i])
    const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i])
    const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i])
    const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i])

    // Attenuate height
    tl[1] += height / 2;
    tr[1] += height / 2;
    tc[1] += height;

    return {
      positions: [...bl, ...br, ...tr, ...tl, ...tc],
      indices: [
        vIndex,
        vIndex + 1,
        vIndex + 2,
        vIndex + 2,
        vIndex + 4,
        vIndex + 3,
        vIndex + 3,
        vIndex,
        vIndex + 2
      ]
    }
  }
}

class Grass extends THREE.Mesh {
  constructor(params) {
    const geometry = new GrassGeometry(params.size, params.count);
    console.log(params.displacementMap);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uDisplacement: { value: params.displacementMap },
        uSize: { value: params.size },
        uMaxBladeSize: { value: BLADE_HEIGHT + BLADE_HEIGHT_VARIATION },
        uBaseColor: { value: new THREE.Color(grassColors.baseColor) },
      },
      side: THREE.DoubleSide,
      alphaTest: 0,
      vertexShader,
      fragmentShader,
    });
    super(geometry, material);
  }

  update(time) {
    this.material.uniforms.uTime.value = time;
  };

  updateGrass(size, count) {
    // this.material.uniforms.uTime.value = 0;
    // this.geometry.dispose();
    // this.geometry = new GrassGeometry(size, count);
  }
}
export default Grass;