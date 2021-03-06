from classes import Hunter, Jungle, Simulator
import argparse

def init_parser():
  parser = argparse.ArgumentParser(description='Hunting simulator for Supahands coding test.')
  parser.add_argument(
    '--json',
    metavar='path',
    type=str,
    const='dump.json',
    nargs='?',
    help='dump results into a json file',
  )
  return parser

def main():
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
  start_node = 'A'
  end_node = 'K'

  parser = init_parser()
  args = parser.parse_args()

  dutch = Hunter('Dutch', start_node=start_node)
  dylan = Hunter('Dylan', start_node=start_node)
  jungle = Jungle(hunting_map, start_node=start_node, end_node=end_node)
  simulator = Simulator([dutch, dylan], jungle, args.json)

  simulator.run()

if __name__ == '__main__':
  main()