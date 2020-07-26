class SpawnQueue {

    constructor() {
        this.items = [];
    }

    constructor(SpawnQueue) {
        this.items = SpawnQueue.items;
    }

    enqueue(element) {
        this.items.push(element);
    }

    dequeue() {
        if (this.isEmpty()) {
            console.log("Underflow");
            return 0;
        }
        return this.items.shift();
    }

    peek() {
        if (this.isEmpty()) {
            console.log("No creeps to spawn");
            return 0;
        }
        return this.items[0];
    }

    isEmpty() {
        return this.items.length == 0;
    }
}

module.exports = SpawnQueue;