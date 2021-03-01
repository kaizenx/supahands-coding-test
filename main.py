from modules import Hunter, Node, Path, Runner
from pprint import pprint
import argparse

parser = argparse.ArgumentParser(description='Supahands coding test')
parser.add_argument('--first', action='store_true',
                    help='Lists only the first result (default: lists all)')

args = parser.parse_args()


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
}


def path_crawler(hm, path=['A'], paths=[]):
    """Given a matrix, return a list of all available paths

    It works similarly to Depth-First Search. Starting from a 
    root element, it recursively iterates down a single path
    until it reaches the terminal. It returns the given path,
    and works its way back up until it gets to a node that has
    an unvisited element.

    Note: Only works on Directed Acyclic Graphs. If the graph
    has a cycle, the recursion will not stop.

    Pseudocode based on the given hunting map:

    A -> B -> D -> E -> G -> I -> K
    Returns to I, it doesn't have another element
    Returns to G, goes down to K.
    This returns:
    A -> B -> D -> E -> G -> I -> K
    Returns to I
    Returns to G
    Returns to E
    A -> B -> D -> E -> I -> K
    And so on.
    """
    d = path[-1]
    if d in hm and hm[d]:  # Checks for empty array
        for val in hm[d]:
            new_path = path + [val]
            paths = path_crawler(hm, new_path, paths)
    else:
        paths += [path]
    return paths


def path_generator(paths=[]):
    """Given a list of paths, returns a list of Path with Nodes"""
    return [Path(nodes) for nodes in paths]


if __name__ == "__main__":
    hunters = [Hunter('Dutch'), Hunter('Dylan')]
    paths = path_generator(path_crawler(hunting_map, path=['A']))
    runner = Runner(hunters=hunters, paths=paths)
    runner.run()
    if args.first:
        pprint(runner.stats[0])
    else:
        pprint(runner.stats)
