import * as THREE from 'three';
import vertexShader from './shaders/vertexShader.glsl';
import fragmentShader from './shaders/fragmentShader.glsl';

const BLADE_WIDTH = 0.05
const BLADE_HEIGHT = 0.005
const BLADE_HEIGHT_VARIATION = 0.5
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.1

let grassColors = {
  color1: '#0a9044',
  color2: '#0ca855',
  color3: '#148538',
  color4: '#15293b',
  color5: '#348bd9',
  baseColor: '#11382a',
}

function interpolate(val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}

export class GrassGeometry extends THREE.BufferGeometry {
  constructor(size, count, brushPos, limits) {
    super()

    const positions = []
    const uvs = []
    const indices = []

    for (let i = 0; i < count; i++) {
      const surfaceMin = (size / 2) * -1
      const surfaceMax = size / 2
      const radius = (size / 2) * Math.random()
      const theta = Math.random() * 2 * Math.PI

      const x = radius * Math.cos(theta);
      const z = radius * Math.sin(theta);
      const convPos = {
        x: brushPos.x + x,
        y: brushPos.y,
        z: brushPos.z + z,
      }

      const blendLimits = this.buildBlendLimits(convPos, limits);
      
      if (this.getSquareLimits(convPos, limits) && blendLimits) {
        uvs.push(
          ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
            interpolate(blendLimits.x - brushPos.x, surfaceMin, surfaceMax, 0, 1),
            interpolate(blendLimits.z - brushPos.z, surfaceMin, surfaceMax, 0, 1)
          ])
        )
  
        const blade = this.computeBlade([x, 0, z], i);
        positions.push(...blade.positions)
        indices.push(...blade.indices)
      }
    }

    this.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(new Float32Array(positions)), 3)
    )
    this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    this.setIndex(indices)
    this.computeVertexNormals()
  }

  getSquareLimits(pos, limit) {
    return pos.x > limit.min.x && pos.x < limit.max.x && pos.z > limit.min.z && pos.z < limit.max.z;
  }

  buildBlendLimits(pos, limits) {
    const squareSize = {
      x: limits.max.x - limits.min.x,
      z: limits.max.z - limits.min.z,
    }

    let result = {
      status: false,
      pos: { ...pos },
    };

    const getOffset = (o, e) => {
      const factor = squareSize[o.axe] / 100 * (o.dir == 'min' ? -1 : 1);
      return {
        start: factor * e.offset_start,
        end: factor * e.offset_end,
      };
    }

    Object.entries(limits.params)
      .filter(([_, { offset_start }]) => (offset_start > 0))
      .forEach((e) => {
        const o = {
          axe: (e[0] == 'right' || e[0] == 'left') ? 'z' : 'x',
          dir: (e[0] == 'right' || e[0] == 'top') ? 'min' : 'max',
        }

        const offset = getOffset(o, e[1]);

        const limit = limits[o.dir][o.axe];
        const newPos = pos[o.axe] + offset.start;

        result.status = result.status ? result.status : !(o.dir == 'min' ? newPos > limit : !(newPos > limit));
        result.status = result.status && !(pos.y > e[1].y);
      })
    return !result.status ? result.pos : false;
  }

  // Grass blade generation, covered in https://smythdesign.com/blog/stylized-grass-webgl
  // TODO: reduce vertex count, optimize & possibly move to GPU
  computeBlade(center, index = 0) {
    const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION
    const vIndex = index * BLADE_VERTEX_COUNT

    // Randomize blade orientation and tip angle
    const yaw = Math.random() * Math.PI * 2
    const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)]
    const bend = Math.random() * Math.PI * 2
    const bendVec = [Math.sin(bend), 0, -Math.cos(bend)]

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

const cloudTexture = new THREE.TextureLoader().load('/img/cloud.jpg')
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping

class Grass extends THREE.Mesh {
  constructor(mesh, grassSize, count, pos, limits) {

    const brushPos = new THREE.Vector3(pos.x * mesh.scale.x, pos.y * mesh.scale.y, pos.z * mesh.scale.z);
    
    const geometry = new GrassGeometry(grassSize, count, brushPos, limits);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorScale: { value: Math.floor(Math.random()*10)/10 },
        uColor1: { value: new THREE.Color(grassColors.color1) },
        uColor2: { value: new THREE.Color(grassColors.color2) },
        uColor3: { value: new THREE.Color(grassColors.color3) },
        uColor4: { value: new THREE.Color(grassColors.color4) },
        uColor5: { value: new THREE.Color(grassColors.color5) },
        uBaseColor: { value: new THREE.Color(grassColors.baseColor) },
      },
      side: THREE.DoubleSide,
      alphaTest: 0,
      vertexShader,
      fragmentShader,
    });
    super(geometry, material);

    this.position.copy(brushPos);
  }

  update(time) {
    this.material.uniforms.uTime.value = time;
  };

  updateGrass(size, count) {
    this.material.uniforms.uTime.value = 0;
    this.geometry.dispose();
    this.geometry = new GrassGeometry(size, count);
  }
}

export default Grass