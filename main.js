// Proof: U2FsdGVkX183mb1HC2bepqeg78xeNKen60pou+dyMCY=
// Set few constant to be used in the game
const DEFAULT_BOARS_IN_NODE = 3;
const DEFAULT_STAMINA = 3;
const HUNT_SCORE = {
    group: 0.5, // This has the potential to be 1/number_of_players
    single: 1,
};
const HUNT_COST = {
    group: 1,
    single: 2,
};
const TRAVEL_COST = 1;
const REST_POINTS_BACK = 3;

const START_NODE = 'A';
const FINISH_NODE = 'K';

/**
 * @class Node
 * @description
 * Nothing fancy some information about the node and queries about it
 */

class Node {
    boars;
    name;
    players_in_node;

    constructor(name) {
        this.boars = DEFAULT_BOARS_IN_NODE;
        this.name = name;
        this.players_in_node = 0;
    }

    has_boars() {
        return this.boars > 0;
    }

    // Those can be part of an event system
    // They are called manually though!.
    on_hunt() {
        this.boars--;
    }

    on_player_move_in() {
        this.players_in_node++;
    }

    on_player_move_out() {
        this.players_in_node--;
    }
}

/***
 * @class Player
 * @description
 * Information about the player and
 * some state controls
 */

class Player {
    stamina;
    path;
    current_node;
    prey;

    constructor() {
        this.stamina = DEFAULT_STAMINA;
        this.path = new Set(START_NODE);
        this.current_node = START_NODE;
        this.prey = 0;
    }

    hunt(style) {
        this.prey += HUNT_SCORE[style];
        this.stamina -= HUNT_COST[style];
    }

    can_hunt(style) {
        return this.stamina >= HUNT_COST[style];
    }

    should_rest() {
        return !this.stamina;
    }

    rest() {
        this.stamina += Math.min(REST_POINTS_BACK, DEFAULT_STAMINA - this.stamina);
    }

    travel(node_name) {
        this.stamina -= TRAVEL_COST;
        this.path.add(node_name);
        this.current_node = node_name;
    }

    can_travel_to(node_name) {
        return !this.path.has(node_name);
    }

    current_location() {
        return this.current_node;
    }
}

/**
 * @class Game
 * Where the actual logic of the game
 * is implemented
 */

class Game {
    // This should become a part of 'world'
    // However since the use is strict to two lines
    // I'll use it at it is.
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

    players;
    world = {};

    constructor(players) {
        this.players = players;
        for (const node in this.hunting_map) {
            this.world[node] = new Node(node);
        }
        // All players are in the start node
        this.world[START_NODE].players_in_node = players.length;
    }

    /***
     * @function find_next_good_location
     * @param player - the player who is doing the move
     * @description
     * a greedy and less than optimal solver to find the best next move
     * the concept is: based on the available paths hunt score,
     * what the next node should be?
     */
    find_next_good_location(player) {
        const neighbours = this.hunting_map[player.current_location()];

        // DFS traversal
        // Look into the sub path (determined by start_node).
        // Avoid the node if the player already visited it
        // Accumulate potential hunt score then return it.
        const traverse = (start_node) => {
            const stack = [start_node];
            const visited = new Set();
            let potential_score = 0;
            let reached_end = 0;
            while (stack.length > 0 && !reached_end) {
                const node = stack.shift();
                if (player.can_travel_to(node) && !visited.has(node)) {
                    visited.add(node);
                    if (node === FINISH_NODE) {
                        reached_end = 1;
                    } else {
                        this.hunting_map[node].forEach(n => stack.unshift(n));
                    }
                    // If there is another player there, the hunt score is less!.
                    const expected_mode = this.world[node].players_in_node > 0 ? 'group' : 'single';
                    potential_score += this.world[node].boars * HUNT_SCORE[expected_mode];
                }
            }

            return potential_score;
        }

        let max_hunt = 0;
        let node_to_go_to = '';
        // purely using brute force to find the best path
        // by checking all the paths from the current location
        for (const neighbour of neighbours) {
            const score = traverse(neighbour);
            if (score > max_hunt) {
                max_hunt = score;
                node_to_go_to = neighbour;
            }
        }
        return this.world[node_to_go_to];
    }

    is_done() {
        // The game is done when all the player reached the end
        // and all the boars have been hunted there.
        const all_reached = this.players.reduce((result, player) => {
            return result && player.current_location() === FINISH_NODE;
        }, 1);

        return all_reached && !this.world[FINISH_NODE].has_boars();
    }

    try_travel(player, current_node) {
        // Can't travel if tired, also you should wait for others
        if (player.should_rest() || player.current_location() === FINISH_NODE) {
            player.rest();
        } else {
            // A demonstration of how much optimistic I'm
            // I always trust that there is a next good location
            const next_location = this.find_next_good_location(player);
            player.travel(next_location.name);
            current_node.on_player_move_out();
            next_location.on_player_move_in();
        }
    }

    single_step(player) {
        // The playing logic:
        // first thing is trying to hunt else try to move
        // if the player is tired then rest
        // A special case when the node has multiple players
        // if they can hunt all together then they all going to consume stamina
        // and the function will return false as an indicator of "no more actions are allowed"
        const node = this.world[player.current_location()];
        if (node.has_boars()) {
            const hunt_mode = node.players_in_node > 1 ? 'group' : 'single';
            if (hunt_mode === 'group') {
                // All the players should have stamina
                const can_all_hunt = this.players.reduce((a, b) => {
                    return a && b.can_hunt(hunt_mode)
                }, 1);
                if (can_all_hunt) {
                    this.players.forEach(player => player.hunt(hunt_mode));
                    node.on_hunt();
                    return false;
                } else {
                    // The rest will rest then hunt again.
                    this.try_travel(player, node)
                }
            } else if (player.can_hunt(hunt_mode)) {
                player.hunt(hunt_mode);
                node.on_hunt();
            } else {
                player.rest();
            }
        } else {
            this.try_travel(player, node);
        }
        return true;
    }

    play() {
        // keep trying until all the players are at the finish line
        while (!this.is_done()) {
            // In case if the hunters performed a group hunt
            // the term should end.
            let steps = this.players.length;
            while (steps) {
                const should_continue = this.single_step(this.players[steps - 1]);
                should_continue ? steps-- : steps = 0;
            }
        }
    }
}

const dutch = new Player();
const dale = new Player();
const game = new Game([dutch, dale]);

game.play();

console.log('Total: ' + (dutch.prey + dale.prey));
console.log('Dutch: ' + Array.from(dutch.path).join('->'));
console.log('Dale: '  + Array.from(dale.path).join('->'));
