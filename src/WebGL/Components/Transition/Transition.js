import Experience from "@/WebGL/Experience";

export default class Transition {
  constructor() {
    this.experience = new Experience();
    this.resources = this.experience.resources;

    this.TransitionTextures = this.resources.items.transition;
    console.log(this.resources.items);
  }
}
