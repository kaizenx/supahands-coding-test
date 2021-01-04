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
  print(prey)

main()