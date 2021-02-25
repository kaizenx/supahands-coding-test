from players.player import player
import enum

class Actions(enum.Enum):
    """
    enum:
    Action state of player's
    """
    rest = 0
    hunt1 = 1
    hunt2 = 2

class HuntingMap:

    def __init__(self, rawMap):
        """
        This is hunting map processing class
        :param rawMap: original hunting map. example : hunting_map = {
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
        """
        self.rawMap = rawMap

    def getVectorMap(self,currPath, vectorMap = []):
        """
        This is a function to generate 2D-array possible route from raw map using Depth First Search method.
        Started from start node and recursively append next possible node until reach 'K' node.
        :param currPath: Start node in array. example : ['A']
        :param vectorMap: an array consist of multiple possible path in array
        :return: 2D-array that consist of all possible path
        """
        lastNode = currPath[-1]
        if lastNode in self.rawMap and lastNode != 'K':
            for node in self.rawMap[lastNode]:
                latestPath = currPath + [node]
                vectorMap = self.getVectorMap(latestPath, vectorMap)
        else:
            vectorMap += [currPath]

        return vectorMap

    def getPossibleSplitPath(self, vectormap):
        """
        This is a function to generate all possible combination of 2 different route in the vector map.
        :param vectormap:  A 2D-array
        :return: an array of dicts, each dicts consist of 'Dutch' & 'Dylan unique route.
        """
        dicts = []
        for i in range(len(vectormap)):
            for j in range(i+1, len(vectormap)):
                dicts.append({'Dutch': vectormap[i], 'Dylan': vectormap[j]})

        return dicts

    def journeyStart(self, route):
        """
        Simulation of hunting process
         :param route: route of 'Dutch' & 'Dylan' in dictionary
         :return: an array of [Dutch hunted boar, Dylan hunted boar, total hunted boar, Route of cross mapping node(with 3 boar) for 'Dutch' & 'Dylan' in dictionary]
        """
        dicts = self.getCrossOverMap(route)
        turns = True
        Dutch = player('Dutch', route['Dutch']) #instantiate 'Dutch' Player
        Dylan = player('Dylan', route['Dylan']) #instantiate 'Dylan' Player

        while(turns):
            if Dutch.node == 'K' and Dylan.node == 'K':
                turns = False #return if both reach 'K' node
            if Dutch.node == Dylan.node:
                act = self.sameNodeAction(Dutch.stamina, Dylan.stamina) # actions get by both player at same node
                if Dutch.node != 'K': #'K' means reach end node, just wait
                    if act[0] == Actions.hunt2 and dicts[Dutch.node] > 1:
                        Dutch.hunt(2) #Dutch can hunt 2 boar if boar's in node is more than 1
                        dicts[Dutch.node] -= 2 #reduce the particular node boar number by 2
                    elif act[0] == Actions.hunt2 and dicts[Dutch.node] > 0:
                        Dutch.hunt(1) #Dutch can hunt 1 boar if boar's in node is more than 0
                        dicts[Dutch.node] -= 1 #reduce the particular node boar number by 1
                    elif act[0] == Actions.hunt1 and dicts[Dutch.node] > 0:
                        Dutch.hunt(1) #Dutch can hunt 1 boar if boar's in node is more than 0 boar, base on action provided
                        dicts[Dutch.node] -= 1 #reduce the particular node boar number by 1
                    else:
                        Dutch.rest() # rest to recover
                if Dylan.node != 'K': #'K' means reach end node, just wait
                    if act[1] == Actions.hunt2 and dicts[Dylan.node] > 1:
                        Dylan.hunt(2) #Dylan can hunt 2 boar if boar's in node is more than 1
                        dicts[Dylan.node] -= 2 #reduce the particular node boar number by 2
                    elif act[1] == Actions.hunt2 and dicts[Dylan.node] > 0:
                        Dylan.hunt(1) #Dylan can hunt 1 boar if boar's in node is more than 0
                        dicts[Dylan.node] -= 1 #reduce the particular node boar number by 1
                    elif act[1] == Actions.hunt1 and dicts[Dylan.node] > 0:
                        Dylan.hunt(1) #Dylan can hunt 1 boar if boar's in node is more than 0 boar, base on action provided
                        dicts[Dylan.node] -= 1 #reduce the particular node boar number by 1
                    else:
                        Dylan.rest() # rest to recover
            else:
                DutchAct = self.individualActions(Dutch.stamina) #Dutch action in unique node
                DylanAct = self.individualActions((Dylan.stamina)) #Dylan action in unique node

                if Dutch.node != 'K': #'K' means reach end node, just wait
                    if DutchAct == Actions.hunt2 and dicts[Dutch.node] > 1:
                        Dutch.hunt(2) #Dutch can hunt 2 boar if boar's in node is more than 1
                        dicts[Dutch.node] -= 2 #reduce the particular node boar number by 2
                    else:
                        Dutch.rest() #rest to recover
                if Dylan.node != 'K': #'K' means reach end node, just wait
                    if DylanAct == Actions.hunt2 and dicts[Dylan.node] > 1:
                        Dylan.hunt(2) #Dylan can hunt 2 boar if boar's in node is more than 1
                        dicts[Dylan.node] -= 2 #reduce the particular node boar number by 2
                    else:
                        Dylan.rest() #rest to recover

            Dutch.move() #Dutch move to next node
            Dylan.move() #Dylan move to next node
        return [Dutch.boar, Dylan.boar, Dutch.boar + Dylan.boar, dicts]

    def getCrossOverMap(self, route):
        """
        This is a function of getting both 'Dutch' & 'Dylan' crossover node & generate a route map.
        each node in the map consist 3 boar.
        :param route: route of 'Dutch' & 'Dylan' in dictionary
        :return: Route of cross mapping node(with 3 boar) for 'Dutch' & 'Dylan' in dictionary
        """
        map = {}
        for idx,item in enumerate(route['Dutch']):
            if item not in map:
                map[item] = 3
        for idxs, items in enumerate(route['Dylan']):
            if items not in map:
                map[items] = 3
        return map

    def isAtSameNode(self, DutchNode, DylanNode ):
        """
        Function to check whether 'Dutch' & 'Dylan' is in the same node
        :param DutchNode: int
        :param DylanNode: int
        :return: boolean
        """
        return DutchNode == DylanNode

    def individualActions(self, Stamina):
        """
        Function of assigning action of a player, base on its available stamina
        :param Stamina: int
        :return: enum Action state
        """
        if Stamina == 3:
            #if individual hunting in a unique node, hunting must be spent 2 stamina and get 2 boar
            Actions.hunt2
        elif Stamina == 2:
            #if stamina is only left 2, rest is initiated since 1 stamina require to move on next node
            Actions.rest
        else:
            #just rest
            return Actions.rest

    def getRouteInString(self, route):
        """
        Function to generate string base on array items
        :param route: array []
        :return: string
        """
        ret = ''
        for idx, node in enumerate(route):
            ret += node + " "

        return ret.strip()

    def sameNodeAction(self, DutchStamina, DylanStamina):
        """
        Function to assign actions of both player base on their stamina
        :param DutchStamina: int
        :param DylanStamina: int
        :return: a tuple of each player's action. example (Dutch action, Dylan action)
        """
        if DutchStamina == 3 and DylanStamina == 3:
            # if both player stamina are 3 then both can hunt 2 boar
            return (Actions.hunt2,Actions.hunt2)
        elif DutchStamina == 2 and DylanStamina == 2:
            # if both player stamina are 2 then both can hunt 1 boar
            return (Actions.hunt1,Actions.hunt1)
        elif DutchStamina == 1 and DylanStamina == 1:
            # if both player stamina are 1 then both rest
            return (Actions.rest,Actions.rest)
        elif (DutchStamina == 3 and DylanStamina == 2) or (DutchStamina==2 and DylanStamina == 3):
            # if both player are having 2 & 3 or vice versa stamina, player with 3 stamina can hunt 2 boar and another player hunt 1 boar
            if DutchStamina == 3:
                return (Actions.hunt2,Actions.hunt1)
            else:
                return (Actions.hunt1,Actions.hunt2)
        elif (DutchStamina == 3 and DylanStamina == 1) or (DutchStamina==1 and DylanStamina == 3):
            # if both player are having 1 & 3 or vice versa stamina, player with 3 stamina hunt 2 boar and another player rest
            if DutchStamina == 3:
                return (Actions.hunt2,Actions.rest)
            else:
                return (Actions.rest,Actions.hunt2)
        elif (DutchStamina == 2 and DylanStamina == 1) or (DutchStamina == 1 and DylanStamina == 2):
            # if both player are having 1 & 2 or vice versa stamina, player with 2 stamina hunt 1 boar and another player rest
            if DutchStamina == 2:
                return (Actions.hunt1,Actions.rest)
            else:
                return(Actions.rest,Actions.hunt1)
        else:
            # both just rest
            return (Actions.rest,Actions.rest)

