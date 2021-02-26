from collections import defaultdict
import copy
from itertools import product


# Various function for an agent provide abstractoins
class Hunter:
    HUNT = 1
    MOVE = 2
    REST = 3

    def __init__(self, stamina=3):
        self.stamina = stamina
       
    # Easier if having the world to manipulate agent, agent do not need understanding here. 
    def move(self):
        if self.stamina <= 0:
            raise Exception(f"Stamina is {self.stamina}")
        self.stamina -= 1

    def hunt(self, boars, partnered=False):
        stamina = self.stamina
        if not boars:
            raise Exception("No boars available")
        if partnered:
            stamina -= 1
        else:
            stamina -= 2
        self.stamina = stamina

    def rest(self):
        stamina = self.stamina + 2
        if stamina > 3:
            self.stamina = 3
        else:
            self.stamina = stamina

    def has_stamina(self, action, partnered=False):
        if partnered:
            hunt_energy = 1
        else:
            hunt_energy = 2
        energy_const = { self.HUNT: hunt_energy, self.MOVE: 1, self.REST: 0 }
        energy = energy_const[action]
        if self.stamina >= energy:
            return True
        return False


class GeneratePath:
    def __init__(self, maps):
        self.maps = maps
        self.paths = []

    # Generate 1 path at a time
    def walk(self, node, l=[]):
        # because python pass list by reference. I want to keep this pristine
        l = copy.deepcopy(l)
        l.append(node)
        if not self.maps[node]:
            self.paths.append(l)
        for n in self.maps[node]:
            self.walk(n, l=l)


class Hunting:

    def __init__(self, paths):
        self.paths = paths

    def run(self):
        results = []
        # this should have path and included form on the paths. 
        # A product should have generate all variation of the fork or no fork. 
        for path_1, path_2 in product(self.paths, repeat=2):
            hunted, paths = self.hunts(path_1, path_2)
            results.append((hunted, paths, path_1, path_2))
        return results

    # manipulate agent here. make things easier in term of abstraction
    def hunts(self, path_1, path_2):
        boars_pop = defaultdict(lambda: 3)
        hunter_1 = Hunter()
        hunter_2 = Hunter()
        iterations = max(len(path_1), len(path_2))
        ptr_1 = 0
        ptr_2 = 0
        hunted = 0
        done = False
        paths = []
        # Assume agent move independently. Make tracking easy. 
        while not done:
            partnered = False
            node_1 = self.get_node(path_1, ptr_1)
            node_2 = self.get_node(path_2, ptr_2)
            if node_1 == node_2:
                partnered = True
            move_1, hunt_1 = self.move(hunter_1, node_1, boars_pop[node_1], partnered)
            if move_1:
                paths.append(node_1)
                ptr_1 += 1
            move_2, hunt_2 = self.move(hunter_2, node_2, boars_pop[node_2], partnered)
            if move_2:
                paths.append(node_2)
                ptr_2 += 1
           
            if partnered:
                if hunt_1:
                    boars_pop[node_1] -= 1
                    hunted += 1
            else:
                if hunt_1:
                    boars_pop[node_1] -= 1
                    hunted += 1
                if hunt_2:
                    boars_pop[node_2] -= 1
                    hunted += 1
            done = (ptr_1 >= len(path_1)) and (ptr_2 >= len(path_2))
        return hunted, paths

    # An abstraction what an agent can do and should do. 
    # We prioritize hunting over moving
    def move(self, hunter, node, boars_pop, partnered):
        move_next = False
        hunt_next = False
        if not node:
            return move_next, hunt_next
        if boars_pop:
            if hunter.has_stamina(Hunter.HUNT, partnered=partnered):
                hunter.hunt(boars_pop, partnered=partnered)
                hunt_next = True
            else:
                hunter.rest()
        else:
            if hunter.has_stamina(Hunter.MOVE, partnered=partnered):
                hunter.move()
                move_next = True
            else:
                hunter.rest()
        return move_next, hunt_next

    def get_node(self, path, ptr):
        try:
            return path[ptr]
        except:
            return None

                
def main():
  prey = 0
  hunting_map = {
    'A':['B','C','K'],
    'B':['D','E'],
    'C':['E','G','H'],
    'D':['E','F'],
    'E':['G','I','F'],
    'F':['I','J'],
    'G':['I','K'],
    'H':['I','F'],
    'I':['K'],
    'J':['K'],
    'K':[]
  }
  print(hunting_map)
  generator = GeneratePath(hunting_map)
  # assume all is potential start. 
  for key in hunting_map:
      generator.walk(key)
  hunting = Hunting(generator.paths)
  results = hunting.run()
  total_amt = []
  for amt, join_path, path_1, path_2 in results:
      total_amt.append(amt)
  # Get the maximum path where it get prey
  prey = max(total_amt)
  print(prey)
  min_len = 1024
  min_path = None
  # get the min step path where it have maximum prey
  for amt, join_path, path_1, path_2 in results:
      
      if amt == prey:
          if min_len > len(join_path):
              min_path = join_path
              min_len = len(join_path)
  print("".join(min_path))


main()
