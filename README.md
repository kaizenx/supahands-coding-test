# Assumptions and clarifications
* The solution is solved in python
* The required output was simply the number of boars hunted and the path taken by the players
    * I would like to point out that to give this output, I need only get a valid path in the map, and return that
    * The number of boars I could print out as the number of nodes visited x 3 by assuming D&D wipe out all the local widlife at every node
    * I obviously did not just do that, as I am assuming you want to see more than one function by me, so I went ahead and simulated the above mentioned hunting mechanics, even though the output is the same regardless
* I assume the hunt always starts from node A
* I have designed the logic assuming D&D are cold blooded killers and want to bag as much boar to their name as possible
* While it isn't stated that they want to bag the most possible boars, the opposite has not been specified either, so I went ahead and used my head cannon
* I have tried to make the design as robust as possible, by allowing easy logic changes to the game, but of course the base assumption is that only two players exist (although the program could be tweaked a teenie bit to accommodate that)
* And yes I know you're supposed to make regular commits to your repository and its good practice and you're probably judging me for the one commit but I am aware of that
* I am also aware that you generally want to branch and merge to master
* This is a one time thing on a relatively small project with only me working on it, so that is why I'm pushing one commit directly to master. Please don't judge my committing practices based on this :pleading_face:



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
* The output should be in the format of an STDOUT (println to the terminal)
* The number of boars bagged and the path of the hunt.
* The path of the hunt in a single line, i.e. 'A B C D ...'

## Instructions
1. Clone this repo
2. Solve the appropriate version of the test, be it in python, ruby or js.
3. Make a fork, and then create a PR for the fork when you are ready for answer submission!
4. Notify  [careers@supahands.com](mailto:careers@supahands.com) upon PR request with link to PR and demonstration of PR ownership.

