{//start of encapsulation
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
//Now, only access to backpack is required, while still being able to obtain value of one of cloth's instance variable
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
    wringAndMeasureACloth() {
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
        const pockets = this.#pockets;
        if (pockets.length) {
            for (var i = 0; i < pockets.length; i++) {
                if (pockets[i].isHeavy()) return pockets[i];
            }
        }
    }

    wringAndMeasureFromFirstHeavyPocket() {
        const firstPocket = this.getFirstHeavyPocket();
        let measurements:number[] = [];
        while (firstPocket.isHeavy()) {
            let wringedClothWeight = firstPocket.wringAndMeasureACloth();
            measurements.push(wringedClothWeight);
        }
        return measurements;
    }
}

const myBackPack = new Backpack(5);
//No direct access to the cloth or the pocket is required
let weightMeasurements = myBackPack.wringAndMeasureFromFirstHeavyPocket();
weightMeasurements.forEach(measurement => {
    alert("The cloth weighs: " +  measurement);
});
//firstPocket is now light;



//Data Transfer Objects - Undesirable: Active records

//Instead of implementing logic in the data transfer object itself, having another object such as an iterable
//would be more appropriate. 

class FolderDto {
    #id:number;
    #parentId:number;
    #name:string;

    constructor(id:number, parentId:number, name:string) {
        this.#id = id;
        this.#parentId = parentId;
        this.#name = name;
    }

    getId() {return this.#id};
    getParentId() {return this.#parentId};
    getName() {return this.#name};
}

class FolderIterable {
    #id:number;
    #name:string;
    #children:FolderDto[];

    constructor(folderDto:FolderDto, dataSource:FolderDto[]){
        this.#id = folderDto.getId();
        this.#name = folderDto.getName();
        this.#setChildren(dataSource);
    }

    getId() {return this.#id};
    getName() {return this.#name};
    getChildren() {return this.#children};

    #setChildren(dataSource:FolderDto[]) {
        dataSource.forEach(folder => {
            if (folder.getParentId() == this.#id){
                this.#children.push(folder);
            }
        });
    }
}

class FolderHandler {
    #source:FolderDto[];
    constructor(source:FolderDto[]) {
        this.#source = source;
    }
    getChildrenIterables = (folderIterable:FolderIterable) => {
        let children:FolderIterable[] = [];
        let childrenDto = folderIterable.getChildren();
        childrenDto.forEach(dto => {
            children.push(this.getIterableByDto(dto));
        });
        return children;
    }
    getIterableByName = (name:string) => {
        let source = this.#source;
        for (let i = 0; i < source.length; i++){
            let currentName = source[i].getName();
            if (currentName.includes(name))
                return this.getIterableByDto(source[i]);
        }
    };
    getIterableByDto = (folderDto:FolderDto) => {return new FolderIterable(folderDto, this.#source)};
}

let mockData:FolderDto[] = [
    new FolderDto(0, null, "home"),
    new FolderDto(1, 0, "documents"),
    new FolderDto(2, 0, "pictures"),
];

const dataHandler = new FolderHandler(mockData);
const homeFolderIterable = dataHandler.getIterableByName("home");
const homeChildrenFolderIterables = dataHandler.getChildrenIterables(homeFolderIterable);


}//end of encapsulation