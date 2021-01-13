const hunting_map = {
	A: ['B', 'C', 'K'],
	B: ['D', 'E'],
	C: ['E', 'G', 'H'],
	D: ['E', 'F'],
	E: ['G', 'I', 'F'],
	F: ['I', 'J'],
	G: ['I', 'K'],
	H: ['I', 'F'],
	I: ['K'],
	J: ['K'],
	K: [],
};
const START_NODE = 'A';
const END_NODE = 'K';

// Extracting all entry routes
const entryRouteList = Object.values(hunting_map).flatMap((node) => node);

// Generating initial map nodes
const nodes = {};
Object.keys(hunting_map).forEach((node) => {
	nodes[node] = {
		boarCount: 3,
		hunterCount: 0,
		routes: hunting_map[node],
		entryCount: entryRouteList.filter((route) => route === node).length,
	};
});
nodes[START_NODE].hunterCount = 2;

class Hunter {
	constructor() {
		this.stamina = 3;
		this.prey = 0;
		this.currentNode = START_NODE;
		this.travelledNode = [START_NODE];
	}
	doAction() {
		if (!this.stamina) {
			this.rest();
			return;
		}
		if (!nodes[this.currentNode].boarCount) {
			this.travel();
			return;
		}
		this.hunt();
	}
	hunt() {
		switch (huntType) {
			case 'solo':
				// When they are in the same node, if one of the hunter is already hunting, the other will travel to the next route.
				if (nodes[this.currentNode].hunterCount === 2 && nodes[this.currentNode].boarCount < 3) {
					this.travel();
					return;
				}

				if (this.stamina < 2) {
					this.rest();
					return;
				}
				this.stamina -= 2;

				if (nodes[this.currentNode].boarCount === 1) {
					this.prey++;
					nodes[this.currentNode].boarCount--;
					break;
				}

				this.prey += 2;
				nodes[this.currentNode].boarCount -= 2;
				break;
			case 'group':
				this.stamina--;
				this.prey++;
				nodes[this.currentNode].boarCount--;
				break;
		}
	}
	travel() {
		this.stamina--;
		nodes[this.currentNode].hunterCount--;

		// Calculating best route / node to travel. Higher priority to travel to unhunted node (still got 3 boar), followed by node that has fewer entry route.
		this.currentNode = nodes[this.currentNode].routes.sort((a, b) => {
			if (nodes[a].boarCount !== nodes[b].boarCount) {
				return nodes[b].boarCount - nodes[a].boarCount;
			}
			return nodes[a].entryCount - nodes[b].entryCount;
		})[0];

		this.travelledNode.push(this.currentNode);
		nodes[this.currentNode].hunterCount++;
	}
	rest() {
		this.stamina += 2;
		this.stamina = this.stamina > 3 ? 3 : this.stamina;
	}
}

const dutch = new Hunter();
const dylan = new Hunter();

let huntType = '';
let turnsCount = 0;

// Starting the turns
while (dutch.currentNode !== END_NODE || dylan.currentNode !== END_NODE || nodes[END_NODE].boarCount !== 0) {
	// By default they will choose to hunt solo (split), unless their next routes doesn't have boar anymore, then they will hunt in a group.
	huntType =
		dutch.currentNode === dylan.currentNode &&
		nodes[dutch.currentNode].routes.every((route) => nodes[route].boarCount === 0)
			? 'group'
			: 'solo';

	(dutch.currentNode !== END_NODE || nodes[END_NODE].boarCount !== 0) && dutch.doAction();
	(dylan.currentNode !== END_NODE || nodes[END_NODE].boarCount !== 0) && dylan.doAction();

	turnsCount++;
}

console.log('Turns count', turnsCount);
console.log('Dutch prey count', dutch.prey);
console.log('Dutch hunt path', dutch.travelledNode.join(' '));
console.log('Dylan prey count', dylan.prey);
console.log('Dylan hunt path', dylan.travelledNode.join(' '));
