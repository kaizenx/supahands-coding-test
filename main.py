from pprint import pprint


class Hunter:
    """Hunters

    Was supposed to be rescuing hostages, ended up
    hunting boars instead.
    """

    def __init__(self, name):
        self.name = name
        self.stamina = 3
        self.prey = 0
        self.current_node = None
        self.in_choppa = False
        self.actions = {
            'REST': 2,
            'SOLO_HUNT': -2,
            'GROUP_HUNT': -1,
            'TRAVEL': -1
        }

    def __repr__(self):
        return f'Hunter: {self.name}'

    def rest(self):
        self._set_stamina(self._action('REST'))

    def hunt(self):
        if self.current_node.num_of_hunters > 1:
            # print(f'{self.name} is HUNTING IN GROUP')
            self._set_stamina(self._action('GROUP_HUNT'))
        else:
            # print(f'{self.name} is HUNTING ALONE')
            self._set_stamina(self._action('SOLO_HUNT'))

        self.current_node.boar -= 1
        self.prey += 1

    def travel(self):
        self._set_stamina(self._action('TRAVEL'))
        self.current_node.num_of_hunters -= 1
        self.current_node = self.current_node.next_node
        self.current_node.num_of_hunters += 1
        if self.current_node.next_node is None:
            self.in_choppa = True

    def take_action(self):
        # print(f'{self.name} is ON NODE: {self.current_node}')
        assert self.stamina > 0  # Ensures stamina is always above 0 before an action
        if self.in_choppa:
            # print(f'{self.name} is ON THE CHOPPA')
            return

        if self.stamina <= 1:
            # print(f'{self.name} is RESTING')
            self.rest()
            return

        if self.current_node.boar == 0:
            # print(f'{self.name} is TRAVELLING')
            self.travel()
            return

        if self.current_node.boar > 0:
            self.hunt()
            return

    def _action(self, action):
        return self.actions[action]

    def _set_stamina(self, stamina):
        # Handles stamina overflow
        if (self.stamina + stamina > 3):
            self.stamina = 3
        else:
            self.stamina += stamina


class Runner:
    """Simulation Runner. Accepts a list of Path and Hunters
    and runs the hunting simulation.
    """

    def __init__(self, paths, hunters):
        self.paths = paths
        self.hunters = hunters
        self.turns = 1
        self.stats = []

    def run(self):
        for path in self.paths:
            self._reset_run(path)
            while not self._choppa_check():
                for hunter in self.hunters:
                    hunter.take_action()
                self.turns += 1

            self.stats.append({
                'path': path,
                'hunters': self.hunters,
                'turns': self.turns,
                'total_prey': sum([h.prey for h in self.hunters])
            })

    def _reset_run(self, path):
        self.turns = 1
        for hunter in self.hunters:
            hunter.current_node = path.start
            hunter.current_node.num_of_hunters += 1
            hunter.stamina = 3
            hunter.in_choppa = False
            hunter.prey = 0

    def _choppa_check(self):
        in_choppa = 0
        hunters = len(self.hunters)
        for hunter in self.hunters:
            if hunter.in_choppa:
                in_choppa += 1

        return in_choppa == hunters


class Node:
    """Node object for Hunter to hunt and travese
    """

    def __init__(self, node_id):
        self.node_id = node_id
        self.boar = 3
        self.num_of_hunters = 0
        self.next_node = None

    def __eq__(self, other):
        return self.node_id == other.node_id

    def __repr__(self):
        return f'Node: {self.node_id}'


class Path:
    """Path for the Hunter to travese. Consists of a list of Node(s)

    This is essentially a singly-linked list for the Hunter to traverse.
    """

    def __init__(self, nodes=[]):
        self.start = None
        if nodes:
            node = Node(node_id=nodes.pop(0))  # remove the first one
            self.start = node
            for e in nodes:
                node.next_node = Node(node_id=e)
                node = node.next_node

    def __repr__(self):
        node = self.start
        nodes = []
        while node is not None:
            nodes.append(node.node_id)
            node = node.next_node
        return f'Path: {" -> ".join(nodes)}'


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


def main():
    hunters = [Hunter('Dutch'), Hunter('Dylan')]
    paths = path_generator(path_crawler(hunting_map, path=['A']))
    runner = Runner(hunters=hunters, paths=paths)
    runner.run()
    pprint(runner.stats)


if __name__ == "__main__":
    main()
