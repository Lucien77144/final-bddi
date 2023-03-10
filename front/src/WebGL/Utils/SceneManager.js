import config from "scenes/config";
import Experience from "webgl/Experience.js";

export default class SceneManager {
  constructor(
    _sceneName = "main",
  ) {
    this.experience = new Experience();
    this.debug = this.experience.debug;
    this.scenes = config;

    //lowercase the keys
    for (let key in this.scenes) {
      this.scenes[key.toLowerCase()] = this.scenes[key];
    }

    // get url params
    this.urlParams = new URLSearchParams(window.location.search);
    if(this.urlParams.get("scene")) {
      this.sceneName = this.urlParams.get("scene").toLowerCase();
    } else {
      this.sceneName = _sceneName;
    }

    if (this.debug.active) this.setDebug();

    // create scene
    return new this.scenes[this.sceneName]();
  }

  setDebug() {
    this.debugFolder = this.debug.ui.addFolder({
      title: "Scene Manager",
      expanded: true,
    });
    this.debugFolder
      .addBlade({
        view: "list",
        label: "scene",
        options: Object.keys(this.scenes).map((key) => {
          return { text: key, value: key };
        }),
        value: this.sceneName,
      })
      .on("change", ({ value }) => {
        this.experience.switchScene(value);
      });
  }
}