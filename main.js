const hunting_map = {
  'A':['B','C','K'],
  'B':['D','E'],
  'C':['E','G','H'],
  'D':['E','F'],
  'E':['G','I','F'],
  'F':['I','J'],
  'G':['I','K'],
  'H':['I','F'],
  'I':['K'],
  'J':['K'],
  'K':[]
};

// if we assume D&D has to travel together
// and starts from node A
function simpleSolution() {
  let path = [];
  function explorePath(_path, node) {
    const p = [..._path, node];
    if (node !== "K") {
      if (!_path.includes(node)) {
        const neighbors = hunting_map[node];
        neighbors.forEach(n => {
          explorePath(p, n);
        })
      }
    } else if (p.length > path) {
      path = p;
    }
  }
  explorePath([], "A");
  console.log(path.join(" "));

  // with this behavior D&D have a fixed routine:
  // Hunt together (Stamina left: 2, Prey left: 2)
  // Hunt individually (Stamiina left: 0, Prey Left: 0)
  // Rest (Stamina left: 2)
  // Move to next node (Stamina left: 1)
  // Rest (Stamina left: 3)
  // Repeat
  const turn = ((path.length - 1) * 5) + 2;
  return turn;
}
console.log("===Simple Solution===")
let turns = simpleSolution();
console.log("Total turns:", turns);
console.log();



console.log("===Alternative Solution===")
// if D&D can each traverse different nodes by their own
// also allows varied number of hunters

const START_FROM_A = true;
const END_NODE = 'K';
const HUNTERS = ["Dutch", "Dylan"];
//const HUNTERS = ["Dutch", "Dylan", "Dyson"];
//const HUNTERS = ["Dutch", "Dylan", "Dyson", "Damien"];
//const HUNTERS = ["Dutch", "Dylan", "Dyson", "Damien", "Desmond"];
const PREY_PER_NODE = 3;
const STAMINA = 3;

// simple class for each node
// we store variable hunters to easily retrieve the hunters on a node
class Node {
  constructor(id) {
    this.id = id;
    this.preys = PREY_PER_NODE;
    this.hunters = new Set();
  }

  setNeighbors(neighbors) {
    this.neighbors = neighbors;
  }
}

// use Map for the hunting map (pun not intended)
class HuntingMap {
  constructor(hunting_map) {
    this.nodes = new Map();
    Object.keys(hunting_map).forEach(id => {
      this.nodes.set(id, new Node(id));
    })
    Object.entries(hunting_map).forEach(([id, neighborsIDs]) => {
      const neighbors = neighborsIDs.map(neighborID => this.nodes.get(neighborID));
      this.nodes.get(id).setNeighbors(neighbors)
    })
  }

  getNode(id) {
    return this.nodes.get(id);
  }
}

// we precompute the path for each Hunter
// idx is used to keep track of hunter's next move
// completeTurn is used to check if the hunter is available for pair hunting
class Hunter {
  constructor(name, path, map) {
    this.name = name;
    this.path = path;
    this.map = map;
    this.stamina = STAMINA;
    this.idx = 0;
    this.node = this.map.getNode(path[this.idx]);
    this.node.hunters.add(this);
    this.completeTurn = false;
    this.prey = 0;
  }

  rest() {
    this.stamina = this.stamina + 2;
  }

  move() {
    if (this.idx < this.path.length - 1) {
      this.idx += 1;
      this.node.hunters.delete(this);
      this.node = this.map.getNode(this.path[this.idx]);
      this.node.hunters.add(this);
      this.stamina -= 1;
    }
  }

  attemptHunt() {
    if (this.stamina === 1) {
      let companion = null;
      for (const hunter of this.node.hunters) {
        if (hunter.name !== this.name && hunter.stamina > 0 && !hunter.completeTurn) {
          companion = hunter;
          break;
        }
      }
      if (!companion) this.rest();
      else this.hunt(companion);
    } else {
      this.hunt()
    }
  }

  hunt(companion) {
    if (!companion) {
      this.stamina -= 2;
    } else {
      this.stamina -= 1;
      companion.stamina -= 1;
      companion.completeTurn = true;
    }
    this.prey += 1
    this.node.preys -= 1;
  }

  nextTurn() {
    if (!this.completeTurn) {
      if (this.stamina === 0) this.rest();
      else if (this.node.preys === 0) this.move();
      else this.attemptHunt();
    }
    this.completeTurn = true;
  }
}

// a slightly complicated way to compute optimized paths
function computeHunterPaths(hunting_map, hunters_count, end_node, start_node) {
  // start by gathering all the possible permutations
  let all_paths = [];
  function explorePaths(path) {
    const current_node = path[path.length - 1];
    const neighbors = hunting_map[current_node];
    neighbors.forEach(neighbor => {
      if (neighbor === end_node) all_paths.push([...path, neighbor]);
      else if (!path.includes(neighbor)) explorePaths([...path, neighbor]);
    })
  }
  
  // different paths can be computed depending on
  // whether the hunters are required to start from node A
  if (start_node) {
    explorePaths([start_node]);
  } else {
    Object.keys(hunting_map).forEach(node => {
      explorePaths([node]);
    })
  }

  // helper function to check if a combination of paths visits all nodes
  function checkIfIncludeAllNodes(paths) {
    const set = new Set();
    paths.forEach(path => {
      path.forEach(node => {
        set.add(node);
      })
    })
    return set.size === Object.keys(hunting_map).length;
  }
  
  // recursive function to compute all the combinations that would visit all the nodes
  // limit the combination size to the number of hunters
  let valid_paths_combinations = [];
  function combinations(paths, i) {
    const _paths = [...paths, all_paths[i]];
    if(checkIfIncludeAllNodes(_paths)) valid_paths_combinations.push(_paths);
    if (_paths.length < hunters_count) {
      for (let j = i + 1; j < all_paths.length; j++) {
        combinations(_paths.slice(), j);
      }
    }
  }
  for (let i = 0; i < all_paths.length; i++) {
    combinations([], i);
  }

  // optimize the results by filtering out the combinations that have
  // paths that are longer than other combinations
  let min = Number.MAX_VALUE;
  valid_paths_combinations.forEach(paths => {
    let max = 0;
    for (const path of paths) {
      if (path.length > max) max = path.length;
    }
    if (max < min) min = max;
  })
  let min_paths_combinations = valid_paths_combinations.filter(paths => 
    !paths.find(path => path.length > min)
  )

  // return the filtered combinations
  return min_paths_combinations;
}

function simulateHunt(paths) {
  // initialize our map and hunters
  const map = new HuntingMap(hunting_map);
  const hunters = HUNTERS.map((name, i) => {
    const hunter = new Hunter(name, paths[i % HUNTERS.length], map);
    return hunter;
  })

  // simulation
  let turn = 0;
  let reachEndNode = false;
  while(!reachEndNode) {
    turn++;
    hunters.forEach(hunter => {
      hunter.completeTurn = false;
    })
    reachEndNode = true;
    hunters.forEach(hunter => {
      hunter.nextTurn();
      if (hunter.node.id !== END_NODE || hunter.node.preys > 0) {
        reachEndNode = false;
      }
    })
  }

  // compute statistics
  let preys = 0;
  hunters.forEach(hunter => {
    console.log(`${hunter.name}'s path:`, hunter.path.join(" "));
    preys += hunter.prey;
  })
  console.log("Total preys:", preys);
  return turn;
}

// paths for hunters can be picked from the set
// number of turns might be affected but we can compute all the results and select the minimum if required
console.log("Start from node A")
let paths = computeHunterPaths(hunting_map, HUNTERS.length, 'K', 'A')[0];
turns = simulateHunt(paths);
console.log("Total turns:", turns);
console.log()

console.log("Start from any nodes")
paths = computeHunterPaths(hunting_map, HUNTERS.length, 'K')[0];
turns = simulateHunt(paths);
console.log("Total turns:", turns);

