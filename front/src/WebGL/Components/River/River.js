// import shaders
import waterVertexShader from "./shaders/vertexShader.glsl";
import waterFragmentShader from "./shaders/fragmentShader.glsl";
import Experience from "@/WebGL/Experience";
import * as THREE from "three";

export default class River {
    constructor(position) {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.time = this.experience.time;
        this.uTime = 0;
    
        // Wait for resources
        // textures 

        this.loader = new THREE.TextureLoader();

        this.noiseMap = this.loader.load("https://i.imgur.com/gPz7iPX.jpg")
        this.dudvMap = this.loader.load("https://i.imgur.com/hOIsXiZ.jpg")

        this.noiseMap.wrapS = this.noiseMap.wrapT = THREE.RepeatWrapping;
        this.noiseMap.minFilter = THREE.NearestFilter;
        this.noiseMap.magFilter = THREE.NearestFilter;
        this.dudvMap.wrapS = this.dudvMap.wrapT = THREE.RepeatWrapping;

        this.setUniforms();
        this.setMaterial();
        this.setWater(position);
    }

    setUniforms() {
        this.uniforms = {
            uTime: { value: this.uTime },
            tNoise: { value: null },
            tDudv: { value: null },
            topDarkColor : { value: new THREE.Color(0x4e7a71) },
            bottomDarkColor : { value: new THREE.Color(0x0e7562) },
            topLightColor : { value: new THREE.Color(0xb0f7e9) },
            bottomLightColor : { value: new THREE.Color(0x14c6a5) },
            foamColor : { value: new THREE.Color(0xffffff) },
            uWaveFrequency : { value: 0.5 },
            uWaveAmplitude : { value: 0.5 },
        }
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.merge([
                THREE.UniformsLib['fog'],
                this.uniforms  
            ]),
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            fog : true,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }

    setWater(position) {
        this.geometry = new THREE.PlaneGeometry(8, 16, 8, 16, 1, true)
        this.water = new THREE.Mesh(this.geometry, this.material);
        // this.water.position.set(-2, 3, 0);
        this.water.position.set(position.x, position.y, position.z);
        this.water.rotation.x = -Math.PI / 2;
        this.water.rotation.y = 0.2;
        this.water.rotation.z = 1.5

        this.scene.add(this.water);

        this.material.uniforms.tNoise.value = this.noiseMap;
        this.material.uniforms.tDudv.value = this.dudvMap;

    }

    update() {
        this.uTime = this.time.elapsed * 0.0005;
        this.material.uniforms.uTime.value = this.uTime;
    }
}
