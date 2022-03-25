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

}