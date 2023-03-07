import Experience from "@/WebGL/Experience";
import { Mesh, OrthographicCamera, PlaneGeometry, ShaderMaterial } from "three";
import fragmentShader from "./fragmentShader.frag";
import vertexShader from "./vertexShader.vert";

export default class Transition {
  constructor(_sceneA, _sceneB) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;

    // Link both scenes and their FBOs
    this.sceneA = _sceneA;
    this.sceneB = _sceneB;

    console.log(this.sceneA);
    console.log(this.sceneB);

    this.needChange = false;

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
    // this.scene.add(this.mesh);
  }

  changeCamera() {
    const oldCamera = this.experience.camera.instance;
    console.log('change camera');

    this.experience.camera.instance = new OrthographicCamera(
        this.sizes.width / -2,
        this.sizes.width / 2,
        this.sizes.height / 2,
        this.sizes.height / -2,
        -10,
        10
    );
    this.experience.camera.instance.position.copy(oldCamera.position);
    this.experience.camera.instance.rotation.copy(oldCamera.rotation);
    
    setTimeout(() => {
      this.experience.camera.instance = oldCamera;
    }, 2000);
  }
}
