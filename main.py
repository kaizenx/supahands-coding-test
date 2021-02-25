import copy


class Constants:
    """
    I don't think its needed for a project of this scale, but its the "right" way of doing this and I'm, a good boy
    I would normally put these in a separate constants.py file, but I want to keep the entire solution in one file so yeah
    """
    DEFAULT_STAM = 3
    DEFAULT_BOAR = 3
    DEFAULT_STAM_REGEN = 2
    GROUP_KILL_STAM_DRAIN = 1
    SOLO_KILL_STAM_DRAIN = 2


class Intent:
    """
    Utility class with a few flags for determining hunter actions
    """
    REST = 0
    HUNT_SOLO = 1
    HUNT_GROUP = 2
    MOVE = 3


class Node:
    """
    Represents each node on the map, along with some useful methods
    """

    def __init__(self, idx):
        self._idx = idx  # index of the node in an adjacency list representation of the map (which is a graph)
        self.boars = Constants.DEFAULT_BOAR
        self.active_players = []

    def __eq__(self, other):
        if isinstance(other, Node):
            return self._idx == other._idx
        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def get_alphabetical_representation(self):
        """
        Returns the original alphabet representing this node
        """
        return chr(self._idx + 65)

    def boar_hunted(self):
        self.boars -= 1

    def has_game(self):
        return self.boars > 0

    def player_entered(self, player):
        self.active_players.append(player)

    def player_exiting(self, player):
        self.active_players.remove(player)

    def has_multiple_active_players(self):
        return len(self.active_players) > 1

    def group_kill_possibility(self, player):
        """
        For a player to find out if someone else can perform a group kill with them
        """
        for hunter in self.active_players:
            if player != hunter and hunter.stamina >= Constants.GROUP_KILL_STAM_DRAIN:
                return True
        return False


class Hunter:
    """
    Represents the player in this program.
    """

    def __init__(self, name, path):
        self.name = name
        self.path = path  # list of nodes representing the path this hunter will take
        self.stamina = Constants.DEFAULT_STAM
        self.cur_node_idx = 0
        self.get_cur_node().player_entered(self)

    def __eq__(self, other):
        if isinstance(other, Hunter):
            return self.name == other.name
        return False

    def __ne__(self, other):
        return not self.__eq__(other)

    def reduce_stamina(self, n):
        self.stamina = (self.stamina - n) % Constants.DEFAULT_STAM

    def increase_stamina(self, n):
        self.stamina = (self.stamina + n) % Constants.DEFAULT_STAM

    def get_cur_node(self):
        return self.path[self.cur_node_idx]

    def rest(self):
        self.increase_stamina(Constants.DEFAULT_STAM_REGEN)

    def in_the_choppa(self):
        """
        To know if they listened to Arnold and GOT TO THE CHOPAAA
        """
        return self.get_cur_node() == self.path[-1] and not self.get_cur_node().has_game()

    def hunt_solo(self):
        self.reduce_stamina(Constants.SOLO_KILL_STAM_DRAIN)

    def hunt_group(self):
        self.reduce_stamina(Constants.GROUP_KILL_STAM_DRAIN)

    def traverse(self):
        """
        Move on to the next node
        """
        self.get_cur_node().player_exiting(self)
        self.cur_node_idx += 1
        self.get_cur_node().player_entered(self)
        self.reduce_stamina(1)

    def can_group_hunt(self):
        if self.get_cur_node().has_game() and self.get_cur_node().group_kill_possibility(
                self) and self.stamina >= Constants.GROUP_KILL_STAM_DRAIN:
            return True
        return False

    def can_solo_hunt(self):
        if self.get_cur_node().has_game() and self.stamina >= Constants.SOLO_KILL_STAM_DRAIN:
            return True
        return False

    def play_turn(self):
        """
        This is called for the hunter each turn for them to handle their own logic, and return an Intent Flag
        representing what they want to do that turn

        This can be modified ofc for different behaviors
        """
        if self.can_group_hunt():
            return Intent.HUNT_GROUP
        elif self.can_solo_hunt():
            return Intent.HUNT_SOLO
        elif not self.get_cur_node().has_game() and self.stamina >= Constants.GROUP_KILL_STAM_DRAIN and not self.in_the_choppa():
            return Intent.MOVE
        else:
            return Intent.REST


class Map:
    """
    Represents the game world
    """

    def __init__(self, raw_hunting_map):
        self.adjacency_list = self._convert_to_adjacency_list(raw_hunting_map)
        self.nodes = [Node(idx) for idx in range(len(self.adjacency_list))]

    def _convert_to_adjacency_list(self, raw_hunting_map):
        """
        converts the raw representation to an adjacency list

        assumes that nodes are alphabets starting from 'A'
        """
        adjacency_list = [] * len(raw_hunting_map)
        for key in raw_hunting_map:
            adjacency_list.append([])
            for adjacent_vertex in raw_hunting_map[key]:
                adjacency_list[-1].append(ord(adjacent_vertex) - 65)
        return adjacency_list

    def _gen_optimal_path(self, visited):
        """
        This will return to us the path (represented as a list of node indices) that given the current state of
        the "visited" list, maximises the number of new nodes visited.

        The path will start from node "A" and end with node "K"

        The algo works using BFS
        """
        queue = [(0, visited[0], [self.nodes[0]])]

        best_path = queue[0]

        while len(queue) > 0:
            vertex, n_unique_nodes, path = queue.pop()

            if n_unique_nodes > best_path[1] or len(path) > len(best_path[2]):
                best_path = (vertex, n_unique_nodes, path)

            for adjacent_node in self.adjacency_list[vertex]:
                path_copy = copy.copy(path)
                path_copy.append(self.nodes[adjacent_node])
                queue.append((adjacent_node, n_unique_nodes + visited[adjacent_node], path_copy))

        return best_path

    def get_n_paths(self, n):
        """
        Return n paths where the number of unique nodes across paths is maximised

        Called to initialise the paths for the players of the game

        Essentially gives us the path each of the n players can follow to maximise nodes visited, in turm maximising
        boars hunted

        Ofc they path does not have to be the optimal one for board hunting, maybe the players chicken out and wanna
        get out ASAP. That logic can be altered here ofc but I like boar so yeah :p

        """
        visited = [1] * len(self.nodes)  # assign a "score/weight" to each vertex
        paths = []
        for _ in range(n):
            vertex, n_unique_nodes, path = self._gen_optimal_path(visited)
            paths.append(path)
            # for this new path, mark the corresponding nodes as visited, by changing their value to 0
            for node in path:
                visited[node._idx] = 0

        return paths


class Game:
    """
    This will actually setup and run the game, and is in charge of carrying out players intents
    """

    def __init__(self, raw_hunting_map, player_list):
        """
        :param raw_hunting_map: a dict representing an graph, with nodes represented as alphabets from 'A' to 'K'
        ex {'A':['B' ....]}
        :param player_list: list of names (string) representing the players of this game
        """
        self.map = Map(raw_hunting_map)
        # now need to init players with paths
        self.players = [Hunter(name, path) for name, path in
                        zip(player_list, self.map.get_n_paths(len(player_list)))]

        self.kill_count = 0
        self.combined_paths = self._get_combined_paths()

    def _get_combined_paths(self):
        """
        Each players path may not be the same, and the final output requires the final path to be printed onto a
        single line, so this will essentially let us know of all nodes visited sequentially as a whole

        so if the two paths are: ['A', 'B', 'C'] and ['A', 'D', 'C']
        the output will be something like ['A', 'B', 'D', 'C']

        yes I know this function looks ugly I don't like it either
        """
        combined_paths = []
        path_1 = self.players[0].path
        path_2 = self.players[1].path
        for i in range(max(len(path_1), len(path_2))):
            if i < len(path_1) and i < len(path_2):
                if path_1[i] == path_2[i]:
                    combined_paths.append(path_1[i].get_alphabetical_representation())
                else:
                    combined_paths.append(path_1[i].get_alphabetical_representation())
                    combined_paths.append(path_2[i].get_alphabetical_representation())
                continue
            if i < len(path_1):
                combined_paths.append(path_1[i].get_alphabetical_representation())
            if i < len(path_2):
                combined_paths.append(path_2[i].get_alphabetical_representation())

        return combined_paths

    def _game_ended(self):
        for player in self.players:
            if not player.in_the_choppa():
                return False
        return True

    def run(self):
        n_turns = 0
        # main program loop, run until everyone got to the CHOPPAAA
        while not self._game_ended():
            # get each players intent and try to accommodate their request
            for player in self.players:
                intent = player.play_turn()
                if intent == Intent.HUNT_GROUP:
                    # if this guy wants to hunt as a group we will grant this request, perform the group kill
                    # and move on to the next turn, yes I know this won't work if
                    # we have >2 players (we are making a hard assumption
                    # that that is the case), but the requirement is 2 players so yeah
                    for hunter in self.players:
                        hunter.hunt_group()
                    self.players[0].get_cur_node().boar_hunted()
                    self.kill_count += 1
                elif intent == Intent.HUNT_SOLO:
                    player.hunt_solo()
                    self.kill_count += 1
                    player.get_cur_node().boar_hunted()
                elif intent == Intent.REST:
                    player.rest()
                elif intent == Intent.MOVE:
                    player.traverse()
            n_turns += 1


def main():
    prey = 0
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

    # init out game with
    game = Game(hunting_map, ["Dutch", "Dylan"])
    game.run()

    # print the required output
    print(game.kill_count)
    print(game.combined_paths)


if __name__ == '__main__':
    main()
