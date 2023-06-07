const optionsButton = document.getElementById("options-button");
const helpButton = document.getElementById("help-button");
const closeButton = document.getElementsByClassName("close-button");

const backButton = document.querySelector("#back-button");
const leaveButton = document.querySelector("#leave-button");
const clueButton = document.querySelector("#clue-button");

const optionsPopup = document.querySelector(".options-popup");
const helpPopup = document.querySelector(".help-popup");

function showPopup(popup) {
  popup.classList.add("show");
}

function hidePopup(popup) {
  popup.classList.remove("show");
}

optionsButton.addEventListener("click", () => {
  showPopup(optionsPopup);
});

helpButton.addEventListener("click", () => {
  showPopup(helpPopup);
});

helpButton.addEventListener("click", () => {
  showPopup(helpPopup);
});

backButton.addEventListener("click", () => {
  location.reload();
});

leaveButton.addEventListener("click", () => {
  location.reload();
});

for (let i = 0; i < closeButton.length; i++) {
  closeButton[i].addEventListener("click", () => {
    hidePopup(closeButton[i].closest(".popup-overlay"));
  });
}

window.addEventListener("click", (event) => {
  if (event.target.classList.contains("popup-overlay")) {
    hidePopup(event.target);
  }
});
