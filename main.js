
const SimulatedAnnealing = require('./SimulatedAnnealing')

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
};
// console.log(hunting_map);
// console.log(prey);


let tourSimulation = new SimulatedAnnealing(hunting_map)
  .simulate();

let tour = tourSimulation.getSelectedTour();

let selectTourPath = tour.getTripPath();
let numberOfBoars = tour.getTotalHunts();

console.log(numberOfBoars)
console.log(selectTourPath.join(" "))