from maps.map import HuntingMap
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
  bestRoute = ''
  bestDutchRoute = ''
  bestDutchScore = 0
  bestDylanRoute = ''
  bestDylanScore = 0

  print("===================== original map & prey =======================")
  print(hunting_map)
  print(prey)
  print("=================================================================")

  print("===================== Generate possible route =======================")
  Hm = HuntingMap(hunting_map)
  possiblePath = Hm.getVectorMap(['A'])
  print("Completed!")
  print("=====================================================================")
  print()
  print("===================== Generate possible route combination =======================")
  Strategies = Hm.getPossibleSplitPath(possiblePath)
  print("Generated!")
  print("=================================================================================")
  print()
  print("===================== Hunting start ==========================")
  for idx, item in enumerate(Strategies):
    fruits = Hm.journeyStart(item)
    if fruits[2] > prey:
        bestRoute = Hm.getRouteInString(fruits[3])
        prey = fruits[2]
        bestDutchRoute = Hm.getRouteInString(item['Dutch'])
        bestDylanRoute = Hm.getRouteInString(item['Dylan'])
        bestDutchScore = fruits[0]
        bestDylanScore = fruits[1]

    print('Dutch route : ', Hm.getRouteInString(item['Dutch']))
    print('Dutch boar : ', fruits[0])
    print('Dylan route : ', Hm.getRouteInString(item['Dylan']))
    print('Dylan boar : ', fruits[1])
    print('Route mapping : ', Hm.getRouteInString(fruits[3]))
    print('Total boar : ', fruits[2])
    print()
  print("===================== Hunting end ============================")
  print()
  print("============================ Top Score ================================== ")
  print("Best Total Prey : ", prey, " boar")
  print("Best route : ", bestRoute)
  print("Dutch best route : ", bestDutchRoute)
  print("Dutch best score : ", bestDutchScore, " boar")
  print("Dylan best route : ", bestDylanRoute)
  print("Dylan best score : ", bestDylanScore, " boar")
  print("========================================================================= ")
  print()


main()