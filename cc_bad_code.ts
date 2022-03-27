{//Start of chapter 6 - Objects and Data Structures
//Data Abstraction
class GradeRecord {
    gpa: number[];
}

//Data/Object Anti-Symmetry
//This section explains that both procedural code and OO code have their uses. Neither is bad nor good.
//Below is an example of a situation that calls for procedural code use
interface HTMLContainer {
    mainElement: Node;
    children: Node[];
}
class DivContainer implements HTMLContainer {
    mainElement: HTMLDivElement;
    children: HTMLDivElement[];
}
class UListContainer implements HTMLContainer {
    mainElement: HTMLUListElement;
    children: HTMLLIElement[];
}
class OListContainer implements HTMLContainer {
    mainElement: HTMLOListElement;
    children: HTMLLIElement[];
}
class NestedUListContainer implements HTMLContainer {
    mainElement: HTMLLIElement;
    children: HTMLLIElement[];
}
class NestedOListContainer implements HTMLContainer {
    mainElement: HTMLLIElement;
    children: HTMLLIElement[];
}
class DOM_Handler {
    showChildren(htmlContainer: HTMLContainer) {
        let node = htmlContainer.mainElement;
        let children = htmlContainer.children;
        
        if (typeof htmlContainer === typeof NestedUListContainer) {
            let list =
                node.hasChildNodes() ?
                    node.firstChild :
                    (document.createElement("ul"));
            node.appendChild(list);

            for (const child of children) {
                list.appendChild(child);
            }
        }
        else if (typeof htmlContainer === typeof NestedOListContainer) {
            let list =
                node.hasChildNodes() ?
                    node.firstChild :
                    document.createElement("ol");
            node.appendChild(list);

            for (const child of children) {
                list.appendChild(child);
            }
        }
        else  {
            for (const child of children) {
                node.appendChild(child);
            }
        }
    }
}

//The Law of Demeter
let name:string = document.querySelector("#MainForm").getElementsByClassName("user-name")[0].querySelector("value").innerHTML;

//Hybrids - data structure object should be avoided.
//Currently StickWeapon has public instance variables modifiable via its functions as well as externally.
const stick = {label: "Stick", maxUses: 500, maxPower: 5};
class StickWeapon {
    type = stick;
    uses: number;
    power: number;
    label: string;
    
    constructor() {
        let type = this.type;

        this.uses = Math.round(Math.max(type.maxUses/5, type.maxUses*Math.random()));
        this.power = Math.round(Math.max(type.maxPower/5, type.maxPower*Math.random()));
        this.label = `${type.label} Lvl ${this.power}`;
    }
    use = () => {
        if (this.uses) this.uses--;
        else return false;
        return true;
    }
}

class RefillStation {
    refillUses(weapon: StickWeapon) {
        weapon.uses = weapon.type.maxUses;
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
//In this case, the external function has to access the backpack, pocket, and cloth in order to
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
}

const myBackPack = new Backpack(5);
let firstPocket = myBackPack.getFirstHeavyPocket();
while (firstPocket.isHeavy()) {
    let currentCloth = firstPocket.extractCloth();
    currentCloth.wring();
    alert("Current cloth has weight: " + currentCloth.getWeight());
    firstPocket.insertCloth(currentCloth);
}
//firstPocket is now light;



//Data Transfer Objects - Undesirable: storing logic within active records

//Assuming Folder is a record with properties id, parentId and name,
//a children property on the frontend implementation was made for ease of access

class Folder {
    #id:number;
    #parentId:number;
    #name:string;
    #children:Folder[];

    constructor(id:number, parentId:number, name:string, dataSource:Folder[]) {
        this.#id = id;
        this.#parentId = id;
        this.#name = name;
        this.#addChildren(dataSource);
    }

    getId() {return this.#id};
    getName() {return this.#name};
    getChildren() {return this.#children};

    #addChildren(dataSource:Folder[]) {
        dataSource.forEach(folder => {
            if (folder.#parentId == this.#id)
                this.#children.push(folder);
        });
    }
}

}//End of chapter 6 - Objects and Data Structures


{//Start of chapter 7 - Error Handling
//Use exceptions rather than return codes
//I will get back to this section later
}//End of chapter 7 - Error Handling


{//Start of chapter 8 - Boundaries
//Encapsulating interfaces
class Map {};
let storageForUserNames = new Map;
//I have to imagine that instead of a regular JavaScript object, this extends a Map-like implementation from an external library that can change anytime
storageForUserNames['00001'] = "Fluffy"
storageForUserNames['00002'] = "Tom"
storageForUserNames['BAX8080'] = "20 seater bus" //should not be allowed but it is.
console.log(storageForUserNames['00001']);

//Exploring and learning boundaries
const mockImportedRouteGuard = {auth: () => {/*validate accessToken}*/}};
const mockRouter = {get: function(path:string, handler:Object, handler2:Object ) {}};
mockRouter.get("/api/users", mockImportedRouteGuard, (req, res) => {
    res.status(200).json("test")
});


}//End of chapter 8 - Boundaries