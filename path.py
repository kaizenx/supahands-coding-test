"""A module to generate paths and return a list,
list is converted to Nodes to facilitate traversal.
Initially wanted to use list itself but led to too
many loop structures."""

class Path:
    """Implementing Depth first Search to find possible
    paths"""
    def __init__(self, graph):
        self.graph = graph

    def find_path(self, start, end, path=[]):
        """Basically Back tracing to find suitable
        paths"""

        path = path + [start]
        if start == end:
            return [path]
        paths = []
        for node in self.graph[start]:
            if node not in path:
                new_paths = self.find_path(node, end, path)
            for new_path in new_paths:
                paths.append(new_path)
        return paths


class Node:
    """Giving attributes to Node"""
    def __init__(self, data):
        self.data = data
        self.boars = 3
        self.hunters = 0
        self.next = None

    def __repr__(self):
        return f'Node: {self.data}'


class LinkedList:
    """Creating the linked list from possible
    routes"""
    def __init__(self, nodes=[]):
        self.head = None
        if nodes is not None:
            node = Node(data=nodes.pop(0))
            self.head = node
            for elem in nodes:
                node.next = Node(data=elem)
                node = node.next

    def __repr__(self):
        node = self.head
        nodes = []
        while node is not None:
            nodes.append(node.data)
            node = node.next
        nodes.append("None")
        return " -> ".join(nodes)

