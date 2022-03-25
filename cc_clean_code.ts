{
//Data Abstraction
interface GradeRecord {
    getGpa(semester:number):number;
    appendGpa(newGpa:number):void;
    getCgpa(semester:number):number;
    getLatestCgpa():number;
}

//Data/Object Anti-Symmetry
//This section explains that both procedural code and OO code have their uses. Neither is bad nor good.
//Below is an example of a situation that calls for procedural code use
class HTMLContainer {
    mainElement: Node;
    children: Node[];
}

class UListContainer extends HTMLContainer {
    constructor(children: HTMLLIElement[]) {
        super();
        this.mainElement = document.createElement("ul");
        this.children = children;
    }
    showChildren () {
        this.children.forEach(element => {
            this.mainElement.appendChild(element);
        });
    }
    hideChildren () {
        while (this.mainElement.hasChildNodes()) {
            this.mainElement.removeChild(this.mainElement.firstChild);
        }
    }
}

class NestedUListContainer extends HTMLContainer {
    list: HTMLUListElement;
    constructor(children: HTMLLIElement[]) {
        super();
        this.mainElement = document.createElement("li");
        this.children = children;

        this.mainElement.appendChild(
            this.list = document.createElement("ul")
        );
    }
    showChildren () {
        this.children.forEach(element => {
            this.list.appendChild(element);
        });
    }
    hideChildren () {
        while (this.list.hasChildNodes()) {
            this.list.removeChild(this.list.firstChild);
        }
    }
}

//The Law of Demeter
let mainForm = document.querySelector("#MainForm");
let nameFieldContainer = mainForm.querySelector("user-name");
let name = nameFieldContainer.querySelector("value").innerHTML;

//Hybrids - Now, all the instance variables are private, i.e. can only be accessed through instance functions
const stick = {label: "Stick", maxUses: 500, maxPower: 5};
class StickWeapon {
    #type = stick;
    #uses: number;
    #power: number;
    #label: string;
    
    constructor() {
        let type = this.#type;

        this.#uses = Math.round(Math.max(type.maxUses/5, type.maxUses*Math.random()));
        this.#power = Math.round(Math.max(type.maxPower/5, type.maxPower*Math.random()));
        this.#label = `${type.label} Lvl ${this.#power}`;
    }
    use = () => {
        if (this.#uses) this.#uses--;
        else return false;
        return true;
    }
    refillUses = () => {
        this.#uses = this.#type.maxUses;
    }
}

class RefillStation {
    refillUses(weapon: StickWeapon) {
        weapon.refillUses();
    }
}

let station = new RefillStation();
let someStick = new StickWeapon();

while (someStick.use()) {
    //The stick is being used
}

station.refillUses(someStick);
//The stick has been refreshed


//Hiding Structure
//Now, only access to backpack and pocket is required, while still being able to obtain value of one of cloth's instance variable
class Cloth {
    #weight: number = 100;

    wring() { this.#weight /= 2; }
    getWeight() { return this.#weight; };
}
class Pocket {
    #content: Cloth[];

    constructor() {
        let randomAmount = Math.random() * 10;
        while (this.#content.length < randomAmount)
            this.#content.push(new Cloth());
    }

    extractCloth() { return this.#content.pop(); };
    insertCloth(cloth: Cloth) { this.#content.push(cloth); };
    getWeight() {
        let weight = 0;
        this.#content.forEach(cloth => {
            weight += cloth.getWeight();
        });
        return weight;
    }
    isHeavy() {
        return this.getWeight() > 100;
    }
    wringAndMeasureCloth() {
        const currentCloth = this.extractCloth();
        currentCloth.wring();
        const clothWeight = currentCloth.getWeight();
        this.insertCloth(currentCloth);
        return clothWeight;
    }
}
class Backpack {
    #pockets: Pocket[] = [];

    constructor(numPockets: number) {
        while (this.#pockets.length < numPockets)
            this.#pockets.push(new Pocket());
    }

    getFirstHeavyPocket() {
        if (this.#pockets.length) {
            for (var i = 0; i < this.#pockets.length; i++) {
                if (this.#pockets[i].isHeavy()) return this.#pockets[i];
            }
        }
    }
}

const myBackPack = new Backpack(5);
let firstPocket = myBackPack.getFirstHeavyPocket();
//No direct access to the cloth is required
while (firstPocket.isHeavy()) {
    let wringedClothWeight = firstPocket.wringAndMeasureCloth();
    alert("Current cloth has weight: " + wringedClothWeight);
}
//firstPocket is now light;

}