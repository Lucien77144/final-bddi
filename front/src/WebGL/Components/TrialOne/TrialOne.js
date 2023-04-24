import Experience from "@/WebGL/Experience";
import Symbols from "./Symbols";


export default class TrialOne {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.debug = this.experience.debug;

    this.playerCombination = [];
    this.trueCombination = [];

    this.symbols = Symbols;

    this.setCombination();
    this.getSymbols();

  }

  setCombination() {
    // get 4 random symbols
    for (let i = 0; i < 4; i++) {
        const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
        // check if the symbol is already in the array
        if (this.trueCombination.includes(randomSymbol)) {
            // if so, get a new symbol
            i--;
            continue;
        } else {
            this.trueCombination.push(randomSymbol);
        }
    }
    console.log(this.trueCombination);
  }
    
  getSymbols() {
    // get gameboard-items from document
    this.combinationItems = document.querySelectorAll(".combination-item");
    this.gameboardItems = document.querySelectorAll(".gameboard-item");
    console.log(this.gameboardItems);
    // add click listener to each gameboard-item
    this.gameboardItems.forEach((item) => {
        // check if the item has used class
        item.addEventListener("click", () => {
            if(!item.classList.contains("used")) {
                this.addSymbol(item);
            }
        });
    });
  }

  addSymbol(item) {
    // get the id of the clicked item
    const id = item.getAttribute("data-id");
    // get the symbol with the same id
    const symbol = Symbols.find((symbol) => symbol.id == id);
    // console.log(item);
    // add the symbol to the playerCombination array
    this.playerCombination.push(symbol);
    
    // remove the listener from the item & add the class "used"
    item.removeEventListener("click", () => {});
    item.classList.add("used");
    // console.log(this.playerCombination);
    // add the symbol to the combination-items
    let combinated = false;
    this.combinationItems.forEach((item) => {
        // check if data-id is empty
        if (!combinated && item.getAttribute("data-id") == "") {
            // add the symbol to the item
            item.setAttribute("data-id", symbol.id);
            item.setAttribute("data-name", symbol.name);
            // add the symbol to the combination-items
            combinated = true;
            item.innerText = symbol.name;
            console.log(item);
            // stop the loop
            return;
        } else {
            return;
        }
    });
    this.playerCombination.length == 4 && (this.checkCombination() ? this.winTrial() : this.resetCombination());
    }

    checkCombination() {
        // check if the playerCombination is the same as the trueCombination
        let correct = true;
        for (let i = 0; i < this.playerCombination.length; i++) {
            if (this.playerCombination[i].id != this.trueCombination[i].id) {
                correct = false;
                return correct;
            }
        }
        return correct;
    }

    resetCombination() {
        // reset the playerCombination array
        this.playerCombination = [];
        // reset the combination-items
        this.combinationItems.forEach((item) => {
            item.setAttribute("data-id", "");
            item.setAttribute("data-name", "");
            item.innerText = "";
        });
        // reset the gameboard-items
        this.gameboardItems.forEach((item) => {
            item.classList.remove("used");
            
        });
    }

    winTrial() {
        // add display none style to the trial 
        document.querySelector(".trial-one").style.display = "none";
        // destroy this class
        this.destroy();
    }

    destroy() {
        // remove the event listeners
        this.gameboardItems.forEach((item) => {
            item.removeEventListener("click", () => {});
        });

    }
   
}