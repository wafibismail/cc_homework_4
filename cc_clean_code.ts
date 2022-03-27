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


{//Start of chapter 7 - Error Handling - I might come back to include these not-yet-covered parts:
//Use exceptions rather than return codes
//Write Your Try-Catch-Finally Statement First
//Use Unchecked Exceptions
//Provide Context with Exceptions
//Define Exception Classes in Terms of a Caller’s Needs
//Define the Normal Flow

//Don’t Return Null
const ACCOUNTS = {
    "Stud0001": {
        name:"Bob",
        cGpa:4.3
    },
    "Stud0002": {
        name:"Mary",
        cGpa:4.3
    }
};
let getAccountByName = function(userName:string) {
    let account;
    Object.entries(ACCOUNTS).forEach(([key,value]) => {
        account = {
            id: key,
            name: value.name,
            cGpa: value.cGpa
        }
    });
    if (typeof account === typeof undefined)
        throw Error("No account exists with the name " + userName);
    return account;
}
let displayCgpa = function(account:Object) {
    console.log(`${account[`name`]}'s CGPA is ${account['cGpa']}`)
}
try {
    let mikeAcc = getAccountByName("Mike");
    displayCgpa(mikeAcc);
} catch (error) {
    console.log(error);
}

//Don’t Pass Null
let add = function(nums:number[]):number {
    if(nums.includes(null)) throw Error("The array includes at least one invalid number")
    let sum = 0;
    nums.forEach(num => {
        sum += num;
    });
    return sum;
}
try {
    add([1,2,null]); //will throw proper Error
} catch (error) {
    console.log('Failure; ' + error)
}

}//End of chapter 7 - Error Handling


{//Start of chapter 8 - Boundaries
//Encapsulating interfaces
class Map {};
class UserNamesStorage {
    #names = new Map;//Imagine that instead of a regular JavaScript object, this extends a Map-like implementation from an external library
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

//Exploring and learning boundaries - automated boundary tests/checks on external APIs - able to detect breaking changes easily
const mockImportedRouteGuard = {auth: () => {/*validate accessToken}*/}};
const router = {
    //fake router for the sake of demonstration
    fetch: function(path:string) {
        return new Response(`Response successfully fetched from ${path}`);
    },
    get: function(path:string, handler:Object, handler2:Object ) {}
};
describe("mockImportedRouteGuard", () => {
    it("should by default return an OK response", () => {
        let path = "/api/users";

        router.get(path, mockImportedRouteGuard, (req, res) => {
            res.status(200).json("request accepted and responded to")
        });

        expect(router.fetch(path)).toContain("success");
        //Assuming this test passes, future failure would mean a breaking change was made in the external package
    });
});

//Using code that does not yet exist - e.g. an external Drawer API for the code below:
class Coord {
    #x:number; #y:number;
    constructor(x:number, y:number) {
        this.#x = x; this.#y = y;
    }
    get = () => {
        return {x:this.#x, y:this.#y};
    }
}
interface Drawer {
    drawLine(start:Coord, end:Coord):void;
    drawRect(start:Coord, end:Coord):void;
    drawCircle(center:Coord, radius:number):void;
}
class FakeDrawer implements Drawer {
    drawLine(start: Coord, end: Coord): void {
        const a = start.get(), b = end.get();
        console.log(`Line drawn from ${a.x},${a.y} to ${b.x},${b.y}`);
    }
    drawRect(start: Coord, end: Coord): void {
        const a = start.get(), b = end.get();
        console.log(`Rectangle drawn from ${a.x},${a.y} to ${b.x},${b.y}`);
    }
    drawCircle(center: Coord, radius: number): void {
        const p = center.get()
        console.log(`Circle drawn at point ${p.x},${p.y} with radius ${radius}`);
    }
}
class DrawingController {
    #drawer:Drawer;
    constructor(drawer:Drawer) {
        this.#drawer = drawer;
    }
    drawLine(start:Coord, end:Coord) {
        this.#drawer.drawLine(start, end)
    };
    drawRect(start:Coord, end:Coord) {
        this.#drawer.drawRect(start, end)
    };
    drawCircle(center:Coord, radius:number) {
        this.#drawer.drawCircle(center, radius)
    };
}
let p:Coord[] = [
    new Coord(0,0),
    new Coord(1,0),
    new Coord(0,1),
    new Coord(0,2),
    new Coord(0,3),
]
let controller = new DrawingController(new FakeDrawer);
controller.drawCircle(p[0], 3);
controller.drawRect(p[2], p[1]);
controller.drawLine(p[4], p[3]);
/*With the use of the Drawer interface, it becomes easier to implement the API that does not yet exist
Changes can be accomodated without huge rework in the code i.e. there is a clear boundary*/
class FutureDrawerAdapter implements Drawer {
    #api:Object;
    drawLine(start: Coord, end: Coord): void {
        // use the relevant functions here
    }
    drawRect(start: Coord, end: Coord): void {
        // use the relevant functions here
    }
    drawCircle(center: Coord, radius: number): void {
        // use the relevant functions here
    }
}
let futureController = new DrawingController(new FutureDrawerAdapter);
futureController.drawCircle(p[0], 3);
futureController.drawRect(p[2], p[1]);
futureController.drawLine(p[4], p[3]);

}//End of chapter 8 - Boundaries