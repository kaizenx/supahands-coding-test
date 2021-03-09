
/**
 * @author ammar kalifa
 * @since 04-03-2021
 * this class for implement D&D Algorithem on js OOP
 * converte hunting map to class .
 */
class HuntingMap {
    constructor() {
        // hunting map 
        this.map = {
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
        }
        // Initialize the start node with 'A' , end node with 'K'. 
        this.SNode = 'A';
        this.ENode = 'K';
        // get list of map 
        this.nodeList = this.getMapList();
        //  initalize nodes varible 
        this.nodes = {};

        this.fillMapNodes();
    }

    //return hunting map as serlizer list 
    getMapList() {
        return Object.values(this.map).flatMap((n) => n);
    }

    //fill nodes object as hunting object with accessable varibles  
    fillMapNodes() {
        Object.keys(this.map).forEach(key => {
            this.nodes[key] = {
                routes: this.map[key],
                boar: 3,
                hunter: 0,
                start: this.nodeList.filter(s => s == key).length
            }
        });
    }

}

var hm = new HuntingMap();
hm.nodes[hm.SNode].hunter = 2;

/**
 * build class hunt for D&D 
 */

class Hunting {
    constructor() {
        this.stamina = 3;
        this.prey = 0;
        this.currentNode = hm.SNode;
        this.moveNode = [hm.SNode];
    }

    /*
     * reset stamina variable if it more than 3 will assign to 3
     *  or will be able to add 2 to stamina
     */
    resetStamina() {
        this.stamina += 2;
        if (this.stamina > 3)
            this.stamina = 3;
    }

    /**
     * hunt function:
     * will be able to play split or togather 
     * check if type of hunt is split or togather hunter then process 
     */
    hunt(hType) {
        // console.log('type = '+ hType);
        if (hType == 'split') {
            if (hm.nodes[this.currentNode].hunter == 2 && hm.nodes[this.currentNode].boar < 3) {
                // call move function 
                this.move();
                return;
            }

            if (this.stamina < 2) {
                this.resetStamina();
                return;
            }

            this.stamina -= 2;

            if (hm.nodes[this.currentNode].boar == 1) {
                this.prey++;
                hm.nodes[this.currentNode].boar--;
                return
            }

            this.prey += 2;
            hm.nodes[this.currentNode].boar -= 2;
            return;

        } else if (hType == 'group') {
            this.stamina--;
            this.prey++;
            hm.nodes[this.currentNode].boar--;
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
        hm.nodes[this.currentNode].hunter--;

        this.currentNode = hm.nodes[this.currentNode].routes.sort((x, y) => {
            if (hm.nodes[x].boar !== hm.nodes[y].boar) {
                return hm.nodes[y].boar - hm.nodes[x].boar;
            }
            return hm.nodes[x].start - hm.nodes[y].start;
        })[0];

        this.moveNode.push(this.currentNode);
        hm.nodes[this.currentNode].hunter++;
    }

    /**
     * run function that express a start point of application 
     */
    run(htype) {
        if (!this.stamina) {
            this.resetStamina();
            return;
        }

        if (!hm.nodes[this.currentNode].boar) {
            this.move();
            return;
        }
        this.hunt(htype);

    }
}

/**
 * implement on hunting class
 */
var dutch = new Hunting();

var dylan = new Hunting();

var hType = '';
var count = 0;
// console.log(dutch.currentNode);

while ((dutch.currentNode != hm.ENode || dylan.currentNode != hm.ENode)
    || hm.nodes[hm.ENode].boar != 0) {


    if ((dylan.currentNode == dutch.currentNode) &&
        hm.nodes[dutch.currentNode].routes.every((r) => hm.nodes[r].boar == 0)
    ) {
        hType = 'group';
    } else {
        hType = 'split';
    }


    (dutch.currentNode != hm.ENode || hm.nodes[hm.ENode].boar != 0) && dutch.run(hType);
    (dylan.currentNode !== hm.ENode || hm.nodes[hm.ENode].boar != 0) && dylan.run(hType);

    count++;
}


console.log('count', count);
console.log('Dutch prey = ', dutch.prey);
console.log('Dutch hunt way =', dutch.moveNode.join(', '));
console.log('Dylan prey =', dylan.prey);
console.log('Dylan hunt way =', dylan.moveNode.join(', '));

