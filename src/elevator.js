const util = require("util");
const Passenger = require("./Passenger");
const { INSPECT_OPTIONS, MAX_FLOOR, MIN_FLOOR } = require("./constants");

const elevatorState = {
  [1]: "UP",
  [-1]: "DOWN"
}

class Elevator {
  constructor() {
    this.currentFloor = 1;
    this.passengerCount = 0;
    this.distance = 0;
    this.direction = 1;
    this.tasks = new Map();

    this.setFloorQueues();
    this.setTasks();
    this.setDirection();
    this.setDistance();
  }

  displayTasks() {
    console.log("##############################################################");
    console.log(
      util.inspect(`남은 작업: ${this.tasks.size}`, INSPECT_OPTIONS),
      util.inspect(this.tasks, INSPECT_OPTIONS),
    );
    console.log("##############################################################");
  }

  displayProcessing(state) {
    console.log(`[${state.padEnd(4, " ")}]: ${this.currentFloor.toString().padStart(2, " ")}층 | 남은 거리: ${this.distance} | 남은 작업수: ${this.tasks.length} | 남은 승객수: ${this.passengerCount}`)
  }

  setFloorQueues() {
    for (let i = MIN_FLOOR; i <= MAX_FLOOR; i++) {
      this.tasks.set(i, []);
    }
  }

  setTasks() {
    this.tasks.get(3).push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
    this.tasks.get(4).push(new Passenger({ currentFloor: 4, targetFloor: 6 }));
    this.tasks.get(5).push(new Passenger({ currentFloor: 5, targetFloor: 2 }));
    this.tasks.get(7).push(new Passenger({ currentFloor: 7, targetFloor: 4 }));
    this.tasks.get(3).push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
  }

  setDirection() {
    const [, queue] = Array.from(this.tasks).find(([, queue]) => queue.length
    );
    this.direction = queue[0].direction;
  }

  setDistance() {
    const queues = Array.from(this.tasks).filter(([, queue]) => queue.length);

    queues.forEach(([, queue]) => {
      queue.forEach(task => {
        const distance = task.targetFloor - task.currentFloor;

        if (this.direction !== task.direction) {
          return;
        }

        this.distance = Math.max(this.distance, Math.abs(distance));
      })
    })
  }

  getHandleableTasks(handleAction) {
    const currentFloorQueue = this.tasks[this[handleAction]];

    return currentFloorQueue?.filter(task => {
      return this.direction === task.direction;
    });
  }

  handleInPassenger() {
    const targets = this.getHandleableTasks("currentFloor");

    this.passengerCount += targets.length;
    this.displayProcessing("IN")
  }

  handleOutPassenger() {
    const targets = this.getHandleableTasks("targetFloor");

    targets.forEach(target => {
      const index = this.tasks.indexOf(target);
      this.tasks.splice(index, 1);
    })

    this.passengerCount -= targets.length;
    this.displayProcessing("OUT")
  }
}

module.exports = { elevatorState, Elevator };