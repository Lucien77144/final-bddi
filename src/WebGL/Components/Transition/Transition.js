import Experience from "@/WebGL/Experience";
import { MathUtils, Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial } from "three";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";

export default class Transition {
  constructor(_sceneA, _sceneB) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.renderer = this.experience.renderer;
    this.time = this.experience.time;

    this.transitionParams = {
      useTexture: true,
      transition: .5,
      transitionSpeed: 2,
      texture: 5,
      loopTexture: true,
      animateTransition: true,
      textureThreshold: .3
    };

    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;

    // Link both scenes and their FBOs
    this.sceneA = _sceneA;
    this.sceneB = _sceneB;

    this.setGeometry();
    this.setMaterial();
    this.setMesh();
    this.changeCamera();
  }

  setGeometry() {
    this.geometry = new PlaneGeometry(this.sizes.width, this.sizes.height);
  }

  setMaterial() {
    this.material = new ShaderMaterial({
		uniforms: {
			tDiffuse1: { value: this.sceneA.fbo },
			tDiffuse2: { value: this.sceneB.fbo },
			mixRatio: { value: 0 },
			threshold: { value: .1 },
			useTexture: { value: 1 },
			tMixTexture: { value: this.resources.items.transition }
		},
		vertexShader,
		fragmentShader
	});
  }

  setMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(
      0,
      0,
      0,
    );
    this.mesh.name = "transition";
    this.scene.add(this.mesh);
  }

  changeCamera() {
    const oldCamera = this.renderer.camera.instance;

    this.renderer.camera.instance = new OrthographicCamera(
        this.sizes.width / -2,
        this.sizes.width / 2,
        this.sizes.height / 2,
        this.sizes.height / -2,
        -10,
        10
    );

    setTimeout(() => {
      this.experience.camera.instance = oldCamera;
      this.scene.remove(this.mesh);
    }, 2000);
  }
	
	render() {
    console.log(this.time);

		if (this.transitionParams.animateTransition)
		{
			const varT = (1 + Math.sin(this.transitionParams.transitionSpeed * this.time.elapsed / Math.PI)) /2;
			this.transitionParams.transition = MathUtils.smoothstep(varT, .3, .7);
      console.log(this.transitionParams.transition);
		}
		
		this.material.uniforms.mixRatio.value = this.transitionParams.transition;

		// Prevent render both scenes when it's not necessary
		if (this.transitionParams.transition == 0) {
			this.sceneB.render( this.time.delta, false );
		} else if (this.transitionParams.transition == 1) {
			this.sceneA.render( this.time.delta, false );
		} else {
			// When 0<transition<1 render transition between two scenes
			this.sceneA.render( this.time.delta, true );
			this.sceneB.render( this.time.delta, true );
			renderer.render( this.scene, this.cameraOrtho, null, true );
		}
	}
}
