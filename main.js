prey = 0;
hunting_map = {
    A: ["B", "C", "K"],
    B: ["D", "E"],
    C: ["E", "G", "H"],
    D: ["E", "F"],
    E: ["G", "I", "F"],
    F: ["I", "J"],
    G: ["I", "K"],
    H: ["I", "F"],
    I: ["K"],
    J: ["K"],
    K: [],
};

const START_NODE = "A";
const END_NODE = "K";
const PATH_NODES = {};

// pathnode struture to get used by Path_nodes dictionary
class PathNode {
    currentNode;
    boarCount;
    hunterPassed;
    NextNodes;

    constructor() {
        this.hunterPassed = 0;
        this.boarCount = 3;
    }
}

// Initalize routes into PATH_Nodes object
for (const [key, value] of Object.entries(hunting_map)) {
    node = new PathNode();
    node.currentNode = key;
    node.boarCount = 3;
    node.hunterPassed = 0;
    node.NextNodes = value;
    PATH_NODES[key] = node;
}

// Hunter Object which contains the core functions rest,travel and hunt
class Hunter {
    stamina;
    prey;
    currentNode;
    huntingPath;
    huntType;
    constructor() {
        this.stamina = 3;
        this.prey = 0;
        this.currentNode = START_NODE;
        this.huntingPath = [START_NODE];
        this.huntType = huntType.GROUP;
    }

    takeAction() {
        if (!this.stamina) {
            this.rest();
            return;
        }
        if (!PATH_NODES[this.currentNode].boarCount) {
            this.travel();
            return;
        }
        this.hunt();
    }
    hunt() {
        debugger;
        // hunter will get 2 preys if he was hunting alone and the boar counts more than 1 and his stamina more or equals 2
        if (
            PATH_NODES[this.currentNode].hunterPassed <= 1 &&
            PATH_NODES[this.currentNode].boarCount > 1 &&
            this.stamina >= 2
        ) {
            this.prey += 2;
            PATH_NODES[this.currentNode].boarCount -= 2;
            this.stamina -= 2;
            return;
        }
        // hunter will get 1 preys if he was hunting in group and the boar counts 1 or more
        // the hunter will go here first since both of hunters will get started at the same node and the stamina 1 or more
        if (
            PATH_NODES[this.currentNode].hunterPassed === 2 &&
            PATH_NODES[this.currentNode].boarCount >= 1 &&
            this.stamina >= 1
        ) {
            this.prey += 1;
            PATH_NODES[this.currentNode].boarCount -= 1;
            this.stamina -= 1;
            return;
        }
        // hunter will travel if there isn't any boar lefts in the current node
        if (PATH_NODES[this.currentNode].boarCount == 0) {
            this.travel();
            return;
        }
        // hunter will have a rest if stamina below 1 since he can't hunt because the current node have no boars
        // and travelling will consume 1 stamina so he will rest instead
        if (this.stamina < 1) {
            this.rest();
            return;
        }
    }
    travel() {
        // remove one stamina on travel and decrease the hunter count in the
        // current node to know how many hunters are there in the current node
        this.stamina--;
        PATH_NODES[this.currentNode].hunterPassed--;
        debugger;
        // Calculating best route depending on boar count in the next routes
        this.currentNode = this.getOptimumPath();

        this.huntingPath.push(this.currentNode);
        PATH_NODES[this.currentNode].hunterPassed++;
    }
    rest() {
        // resting will gain 2 stamina and the function will get triggered depending on the status of the hunter in the takeAction method
        this.stamina += 2;
        this.stamina = this.stamina > 3 ? 3 : this.stamina;
    }

    getOptimumPath() {
        // will return the optimum nex node
        return PATH_NODES[this.currentNode].NextNodes.sort((a, b) => {
            debugger;
            if (PATH_NODES[a].boarCount !== PATH_NODES[b].boarCount) {
                PATH_NODES[b].boarCount - PATH_NODES[a].boarCount;
            }
            PATH_NODES[b].boarCount - PATH_NODES[a].boarCount;
        })[0];
    }
}

var traverseCount = 0;

// not used
const huntType = {
    SOLO: "solo",
    GROUP: "group",
};

const dutch = new Hunter();
const dylan = new Hunter();

PATH_NODES["A"].hunterPassed = 2;
// Hunters starting to take actions until achieving the end node
while (dutch.currentNode !== END_NODE || dylan.currentNode !== END_NODE) {
    if (dutch.currentNode != END_NODE) {
        dutch.takeAction();
    }
    if (dylan.currentNode !== END_NODE) {
        dylan.takeAction();
    }

    traverseCount++;
}

// log the results for both hunters
console.log("Traverse count", traverseCount);
console.log("Dutch path of hunt", dutch.huntingPath.join(" "));
console.log("Dutch preys", dutch.prey);
console.log("Dylan path of hunt", dylan.huntingPath.join(" "));
console.log("Dylan preys", dylan.prey);