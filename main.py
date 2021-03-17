from path import Path, LinkedList
from hunt import *

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

path = Path(hunting_map)
paths = path.find_path('A', 'K')
route = [LinkedList(path) for path in paths]
hunters = [Hunter("Dutch"), Hunter("Dylan")]
play = Hunt(route, hunters)
play.hunt()
