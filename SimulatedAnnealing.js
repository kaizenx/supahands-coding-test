
/*****************************************************************/
/* This solution is utilizing on (Simulated Annealing) Algorithm */
/****************************************************************/

const Tour = require('./Tour')

const Params = {
    MAX_TEMP: 10000,
    MIN_TEMP: 1,
    COOLING_RATE: 0.005
}

class SimulatedAnnealing {

    constructor(theGraph) {
        this.graph = theGraph;
        this.selectedTour = {};
    }

    simulate() {
        let temp = Params.MAX_TEMP;
        let currentTour = new Tour(this.graph);
        currentTour.startTrip();

        let bestTour = new Tour(this.graph)
        bestTour.startTrip();

        while (temp > Params.MIN_TEMP) {
            let newTour = new Tour(this.graph);
            newTour = newTour.changeTourRoute().startTrip();
            let currentEnergy = currentTour.getTotalHunts();
            let newEnergy = currentTour.getTotalHunts();
            if (this.acceptanceProbability(currentEnergy, newEnergy, temp) > Math.random())
                currentTour = newTour;

            if (currentEnergy > bestTour.getTotalHunts())
                bestTour = currentTour

            temp *= 1 - Params.COOLING_RATE;
        }
        this.selectedTour = bestTour;
        return this;
    }

    acceptanceProbability(currentEnergy, newEnergy, temp) {
        if (newEnergy > currentEnergy)
            return 1;
        return Math.exp((currentEnergy - newEnergy) / temp)
    }

    getSelectedTour() {
        return this.selectedTour;
    }

}

module.exports = SimulatedAnnealing
