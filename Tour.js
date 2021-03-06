
class Tour {

    constructor(theGraph) {
        this.prey = 0;
        this.stamina = 3
        this.graph = { ...theGraph }
        this.tripPath = [];
    }

    startTrip(theGraph) {
        let graph = theGraph || this.graph;
        this.tripPath = []
        /* visited contains the amount of boars on each node. */
        let visited = {
            A: 3,
            B: 3,
            C: 3,
            D: 3,
            E: 3,
            F: 3,
            G: 3,
            H: 3,
            I: 3,
            J: 3,
            K: 3
        };
        /* queue contains the next node to explore */
        let queue = [];
        let node = 'A';
        this.tripPath.push(node)
        queue.push(node)
        this.huntRoutine(visited, queue, node)

        while (queue.length != 0) {
            node = queue.pop();
            if (!graph[node] || graph[node].length == 0) break;
            let e = graph[node][0]
            queue.push(e)
            this.tripPath.push(e)
            if (this.stamina < 3) {
                this.restRoutine(visited, queue, e)
            } else {
                this.huntRoutine(visited, queue, e)
            }
        }
        return this;
    }

    restRoutine(visited, queue, e) {
        this.stamina -= 1
        this.stamina += 2;
    }

    huntRoutine(visited, queue, e) {
        this.stamina -= 1

        if (visited[e] == 1) {
            visited[e] = visited[e] - 1;
            this.prey += 1

        } else if (visited[e] >= 2) {
            visited[e] = visited[e] - 2;
            this.prey += 2
        }
    }

    changeTourRoute() {
        let nameArr = Object.entries(this.graph).map(([key, val]) => key)
        let rand = Math.floor(Math.random() * (nameArr.length - 1));
        let nodeTitle = nameArr[rand];
        let edges = this.graph[nodeTitle];

        /*  
        *   When shuffle edges for given node 
        *   it will eventually simulate as if we go to different route when
        *   calling generate method.
        */

        this.graph[nodeTitle] = this.shuffle(edges);
        return this;
    }

    getTotalHunts() {
        return this.prey;
    }

    getTripPath() {
        return this.tripPath;
    }

    shuffle(arr) {
        return [...arr].map((_, i, orgArr) => {
            var rand = i + (Math.floor(Math.random() * (orgArr.length - i)));
            [orgArr[rand], orgArr[i]] = [orgArr[i], orgArr[rand]]
            return orgArr[i]
        })
    }
}

module.exports = Tour




