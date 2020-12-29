# supahands-coding-test
* This is the coding test for prospective supahands engineers. 
* It is a modified traveling salesman problem using an undirected graph represented in code as an adjacency matrix in the variable hunting_map.
* The adjacency matrix should not be changed.
* The number of time units should be 50, the code should be modified to take the number of time units as an integer input

## Problem Statement
* Dutch and Dylan (D&D) have just met up at a jungle retreat to go on a hunt.
* At a node, D&D can decide to either rest or hunt. D&D have stamina. Hunting, resting, and traveling to a new node consumes 1 time unit each. 
* They start the hunt with 3 stamina, and resting returns 1-2 stamina
Injuries reduce stamina by 1.
* Stamina cannot go above 3.
* A hunter with 0 stamina cannot hunt.
* The graph is undirected, D&D can traverse back and forth between nodes. D&D can either hunt together or split up. 
* A node can only be hunted in once before exhausted, hunters cannot hunt in exhausted nodes. 
* Hunting has a 10%(20% if solo) chance of causing injuries. 
* An uninjured hunter has a 50%(60% if solo) chance of bagging a prey, an injured hunter has 30%
* A crippled (0 stamina) hunter can only travel to a new node or rest. 
When the time unit runs out, they will get to the chopper and the hunt ends. (This doesn't need to be modeled)
* FYI, the hunting map is provided in the source code as an adjacency matrix

## Output
The number of prey bagged, we're going to do a STDOUT test against an integer number to determine if the engineer has passed the test.

## Instructions
1. Clone this repo
2. Solve the appropriate version of the test, be it python, ruby or js.
3. Make a fork, and then create a PR for the fork when you are ready for answer submission!

