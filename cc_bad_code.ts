{
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

}