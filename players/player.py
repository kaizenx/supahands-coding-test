import enum

class player:
    def __init__(self, nameOfPlayer, route):
        """
        Player class that consist of metadata:
            name,
            stamina,
            number of bagged boar,
            assigned route,
            current node in route,
            index of the node in route
        :param nameOfPlayer: String
        :param route: array of String example : ['A', 'B', 'C',...]
        """
        self.name = nameOfPlayer
        self.stamina = 3
        self.boar = 0
        self.route = route
        self.index = 0
        self.node = route[self.index]

    def hunt(self, huntAmount):
        """This is a function of Player hunting base of hunt amount,
            When hunt initiated stamina will reduce base on hun amount,
            boar will increase base on hunt amount
            :return: void
        """
        self.stamina -= huntAmount
        self.boar += huntAmount

    def hasNext(self):
        """
        To perform checking whether player still have next node
        base on route provided.
        :return: boolean
        """
        return self.index + 1 < len(self.route)


    def move(self):
        """
        Player move on to next node is hasNext() return true,
        if True:
            player stamina reduce by 1
            index = index of next node in route
            node = next available node base on index in route
        :return: void
        """
        if self.hasNext():
            self.stamina -= 1
            self.index += 1
            self.node = self.route[self.index]

    def rest(self):
        """
        Player rest state.
        each time calling stamina return 2,
        stamina will cap at 3.
        :return: void
        """
        if self.stamina + 2 > 3:
            self.stamina = 3
        else:
            self.stamina += 2