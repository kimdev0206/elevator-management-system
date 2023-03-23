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
    this.distance = 0;
    this.direction;
    this.tasks = [];

    this.setTasks();
    this.sort();
    this.setDirection();
    this.setDistance();
  }

  displayTasks() {
    console.log(
      util.inspect(`남은 작업: ${this.tasks.length}`, inspectOptions),
      util.inspect(this.tasks, inspectOptions),
      util.inspect(`이동될 거리: ${this.distance}`, inspectOptions)
    );
  }

  setTasks() {
    this.tasks.push(new Passenger({ currentFloor: 1, targetFloor: 10 }));
    this.tasks.push(new Passenger({ currentFloor: 2, targetFloor: 7 }));
    this.tasks.push(new Passenger({ currentFloor: 7, targetFloor: 2 }));
    this.tasks.push(new Passenger({ currentFloor: 1, targetFloor: 5 }));
    this.tasks.push(new Passenger({ currentFloor: 1, targetFloor: 3 }));
  }

  sort() {
    this.tasks.sort((a, b) => a.currentFloor - b.currentFloor
      || a.targetFloor - b.targetFloor
    );
  }

  setDirection() {
    const { currentFloor, targetFloor } = this.tasks[0];
    this.direction = Math.sign(targetFloor - currentFloor);
  }

  setDistance() {
    this.tasks.forEach(task => {
      const distance = task.targetFloor - task.currentFloor;
      const curDirection = Math.sign(distance);

      if (this.direction !== curDirection) {
        return;
      }

      this.currentFloor = Math.min(this.currentFloor, task.currentFloor);
      this.distance = Math.max(this.distance, Math.abs(distance));
    })
  }
}

module.exports = { elevatorState, Elevator };