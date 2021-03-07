let hunter = ['Dylan', 'Dutch'],
  hunting_map = {
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
  },
  stamina = {
    tgt: 1,
    split: 2,
  };

// Map Of Hunting Map
class HuntingMap {
  constructor(name) {
    this.node = new Map();
    this.currentNode = 'A';
    this.currentHuntNode = 'B';
    this.nextTravelNode = 'B';
    this.initNode();
  }

  set(key, value) {
    this[key] = value;
  }

  getHuntNodeBoarsNumber(node, huntNode) {
    const huntingNode = this.node
      .get(node)
      .find((x) => x.routes === huntNode);

    return huntingNode?.totalBoars || 0;
  }

  // Deduct Boars Number
  huntBoars(node, huntNode, amt) {
    this.node.set(
      node,
      Object.values(this.node.get(node)).map((value) => {
        return {
          ...value,
          totalBoars:
            huntNode === value.routes
              ? value.totalBoars - amt
              : value.totalBoars,
        };
      }),
    );
  }

  initNode() {
    Object.entries(hunting_map).map(([key, value]) => {
      const nodeObj = Object.values(value).map((x) => {
        return {
          routes: x,
          totalBoars: 3,
        };
      });

      this.node.set(key, nodeObj);
    });
  }
}

// Reward Class
class Reward {
  constructor() {
    this.reward = 0;
  }

  addReward(amt) {
    this.reward += amt;
  }
}

class Hunter {
  constructor(name) {
    this.name = name;
    this.stamina = 3;
    this.restingRecover = 2;
    this.travelStaminaCost = 1;
    this.splitHuntStaminaCost = stamina.split;
    this.tgtHuntStaminaCost = stamina.tgt;
    this.masterNode = 'A';
    this.childNode = 'B';
    this.childNodeObj = {};
    this.turn = true;
    this.path = ['A'];
  }

  // Decide either move to new node or go hunt.
  performAction(key) {
    let sufficient;
    let type =
      map.getHuntNodeBoarsNumber(this.masterNode, this.childNode) ===
      0
        ? 'move'
        : 'hunt';

    switch (type) {
      case 'move':
        sufficient = this.checkSufficientStamina(1);
        if (!sufficient) {
          this.rest();
        } else {
          this.travelNode();
        }

        break;
      case 'hunt':
        this.huntingAction(key);
        break;
      default:
        break;
    }
  }

  checkSufficientStamina(amt) {
    return this.stamina >= amt;
  }

  // Hunt action
  hunt(seperate) {
    const staminaCost = seperate
      ? this.splitHuntStaminaCost
      : this.tgtHuntStaminaCost;
    const boarsNum = map.getHuntNodeBoarsNumber(
      this.masterNode,
      this.childNode,
    );
    const amt = seperate ? 1 : 0.5;

    this.stamina -= staminaCost;
    map.huntBoars(this.masterNode, this.childNode, amt);
    reward.addReward(amt);

    return;
  }

  rest() {
    const recoverAmt = this.stamina === 3 ? 0 : this.restingRecover;
    this.stamina += recoverAmt;

    return 'stay';
  }

  travelNode() {
    this.path = [...this.path, this.childNode];
    this.stamina -= this.travelStaminaCost;
    this.masterNode = this.childNode;
    let randomIndex = Math.floor(
      Math.random() * map.node.get(this.masterNode).length,
    );
    this.childNode = map.node.get(this.masterNode)[
      randomIndex
    ]?.routes;
    this.childNodeObj = map.node
      .get(this.masterNode)
      .find((x) => x.routes === this.childNode);
  }

  setReward(amount) {
    this.reward += amount;
  }

  // Decide either hunt together or hunt alone.
  huntingAction(key) {
    if (this.stamina === 0) {
      this.turn = false;
      return this.rest();
    }

    // If stamina = 1 then will check partner is enough to hunt together
    if (this.stamina === 1) {
      let groupHunt = hunters.find(
        (x) =>
          x.name !== this.name &&
          x.stamina >= 1 &&
          x.turn &&
          this.childNode === x.childNode,
      );

      if (Object.values(groupHunt || {}).length > 0) {
        this.hunt(false);
        groupHunt.hunt(false);
        groupHunt.turn = false;
      } else {
        this.rest();
      }
    } else {
      let groupHunt = hunters.find(
        (x) =>
          x.name !== this.name &&
          x.stamina === 1 &&
          x.turn &&
          this.childNode === x.childNode,
      );

      if (Object.values(groupHunt || {}).length > 0) {
        this.hunt(false);
        groupHunt.hunt(false);
        groupHunt.turn = false;
      } else {
        this.hunt(true);
      }
    }

    this.turn = false;
  }
}

// Start hunting process.
function startHunting(key = 0) {
  const endNode = hunters.filter((x) => x.masterNode === 'K');

  if (endNode.length > 0) {
    console.log(`Choppa Arrived! Let's Retreat!`);
    return key;
  } else {
    for (let hunter of hunters) {
      hunter.turn = true;
    }
  }

  for (let hunter of hunters) {
    if (!hunter.turn) continue;
    hunter.performAction(key);
  }

  key++;

  let iteration = startHunting(key);

  return iteration;
}

let map = new HuntingMap();
let hunters = hunter.map((x) => {
  return new Hunter(x);
});
let reward = new Reward();

startHunting();

hunters.map((x) => {
  console.log(`${x.name} Path : ${x.path.join(', ')}`);
});
console.log(`Total Reward : ${reward.reward} Boars`);
