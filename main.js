/**
 * INSTRUCTION ON RUNNING THE TEST:
 * 
 * When running the test, you can pass in one of the following command line arguments:
 * 1) '-t' if you want Dylan & Dutch to hunt together (DEFAULT)
 * 2) '-s' if you want Dylan & Dutch to hunt separately
 * 
 */


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
  constructor (id, name) {
    this.id = id;
    this.name = name;
    this.boars = 3;
  };

  getBoars () {
    return this.boars;
  }

  hunt () {
    // When a node is hunted, reduce the number of boars at the node.
    this.boars = this.boars - 1;
  }
}

class PathGenerator {

  constructor (hunting_map) {
    this.hunting_map = hunting_map;
    this.paths = [['A']];
    this.keys = Object.keys(hunting_map);
    this.nodes = {};

    this._setNodes();
    this._setPathsArray();
    this._setNodePathsArray();
  }

  _setNodes () {
    // Create Node instances for each point on the map.
    this.keys.forEach((key, index) => {
      this.nodes[key] = new Node(index, key);
    });
  }

  _setPathsArray () {
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
    // Filter out all paths that do not end in 'K' as they are incomplete.
    this.paths = this.paths.filter(path => (path[path.length - 1] === 'K'));
  }

  _setNodePathsArray () {
    // Generate the same paths that are generated in _setPathsArray,
    // but instead of each point being a simple label, the points
    // are represented by nodes with more information.
    this.node_paths = this.paths.map(path => {
      var node_path = []
      path.forEach(point => {
        node_path = [...node_path, this.nodes[point]]
      })
      return node_path
    })
  }

  getPathsArray () {
    return this.paths;
  }

  getNodes () {
    return this.nodes();
  }

  getNodePathsArray () {
    return this.node_paths;
  }

  getOptimumPath () {
    // Get the optimum path to maximise prey.
    // The Optimum path will be the path with the most possible boars.
    // This method is called by the player to determine which path they should take
    // before starting.
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

class Player {
  
  constructor (name, pathGenerator) {
    this.name = name;
    this.pathGenerator = pathGenerator;
    this.stamina = 3;
    this.prey = 0;
    this.path = [];
    this.currentNodeIndex = 0;

    this._establishPath();
  }

  _establishPath () {
    this.path = this.pathGenerator.getOptimumPath();
  }

  _hunt () {
    this.stamina -= 1;
    this.prey += 1;
    this.path[this.currentNodeIndex].hunt();
    this._moveToNextNode();
  }

  _rest () {
    this.stamina += 2;
    if (this.stamina > 3) this.stamina = 3;
    this._moveToNextNode();
  }

  _moveToNextNode () {
    this.stamina -= 1;
    this.currentNodeIndex += 1;
  }

  _printResult () {
    console.log(this.prey);
    var pathString = '';
    this.path.forEach(node => {
      pathString += node.name + ' ';
    })
    console.log(pathString);
  }

  start () {
    while(this.currentNodeIndex < this.path.length) {
      // If the player has enough stamina to hund AND move, hunt
      // Otherwise, rest
      // However, if we're on the last node (K in this case), the player has any 
      // stamina remaining, and the node has any boars remaining, 
      // hunt as there will be no more movement required.
      if (
        (this.currentNodeIndex === this.path.length - 1) &&
        this.stamina &&
        this.path[this.currentNodeIndex].getBoars()
      ) {
        this._hunt();
      } else if (
        this.stamina >= 2 &&
        this.path[this.currentNodeIndex].getBoars()
      ){
        this._hunt();
      } else {
        this._rest();
      }
      
    }
    this._printResult();
  }
}

class HuntingGame {
  constructor (args, hunting_map) {
    this.players = {
      '-t': [{
        name: 'Dutch & Dylan (D&D)'
      }],
      '-s': [
        {
          name: 'Dutch'
        },
        {
          name: 'Dylan'
        }
      ]
    }
    this.arg = args.length ? args[0] : '-t';
    this.pathGenerator = new PathGenerator(hunting_map);
  }

  play () {
    this.players[this.arg].forEach(player => {
      new Player(player.name, this.pathGenerator).start();
    })
  }
}

const args = process.argv.slice(2);

var game = new HuntingGame(args, hunting_map);
game.play();

