"""This module is responsible to run the
hunting simulation game"""


class Hunter:
    """Encompasses general actions that can be performed
    by hunter and possible actions depending on certain
    conditions"""

    def __init__(self, name):
        self.name = name
        self.stamina = 3
        self.total_boars = 0
        self.current_node = None

    def __repr__(self):
        return f'Hunter: {self.name}'

    def rest(self):
        """Return 2 stamina when resting"""

        self.stamina += 2

    def travel(self):
        """Decrease 1 stamina when travelling,
        decrease hunters in node by 1 and increase
        hunter in next node by 1"""

        self.stamina -= 1
        self.current_node.hunters -= 1
        self.current_node = self.current_node.next
        if self.current_node is not None:
            self.current_node.hunters += 1

    def solo_hunt(self):
        """Solo hunt decreases 2 stamina"""

        self.stamina -= 2
        self.current_node.boars -= 1

    def group_hunt(self):
        """Group hunt decreases 1 stamina"""

        self.stamina -= 1
        self.current_node.boars -= 1

    def stamina_check(self, min):
        """Check if stamina is sufficient for
        action which is intended to be performed"""

        if self.stamina < min:
            self.rest()
            return False
        return True

    def action(self):
        """If-Else structure to cater for several conditions, hunters can
        move freely and stamina levels are decreased accordingly based on
        the type of hunt being performed"""

        if self.current_node.boars == 1 and self.current_node.hunters > 1:
            if self.stamina_check(1):
                self.travel()

        elif self.current_node.boars == 3 and self.current_node.hunters == 1:
            if self.stamina_check(2):
                self.solo_hunt()
                self.total_boars += 1

        elif self.current_node.boars == 3 and self.current_node.hunters > 1:
            if self.stamina_check(1):
                self.group_hunt()
                self.total_boars += 1

        elif self.current_node.boars == 2 and self.current_node.hunters > 1:
            if self.stamina_check(1):
                self.group_hunt()
                self.total_boars += 1

        elif self.current_node.boars >= 1 and self.current_node.hunters == 1:
            if self.stamina_check(2):
                self.solo_hunt()
                self.total_boars += 1

        elif self.current_node.boars == 0:
            if self.stamina_check(1):
                self.travel()


class Hunt:
    """Iterates over possible routes and generates
    stats of the hunting game"""

    def __init__(self, routes=[], hunters=[]):
        self.hunters = hunters
        self.routes = routes
        self.turns = 0

    def hunt(self):
        """Iterates through routes and runs the
        hunting simulation"""

        for route in self.routes:
            self.initiate(route)
            while self.end_check() != 2:
                for hunter in self.hunters:
                    if hunter.current_node.data == "K":
                        continue
                    else:
                        hunter.action()
                        self.turns += 1
            print(route)
            self.stats()
            print("Total turns:", self.turns, "\n")

    def stats(self):
        """Compute total boars hunted"""

        total_boars = 0
        for hunter in self.hunters:
            total_boars += hunter.total_boars
        print("Total Boars Bagged:", total_boars)

    def initiate(self, path):
        """Reset general values after each route has
        been hunted in"""

        for hunter in self.hunters:
            hunter.current_node = path.head
            hunter.stamina = 3
            hunter.total_boars = 0
            self.turns = 0
            hunter.current_node.hunters += 1

    def end_check(self):
        """Check if both hunters are
        in Choppa"""

        in_choppa = 0
        for hunter in self.hunters:
            if hunter.current_node.data == 'K':
                in_choppa += 1
        return in_choppa
