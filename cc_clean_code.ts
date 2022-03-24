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

}