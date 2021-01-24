# TODO:
1. Comments
2. QOL stuffs

# supahands-coding-test
* This is the coding test for prospective supahands engineers. 
* It is a modified traveling salesman problem using a graph represented in code as an adjacency matrix in the variable hunting_map.
* The matrix is unweighed.
* The matrix should not be changed.


## Problem Statement
* Dutch and Dylan (D&D) have just met up at a jungle retreat to go on a hunt, they intend to hunt wild jungle boars.
* They pull out a map that represents the good hunting spots in the jungle that they are hunting in as nodes on a graph.
* At a node, D&D can decide to either rest or hunt.
* D&D need to rest during the hunt as hunting consumes stamina, D&D start with 3 stamina each. 
* Resting returns 2 stamina, resting cannot bring stamina above 3.
* Hunting at a node consumes 1 stamina, traveling from node to node consumes 1 stamina.
* A hunter with 0 stamina cannot hunt, but can rest to recover stamina.
* The graph is directed, D&D cannot traverse back and forth between nodes. D&D can either hunt together or split up. 
* A node can be hunted in multiple times, however a node provides diminishing returns as it is hunted in.
* A node starts with 3 boar, and each hunt will reduce the number of boar by 1, when the number of boars in a node reaches 0, no new boar can be hunted there.
* D&D can hunt together or split up, either way they have a 100% chance of bagging a boar.
* However if they choose to split up, hunting consumes 2 stamina, but this allows D&D to bag 2 boars a turn.
* FYI, the hunting map is provided in the source code as an array, you probably want to convert it to a matrix of some sort.
* Resting, hunting and moving from node to node consumes 1 turn, note that if D&D are moving separately, they do not each consume one turn.
* I leave it up to your imagination how you should implement D&D moving separately, maybe there should be each turn D&D are allowed 1 action each? (Hint hint)
* D&D end the hunt at node "K", at which they get to the choppa

## Expected Solution
* The solution should be object oriented, based on DRY and single responsibility principles.
* Expect to implement some kind of search or crawl
* Provide comments in code to explain implementation

## Outputs
* The number of boars bagged and the path of the hunt.
* The path of the hunt in a single line, i.e. 'A B C D ...'

## Instructions
1. Clone this repo
2. Solve the appropriate version of the test, be it in python, ruby or js.
3. Make a fork, and then create a PR for the fork when you are ready for answer submission!
4. Notify  [careers@supahands.com](mailto:careers@supahands.com) upon PR request with link to PR and demonstration of PR ownership.

