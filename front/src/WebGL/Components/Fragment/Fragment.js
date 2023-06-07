import Experience from "@/WebGL/Experience";
import * as THREE from "three";
import OutlineModule from "@/WebGL/Utils/OutlineModule";

export default class Fragment {
  constructor(_position = new THREE.Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.resource = this.resources.items.fragmentModel;
    this.scene = this.experience.scene;
    this.outlineModule = new OutlineModule();

    this.position = _position;

    this.setModel();
    // this.setAnimation();
    this.animationStarted = false;
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.position.copy(this.position);
    this.model.rotation.set(Math.PI / 2, Math.PI / 2, 0)
    this.model.scale.set(0.3, 0.3, 0.3);
    this.model.name = "fragment";
    this.model.interactive = true;
    this.scene.add(this.model);
    this.model.children.forEach((child) => {
      child.interactive = true;
      child.type = "fragment";
    });
  }

  showContentDiv() {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("fragment-container");

    contentDiv.innerHTML = `
      <p style="opacity: 0;">
      Urma,
      <br><br><br>
      Tu te demandes certainement où je suis en ce moment, n’est-ce pas ?
      <br><br>
      Ne t’inquiètes pas, tu vas bientôt pouvoir me revoir.
      <br><br>
      Pour cela, il faut que tu réussisses à traverser cette forêt. Je t’attends au bout de celle-ci, mais pour la traverser tu vas avoir besoin de Hada pour résoudre des énigmes. Soyez bien attentifs à ce qui vous entoure, et surtout éveillez tous vos sens pour comprendre et apprécier l’art. Je t’en ai déjà parlé quand tu étais petit, mais tu auras sûrement plus de réponses au cours de ta quête.
      <br><br><br>
      Ta maman
      </p>
    `;

    document.body.appendChild(contentDiv);

    const paragraph = contentDiv.querySelector("p");
    TweenMax.to(paragraph, 7, { opacity: 1, ease: Power4.easeOut });
  }

  setAnimation() {
    // const ropeClip = this.resource.animations[0];
    const letterClip = this.resource.animations[0];

    this.animation = {
      mixer: new THREE.AnimationMixer(this.model),
      actions: {
        // rope: null,
        letter: null,
      },
    };

    // this.animation.actions.rope = this.animation.mixer.clipAction(ropeClip);
    this.animation.actions.letter = this.animation.mixer.clipAction(letterClip);
    this.animation.actions.current = this.animation.actions.letter;
    this.animation.actions.current.setLoop(THREE.LoopOnce);
    this.animation.actions.current.timeScale = 0.0005;

    this.animation.actions.current.clampWhenFinished = true;

    this.animation.mixer.addEventListener("finished", () => {
      this.showContentDiv();
    });
  }

  startAnimation() {
    this.animation.actions.current.stop();
    this.animation.actions.current.play();
    this.animationStarted = true;
  }

  update() {
    // if (!this.outlineModule.onLetter) {
    //   const contentDiv = document.querySelector(".letter-container");
    //   if (contentDiv && contentDiv.style.display != "none") {
    //     contentDiv.style.display = "none";
    //   }
    // }

    // if (
    //   this.outlineModule.isLetterAnimationFinished &&
    //   !this.animationStarted
    // ) {
    //   this.startAnimation();
    // }

    // this.animation?.mixer.update(this.experience.time.delta * 1);
  }
}
