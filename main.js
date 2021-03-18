prey = 0
let hunting_map = {
    'A': ['B', 'C', 'K'],
    'B': ['D', 'E'],
    'C': ['E', 'G', 'H'],
    'D': ['E', 'F'],
    'E': ['G', 'I', 'F'],
    'F': ['I', 'J'],
    'G': ['I', 'K'],
    'H': ['I', 'F'],
    'I': ['K'],
    'J': ['K'],
    'K': []
};
console.log(hunting_map);
console.log(prey);

const START_NODE = 'A';
const END_NODE = 'K';
const SPLIT = 1;
const TOGETHER = 2;
const MAX_STAMINA = 3;
const TRAVEL_STAMINA = 1;
const REST_STAMINA = 2;
const SPLIT_HUNT_STAMINA = 2;
const TOGETHER_HUNT_STAMINA = 1;
const SPLIT_HUNT_BOAR = 2; //split hunt boar amount
const TOGETHER_HUNT_BOAR = 1; //together hunt boar amount
const nodes = [];

class node {
    constructor(nodeName, routes) {
        this.boarCount = 3;
        this.nodeName = nodeName;
        this.routes = routes;
    }
    huntBoars(amount) {
        // this condition is for when hunting together but only 1 boar left
        if (this.boarCount <= 0) {
            // console.log("no boar left");
            return 0;
        } else if (this.boarCount >= amount) {
            this.boarCount = this.boarCount - amount;
            // console.log("boar: "+ this.boarCount + " hunted: "+ amount);
            return amount;
        } else if (this.boarCount < amount) {
            let remainingBoar = this.boarCount;
            this.boarCount = 0;
            // console.log("boar: "+ this.boarCount + " hunted: "+ remainingBoar);
            return remainingBoar;
        }
    }
}

class hunter {
    constructor(routes) {
        this.stamina = 3;
        this.currentNode = START_NODE;
        this.boarHunted = 0;
        this.travelledNode = [START_NODE];
        this.isHunting = false; // intent to hunt (before checking stamina)
        this.routes = routes;
    }
    //Decides what to do, and most importantly use to check if they are going to hunt togeher
    // if has stamina: decide to hunt if there is any boars in current node (will rest after deciding to hunt if not enough stamina). If no boar, travel)
    makeDecision(nodes) {
        this.isHunting = false;
        if (this.currentNode == END_NODE && nodes[END_NODE].boarCount == 0) {
            return;
        }
        if (this.stamina == 0) {
            this.rest();
        } else if (nodes[this.currentNode].boarCount > 0) {
            // hunt()
            this.isHunting = true;
        } else {
            this.travel();
        }
    }
    rest() {
        this.stamina += REST_STAMINA;
        if (this.stamina > MAX_STAMINA) {
            this.stamina = MAX_STAMINA;
        }
        // console.log('after resting stamina' + this.stamina);
    }
    //travel to the next determined node
    travel() {
        if (this.stamina < TRAVEL_STAMINA) {
            this.rest();
            return;
        }
        this.stamina -= TRAVEL_STAMINA;
        let index = this.routes.indexOf(this.currentNode);
        this.currentNode = this.routes[index + 1];
        // console.log("travelling to " + this.routes[index + 1])
        this.travelledNode.push(this.routes[index + 1]);
    }
    hunt(huntType, nodes) {
        // if hunter decide hunt, check if they have enough stamina to actually hunt
        if (huntType == SPLIT) {
            if (this.stamina >= SPLIT_HUNT_STAMINA) {
                this.stamina -= SPLIT_HUNT_STAMINA;
                this.boarHunted += nodes[this.currentNode].huntBoars(SPLIT_HUNT_BOAR);
            } else {
                this.rest();
            }
        } else if (huntType == TOGETHER) {
            if (this.stamina >= TOGETHER_HUNT_STAMINA) {
                this.stamina -= TOGETHER_HUNT_STAMINA;
                this.boarHunted += nodes[this.currentNode].huntBoars(TOGETHER_HUNT_BOAR);
            } else {
                this.rest();
            }
        }
    }
}

class DFS {
    constructor(graph) {
        this.graph = graph;
        this.pathsList = [];
        this.bestPaths = [];
    }
    // compute all possible paths
    findAllPaths(start, end) {
        let currentPathList = [];
        currentPathList.push(start);
        // Call recursive function
        this.findAllPathsRecur(start, end, currentPathList, this.graph);
        this.findOptimalPaths;
    }
    findAllPathsRecur(start, end, currentPathList, graph) {
        // if in end node, store the current Path
        if (start == end) {
            this.pathsList.push([...currentPathList]);
        }
        graph[start].forEach(function (next) {
            currentPathList.push(next);
            this.findAllPathsRecur(next, end, currentPathList, graph);
            currentPathList.pop(next);
        }, this);
    }
    //find the best combination of 2 paths that have the most unique nodes
    findOptimalPaths() {
        let pathCombination = undefined;
        let uniqueNodes = undefined;
        let maxUnique = 0;
        let uniqueCount = 0;
        this.pathsList.forEach(function (firstPath) {
            this.pathsList.forEach(function (secondPath) {
                pathCombination = firstPath.concat(secondPath);
                uniqueNodes = Array.from(new Set(pathCombination));
                uniqueCount = uniqueNodes.length;
                if (maxUnique < uniqueCount) {
                    maxUnique = uniqueCount;
                    this.bestPaths.length = 0;
                    this.bestPaths.push(firstPath);
                    this.bestPaths.push(secondPath);
                }
            }, this);
        }, this);
    }
}

//initialise all nodes
Object.keys(hunting_map).forEach(function (key) {
    nodes[key] = new node(key, hunting_map[key]);
});

// Do DFS and find the best combination of 2 paths that have the most unique nodes
let dfs = new DFS(hunting_map);
dfs.findAllPaths(START_NODE, END_NODE);
dfs.findOptimalPaths();
// console.log(dfs.bestPaths);

// each hunter get 1 of the best path
let Dutch = new hunter(dfs.bestPaths[0]); 
let Dylan = new hunter(dfs.bestPaths[1]);

let turn = 1;
while (Dutch.currentNode !== END_NODE || Dylan.currentNode !== END_NODE || nodes[END_NODE].boarCount !== 0) {
    // console.log("turncount: " + turn);
    Dutch.makeDecision(nodes);
    Dylan.makeDecision(nodes);

    // Check if both want to hunt and both of them are in the same node and have stamina to hunt together 
    // (not neccessary to check stamina if hunting together need 1 stamina since they will rest if 0 stamina, 
    // but this condition will be useful if hunting together requires > 1 stamina)
    if (Dutch.isHunting == true && Dylan.isHunting == true && Dutch.currentNode == Dylan.currentNode && Dutch.stamina >= TOGETHER_HUNT_STAMINA && Dylan.stamina >= TOGETHER_HUNT_STAMINA) {
        Dutch.hunt(TOGETHER, nodes);
        Dylan.hunt(TOGETHER, nodes);
    }  else {
        // if they are not in the same node, checks who decides to hunt
        if (Dutch.isHunting == true) {
            Dutch.hunt(SPLIT, nodes);
        }
        if (Dylan.isHunting == true) {
            Dylan.hunt(SPLIT, nodes);
        }
    }
    turn += 1;
}

prey = Dutch.boarHunted + Dylan.boarHunted;
console.log("Dutch travelled nodes: " + Dutch.travelledNode);
console.log("Dutch boars hunted: " + Dutch.boarHunted);
console.log("Dylan travelled nodes: " + Dylan.travelledNode);
console.log("Dylan boars hunted: " + Dylan.boarHunted);
console.log("total boars: " + prey);
console.log("total turns: " + turn);