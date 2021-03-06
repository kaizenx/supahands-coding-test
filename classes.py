import json
import networkx as nx

class Hunter:
  def __init__(self, name, start_node, max_stamina=3):
    """
    Parameters
    ----------
    name: str
      name of the hunter
    start_node: str
      name of start node
    max_stamina: int, default: 3
      maximum stamina allowed
    """
    self.name = name
    self.start_node = start_node
    self.node = start_node
    self.stamina = max_stamina
    self.max_stamina = max_stamina
    self.actions = {
      'travel': -1,
      'group': -1,
      'solo': -2,
      'rest': 2,
    }

  def action(self, action_type, action_param=''):
    """
    Emulates action done by hunter
    Parameters
    ----------
    action_type: {'travel', 'group', 'solo', 'rest'}
      type of action to be carried out
    action_param: str, default: ''
      parameter input for action if applicable
      eg: node name for travel action
    """
    if (action_type not in self.actions):
      raise Exception("Action type must be one of {'travel', 'group', 'solo', 'rest'}")
    new_stamina = self.stamina + self.actions[action_type]
    if (new_stamina < 0):
      raise Exception('Stamina cannot be lower than 0.')
    if (new_stamina > self.max_stamina):
      new_stamina = self.max_stamina
    if (action_type == 'travel'):
      self.node = action_param
    self.stamina = new_stamina

  def reset(self):
    """
    Resets hunter attributes to their default value
    """
    self.stamina = self.max_stamina
    self.node = self.start_node

class Jungle:
  def __init__(self, hunting_map, start_node, end_node):
    """
    Parameters
    ----------
    hunting_map: dict
      dictionary of adjacency lists
    start_node: str
      name of start node
    end_node: str
      name of end node
    """
    if (start_node not in hunting_map):
      raise Exception('Start node must be in hunting map.')
    if (end_node not in hunting_map):
      raise Exception('End node must be in hunting map.')
    self.map = self.create_network(hunting_map)
    self.start_node = start_node
    self.end_node = end_node
  
  def create_network(self, hunting_map):
    """
    Returns a NetworkX directed graph
    Parameters
    ----------
    hunting_map: dict
    """
    G = nx.DiGraph()
    for source in hunting_map:
      for destination in hunting_map[source]:
        G.add_edge(source, destination)
    return G

  def reset(self, hunter=2, boar=3):
    """
    Resets network attributes to their default value
    Parameters
    ----------
    hunter: int, default: 2
      total number of hunters
    boar: int, default: 3
      initial number of boars
    """
    nodes = list(self.map.nodes)
    attributes = {node: {'hunter': 0, 'boar': 3} for node in nodes}
    attributes[self.start_node]['hunter'] = hunter # initialize no. of hunters in the first node
    nx.set_node_attributes(self.map, attributes)

  def generate_paths(self):
    """
    Returns a list of every path in the jungle
    """
    return list(nx.all_simple_paths(self.map, self.start_node, self.end_node))

  def hunter_count(self, node):
    """
    Returns an integer for hunter count in given node
    Parameters
    ----------
    node: str
    """
    if (node not in self.map):
      raise Exception('Node must be in hunting map.')
    return self.map.nodes[node]['hunter']
  
  def boar_count(self, node):
    """
    Returns an integer for boar count in given node
    Parameters
    ----------
    node: str
    """
    if (node not in self.map):
      raise Exception('Node must be in hunting map.')
    return self.map.nodes[node]['boar']
  
  def boar_caught(self, node):
    """
    Updates the boar count in given node
    Parameters
    ----------
    node: str
    """
    if not self.boar_count(node):
      raise Exception('No boars left in node {}'.format(node))
    self.map.nodes[node]['boar'] -= 1
  
  def hunter_move(self, current_node, next_node):
    """
    Updates the number of hunters in affected nodes
    Parameters
    ----------
    current_node: str
    next_node: str
    """
    self.map.nodes[current_node]['hunter'] -= 1
    self.map.nodes[next_node]['hunter'] += 1

class Simulator:
  def __init__(self, hunters, jungle, json):
    """
    Parameters
    ----------
    hunters: list of Hunter
    jungle: Jungle
    json: str
    """
    self.hunters = hunters
    self.jungle = jungle
    self.json = json
    self.results = []
    self.turn = 0
    self.catch = 0

  def in_choppa(self):
    """
    Returns a boolean
    True if all hunters are in the end node
    """
    return len(self.hunters) == self.jungle.hunter_count(self.jungle.end_node)

  def reset(self):
    """
    Resets the simulator count and catch
    """
    self.turn = 0
    self.catch = 0
    self.jungle.reset()
    for hunter in self.hunters:
      hunter.reset()

  def next_node(self, path, node):
    """
    Returns a string for name of next node
    Parameters
    ----------
    path: list of str
    node: str
    """
    if (node not in path):
      raise Exception('Node must be in path.')
    current_index = path.index(node)
    return path[current_index + 1]

  def boar_caught(self, node):
    """
    Updates the catch and no. of boars left in the node
    Parameters
    ----------
    node: str
    """
    self.jungle.boar_caught(node)
    self.catch += 1
    
  def same_node(self, node):
    """
    Returns a boolean, True if all hunters are in the node
    Parameters
    ----------
    node: str
    """
    return len(self.hunters) == self.jungle.map.nodes[node]['hunter']

  def append_results(self, path):
    """
    Appends result after each iteration
    Parameters
    ----------
    path: list of str
    """
    self.results.append({'turn': self.turn, 'catch': self.catch, 'path': path})

  def run(self):
    """
    Brains of the whole operation
    """
    # error checking
    if len(self.hunters) < 1:
      raise Exception('At least one hunter is needed.')

    # path generation
    paths = self.jungle.generate_paths()

    # iterate over paths
    for path in paths:
      if (len(path) < 2):
        raise Exception('A path must have at least 2 nodes.')
      self.reset()
      while (not self.in_choppa()):
        self.turn += 1
        for i, hunter in enumerate(self.hunters):
          if (hunter.node == self.jungle.end_node):
            # hunter in choppa
            continue
          if (hunter.stamina == 0):
            # hunter needs rest
            hunter.action('rest')
          elif (self.jungle.boar_count(hunter.node) == 0):
            # no boars
            next_node = self.next_node(path, hunter.node)
            self.jungle.hunter_move(hunter.node, next_node)
            hunter.action('travel', action_param=next_node)
          elif (hunter.stamina >= 2):
            # hunter able to hunt solo
            hunter.action('solo')
            self.boar_caught(hunter.node)
          else:
            if (all([otherHunter.stamina >= 1 for otherHunter in self.hunters]) and
                self.same_node(hunter.node)
            ):
              # hunters able to hunt together
              for hunter in self.hunters:
                hunter.action('group')
              self.boar_caught(hunter.node)
              break
            hunter.action('rest')
          
      self.append_results(path)

    # print results
    for result in self.results:
      print('No. of turns: {}'.format(result['turn']))
      print('No. of catch: {}'.format(result['catch']))
      print('Path: {}\n'.format(result['path']))
    
    # dump to json file if specified
    if (self.json):
      with open(self.json, 'w', encoding='utf8') as output_file:
        json.dump(self.results, output_file)
        print('Results dumped to {}'.format(output_file.name))
