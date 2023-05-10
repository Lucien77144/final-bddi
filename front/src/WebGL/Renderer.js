import Experience from "webgl/Experience.js";
import {
  LinearFilter,
  PCFSoftShadowMap,
  RGBAFormat,
  SRGBColorSpace,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

export default class Renderer {
  constructor(_scene, _camera) {
    this.experience = new Experience();
    this.canvas = this.experience.canvas;
    this.sizes = this.experience.sizes;
    this.scene = _scene;
    this.camera = _camera;

    this.setInstance();
  }

  setInstance() {
    this.instance = new WebGLRenderer({
      canvas: this.canvas,
      powerPreference: "high-performance",
    });
    this.instance.physicallyCorrectLights = false;
    this.instance.outputColorSpace = SRGBColorSpace;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = PCFSoftShadowMap;

    this.instance.setClearColor("#34d5eb");

    console.log(this.instance);

    this.resize();
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(Math.min(this.sizes.pixelRatio, 2));
  }

  update() {
    this.fbo = new WebGLRenderTarget( 
      window.innerWidth, 
      window.innerHeight, 
      { 
        minFilter: LinearFilter, 
        magFilter: LinearFilter, 
        format: RGBAFormat, 
        stencilBuffer: false 
      } 	
    );
    this.instance.render(this.scene, this.camera.instance, this.fbo, true);
  }
}