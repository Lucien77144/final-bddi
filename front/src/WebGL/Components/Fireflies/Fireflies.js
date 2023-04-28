import Experience from "@/WebGL/Experience";
import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";

export default class Fireflies {
    constructor() {

        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;

        this.setGeometry();
        this.setMaterial();
        this.setFireflies();

        window.addEventListener('resize', () =>
        {
            // ...

            // Update fireflies
            this.firefliesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2)
        })
    }

    setGeometry() {
        this.firefliesGeometry = new THREE.BufferGeometry();
        this.firefliesCount = 100
        this.positionArray = new Float32Array(this.firefliesCount * 3)

        this.scaleArray = new Float32Array(this.firefliesCount)

        for(let i = 0; i < this.firefliesCount; i++)
        {
            this.positionArray[i * 3 + 0] = Math.random( - 7) * 20
            this.positionArray[i * 3 + 1] = Math.random() * 5
            this.positionArray[i * 3 + 2] = Math.random() * 30

            this.scaleArray[i] = Math.random()
        }

        this.firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positionArray, 3))
        this.firefliesGeometry.setAttribute('aScale', new THREE.BufferAttribute(this.scaleArray, 1))

    }

    setMaterial() {
        this.firefliesMaterial = new THREE.ShaderMaterial({
            transparent : true,
            blending : THREE.AdditiveBlending,
            depthWrite : false,
            uniforms : {
                uTime : { value : 0 },
                uPixelRatio : { value : Math.min(window.devicePixelRatio, 2) },
                uSize : { value : 100 },
            },
            vertexShader : vertexShader,
            fragmentShader : fragmentShader,
        })
    }

    setFireflies() {
        this.fireflies = new THREE.Points(this.firefliesGeometry, this.firefliesMaterial)
        this.fireflies.position.set(-10, 0, -10)
        console.log(this.fireflies);
        this.scene.add(this.fireflies)
    }

    update() {
        this.firefliesMaterial.uniforms.uTime.value = this.time.elapsed * 0.001;
    }
}