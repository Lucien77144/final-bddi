import Experience from "@/WebGL/Experience";
import * as THREE from "three";
import OutlineModule from "@/WebGL/Utils/OutlineModule";
import { TweenMax, Power4 } from "gsap";

export default class Letter {
  constructor(_position = new THREE.Vector3(0, 0, 0)) {
    this.experience = new Experience();
    this.resources = this.experience.resources;
    this.resource = this.resources.items.letterModel;
    this.scene = this.experience.scene;
    this.outlineModule = new OutlineModule();

    this.position = _position;

    this.setModel();
    this.setAnimation();
    this.animationStarted = false;

    this.letterIcon = document.querySelector(".letter-icon");
    console.log(this.letterIcon);
    this.letterIcon.addEventListener("click", () => {
      this.showLetter();
    });
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.position.copy(this.position);
    this.model.rotation.y = Math.PI / 4;
    this.model.scale.set(0.5, 0.5, 0.5);
    this.model.name = "letter";
    this.model.interactive = true;
    this.scene.add(this.model);
    this.model.children.forEach((child) => {
      child.interactive = true;
      child.type = "letter";
    });
  }

  showContentDiv() {
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("letter-container");

    contentDiv.innerHTML = `
      <p style="opacity: 0;">
          Cher ami,<br><br>
          Je vous écris cette lettre pour partager avec vous quelques mots de Lorem Ipsum. Voici un paragraphe de texte aléatoire généré pour illustrer l'apparence d'une lettre. J'espère que vous apprécierez la simplicité et la beauté du Lorem Ipsum.<br><br>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed accumsan varius aliquet. Nunc commodo eleifend eros, ac sagittis ipsum laoreet ac. Integer rhoncus tellus vel tincidunt pretium. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nunc feugiat nisl id scelerisque commodo. Nulla pharetra felis ut urna rutrum fringilla.<br><br>
          Sincèrement,<br>
          Votre ami
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

  showLetter() {
    const letter = this.scene.getObjectByName("letter");
    console.log(letter);
    letter.visible = true;
    this.showContentDiv();
    this.experience.outlineModule.onLetter = true;
  }

  update() {
    if (!this.outlineModule.onLetter) {
      const contentDiv = document.querySelector(".letter-container");
      if (contentDiv && contentDiv.style.display != "none") {
        contentDiv.style.display = "none";
      }
    }

    if (
      this.outlineModule.isLetterAnimationFinished &&
      !this.animationStarted
    ) {
      this.startAnimation();
    }

    this.animation?.mixer.update(this.experience.time.delta * 1);
  }
}
