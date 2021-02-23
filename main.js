prey = 0
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

/**
 * initalize start node and end node 
 */
var sNode = 'A';
var eNode = 'K';

/***
 * serialize map to list 
 */
const nodeList = Object.values(hunting_map).flatMap((n) => n);

const existNode = {};

/**
 * fill exist node object by able solution 
 */
Object.keys(hunting_map).forEach(k => {
  existNode[k] = {
    routes: hunting_map[k],
    boar: 3,
    hunter: 0,
    start: nodeList.filter(s => s == k).length
  };
});

existNode[sNode].hunter = 2;

/**
 * class hunting build on last oop in js 
 */
class Hunting {
  constructor() {
    this.stamina = 3;
    this.prey = 0;
    this.current = sNode;
    this.moveNode = [sNode];
  }

  /**
   * reset stamina variable if it more than 3 will assign to 3
   *  or will be able to add 2 to stamina
   */
  resetStamina() {
    this.stamina += 2;
    if (this.stamina > 3)
      this.stamina = 3;
  }

  /**
   * hunt function will be able to play split or togather 
   * check if type of hunt is split or togather hunter then process 
   */
  hunt(type) {
    if (type == 'split') {
      if (existNode[this.current].hunter == 2 && existNode[this.current].boar < 3) {
        // call move function 
        this.move();
        return;
      }

      if (this.stamina < 2) {
        this.resetStamina();
        return;
      }

      this.stamina -= 2;
      if (existNode[this.current].boar == 1) {
        this.prey++;
        existNode[this.current].boar--;
        return
      }
      this.prey += 2;
      existNode[this.current].boar -= 2;
      return;
    } else if (type == 'togather') {
      this.stamina--;
      this.prey++;
      existNode[this.current].boar--;
      return;

    } else {
      throw "not allowed !";
    }

  }

  /**
   * move function for travel between nodes 
   */
  move() {
    this.stamina--;
    existNode[this.current].hunter--;

    this.current = nodes[this.current].routes.sort((x, y) => {
      if (existNode[x].boar !== existNode[y].boar) {
        return existNode[b].boar - existNode[x].boar;
      }
      return existNode[x].start - existNode[y].start;
    })[0];

    this.moveNode.push(this.current);
    existNode[this.current].hunter++;
  }

  /**
   * run function that express a start point of application 
   */
  run() {
    if (!this.stamina) {
      this.resetStamina();
      return;
    }

    if (!existNode[this.current].boar) {
      this.move();
      return;
    }

    this.hunt();

  }


}


/**
 * implement on hunting class
 */
var dutch = new Hunting();

var dylan = new Hunting();
