# CC Homework 4
## About
This is another one of the regular exercises assigned by my Software Engineering lecturer. <br>
<br>
We are instructed to provide examples of selected concepts covered in the CC textbook, which in this week's case are "Objects and Data Structures", "Error Handling", and, "Boundaries".

### Files
[cc_bad_code.ts](https://github.com/wafibismail/cc_homework_4/blob/master/cc_bad_code.ts) contains the code that needs refining <br>
[cc_clean_code.ts](https://github.com/wafibismail/cc_homework_4/blob/master/cc_clean_code.ts) the result

## Typescript
Private variables are identified with #'s e.g.
```typescript
class Coordinate {
    x:number;
    #y:number;
}
let coord = new Coordinate();
coord.x++; //This is allowed
coord.#y++; //This is not, and will prevent TypeScript->JavaScript transpilation.
```

Semicolons are used for either type declaration or property assignment, e.g.:
```typescript
//setting properties of an object
const coord = {
    x:10;
    y:20;
}
//setting a variable anywhere else e.g. a class's default instance variables
class Coordinate {
    #x = 10;
    #y = 20;
}
//declaring types
var someNumber:number;
someNumber = 10; //works
someNumber = "a": //doesn't
//both
class Coordinate {
    #x:number = 10;
    #y:number = 20;
}
```