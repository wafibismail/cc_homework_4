{//Start of chapter 6 - Objects and Data Structures
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



//Data Transfer Objects - Logic for active records

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
    #childDtos:FolderDto[];
    #handler:FolderHandler;

    constructor(folderDto:FolderDto, handlerData:{handler:FolderHandler, dataSource:FolderDto[]}){
        this.#id = folderDto.getId();
        this.#name = folderDto.getName();
        this.#setChildDtos(handlerData.dataSource);
        this.#handler = handlerData.handler;
    }

    getId() {return this.#id};
    getName() {return this.#name};
    getChildren() {return this.#handler.getIterablesByDtoArray(this.#childDtos)};

    #setChildDtos(dataSource:FolderDto[]) {
        dataSource.forEach(folder => {
            if (folder.getParentId() == this.#id){
                this.#childDtos.push(folder);
            }
        });
    }
}

class FolderHandler {
    #source:FolderDto[];
    constructor(source:FolderDto[]) {
        this.#source = source;
    }
    getIterablesByDtoArray = (childrenDtos:FolderDto[]) => {
        let children:FolderIterable[] = [];
        childrenDtos.forEach(dto => {
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
    getIterableByDto = (folderDto:FolderDto) => {
        let handlerData = {handler:this, dataSource:this.#source}
        return new FolderIterable(folderDto, handlerData)
    };
}

let mockData:FolderDto[] = [
    new FolderDto(0, null, "home"),
    new FolderDto(1, 0, "documents"),
    new FolderDto(2, 0, "pictures"),
    new FolderDto(3, 1, "drafts"),
];

function traverseAndDisplayNames(folderIterable:FolderIterable) {
    folderIterable.getChildren().forEach(child => {
        console.log(`Inside ${folderIterable.getName()} is another folder named ${child.getName()}`);
        traverseAndDisplayNames(child);
    });
}

const dataHandler = new FolderHandler(mockData);
const home = dataHandler.getIterableByName("home");

traverseAndDisplayNames(home);
//all folders including deep-nested subfolders will be displayed by name

}//End of chapter 6 - Objects and Data Structures


{//Start of chapter 7 - Error Handling
//Use exceptions rather than return codes - will get back to this later

}//End of chapter 7 - Error Handling


{//Start of chapter 8 - Boundaries
//Encapsulating interfaces
class UserNamesStorage {
    #names = {};//Imagine that instead of a regular JavaScript object, this extends a Map-like implementation from an external library
    getById(id:string) {
        this.#validateId(id);
        return this.#names[id];
    }
    setIdNamePair(id:string, name:string) {
        this.#validateId(id);
        this.#names[id] = name;
    }
    #validateId(id:string) {
        if (id.length != 5 || isNaN(Number(id))) {
            throw Error("Invalid id; Must be 5 digit string");
        }
    }

}
let storageForUserNames = new UserNamesStorage;
storageForUserNames.setIdNamePair('00001',"Fluffy");
storageForUserNames.setIdNamePair('00002',"Tom");
storageForUserNames.setIdNamePair('BAX8080',"20 seater bus"); //should throw an error.
console.log(storageForUserNames.getById('00001'));
}//End of chapter 8 - Boundaries