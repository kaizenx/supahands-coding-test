def main(time_to_hunt)
  prey = 0
  turns = 24
  hunting_map = {"A":["B","C"],
  "B":["D","E"],
  "C":["E","G","H"],
  "D":["F"],
  "E":["I"],
  "F":["I","J"],
  "G":["I"],
  "H":["I","F"],
  "I":["K"],
  "J":["K"]}
  print(hunting_map)
  print(prey)
end

main(50)