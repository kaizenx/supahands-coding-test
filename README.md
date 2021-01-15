
# Supahands Coding Challenge Write-up

Hey Supahands! It's been a while.

Not sure why I have to do a coding challenge when I'm applying for a DevOps role,
but here's my submission and write-up.

## Clarification

I believe that certain parts of the challenge requires more clarification:

- Do the hunters need to start at a specific node?
- Do the hunters have to traverse through all nodes?
- Can the hunters split up and move into different zones?
- What is the "solution" are we looking for?
  Is it the path?
  Or minimizing the number of turns?

In the end, I decided to write solutions that can accomodate to different requirements.

## First Naive Solution

The solution in the file is a straight up naive solution.
I am assuming that the hunters must move as a group, and allowed to split
into their own paths.

In this scenario, there are some nodes that the hunters won't be able to reach
due to the nodes being arranged in a directed acyclic graph.

Furthermore, since this is a multi agent path finding case, there are multiple methods
or algorithms to solve it which usually requires extensive research.

However, given our small test case (only 2 hunters and 11 nodes), we can implement a simple
proof-of-concept brute force solution.

## Second, Alternative More Complete Solution

Below the first solution you will find a much more longer, complete code
that covers several situation:

- Optional for hunters to start at node A or any other nodes
- Hunters can split into different paths
- Hunters must traverse through all nodes
- Able to compute for more than 2 hunters

Although the code can compute for more than 2 hunters, the performance will suffers
after the number of hunters are larger than 4 since it is a brute force implementation.

