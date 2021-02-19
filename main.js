// prey = 0
hunting_map = {
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

class Node {
  constructor(id, name){
    this.id = id;
    this.name = name;
    this.boars = 3;
  };

  getBoars(){
    return this.boars;
  }

  hunt(){
    this.boars = this.boars - 1;
  }
}

class Paths {

  constructor (hunting_map) {
    this.hunting_map = hunting_map;
    this.paths = [['A']];
    this.keys = Object.keys(hunting_map);
    this.nodes = {};

    this.setNodes();
    this.setNodePathsArray();
  }

  setPathsArray () {
    this.keys.forEach(key => {
      var parents = [];
      // Check if the current key has parents in the hunting map.
      this.keys.forEach(parentKey => {
        if (key === parentKey) return;
        if (this.hunting_map[parentKey].includes(key)) parents = [...parents, parentKey];
      });
      // Establish paths that end with any of the current key's parents
      this.paths.forEach(path => {
        if (parents.includes(path[path.length - 1])) {
          this.paths = [...this.paths, [...path, key]]
        }
      });
    })
    // Filter out all paths that do not end in 'K'.
    this.paths = this.paths.filter(path => (path[path.length - 1] === 'K'));
  }

  getPathsArray () {
    return this.paths;
  }

  setNodes () {
    this.keys.forEach((key, index) => {
      this.nodes[key] = new Node(index, key);
    });
  }

  getNodes () {
    return this.nodes();
  }

  setNodePathsArray () {
    this.setPathsArray();
    this.node_paths = this.paths.map(path => {
      var node_path = []
      path.forEach(point => {
        node_path = [...node_path, this.nodes[point]]
      })
      return node_path
    })
    // console.log(this.node_paths);
  }

  getNodePathsArray () {
    return this.node_paths;
  }

  getOptimumPath () {
    let optimum_path = {
      total_boars: 0,
      node_path: []
    };
    this.node_paths.forEach(node_path => {
      let total_boars = 0;
      node_path.forEach(node => {
        total_boars += node.getBoars();
      })
      if (total_boars > optimum_path.total_boars) {
        optimum_path = {
          total_boars,
          node_path
        }
      }
    });
    return optimum_path.node_path;
  }
}

var p = new Paths(hunting_map);
console.log(p.getOptimumPath());

class Player {
  
  constructor (name) {
    this.name = name;
    this.stamina = 3;
    this.prey = 0;
    this.path = [];
  }


}

// console.log(optimum_path);
