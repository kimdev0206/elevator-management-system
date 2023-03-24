const util = require("util");
const Passenger = require("./Passenger");
const { inspectOptions } = require("./utils");

const elevatorState = {
  [1]: "UP",
  [-1]: "DOWN"
}

class Elevator {
  constructor() {
    this.currentFloor = 1;
    this.passengerCount = 0;
    this.distance = 0;
    this.direction;
    this.tasks = [];

    this.setTasks();
    this.sort();
    this.setDirection();
    this.setDistance();
  }

  displayTasks() {
    console.log("##############################################################");
    console.log(
      util.inspect(`남은 작업: ${this.tasks.length}`, inspectOptions),
      util.inspect(this.tasks, inspectOptions)
    );
    console.log("##############################################################");
  }

  displayProcessing(state) {
    console.log(`[${state.padEnd(4, " ")}]: ${this.currentFloor.toString().padStart(2, " ")}층 | 남은 거리: ${this.distance} | 남은 작업수: ${this.tasks.length} | 남은 승객수: ${this.passengerCount}`)
  }

  setTasks() {
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
    this.tasks.push(new Passenger({ currentFloor: 4, targetFloor: 6 }));
    this.tasks.push(new Passenger({ currentFloor: 5, targetFloor: 2 }));
    this.tasks.push(new Passenger({ currentFloor: 7, targetFloor: 4 }));
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
  }

  sort() {
    this.tasks.sort((a, b) => a.currentFloor - b.currentFloor
      || a.targetFloor - b.targetFloor
    );
  }

  setDirection() {
    this.direction = this.tasks[0].direction;
  }

  setDistance() {
    this.tasks.forEach(task => {
      const distance = task.targetFloor - task.currentFloor;

      if (this.direction !== task.direction) {
        return;
      }

      this.distance = Math.max(this.distance, Math.abs(distance));
    })
  }

  getHandleableTasks(handleAction) {
    return this.tasks.filter(task => {
      return (this.direction === task.direction)
        && (this.currentFloor === task[handleAction]);
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