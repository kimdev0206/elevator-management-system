const util = require("util");
const Passenger = require("./Passenger");
const { INSPECT_OPTIONS } = require("./constants");

const elevatorDirection = {
  [1]: "UP",
  [-1]: "DOWN"
}

class ElevatorManager {
  static CAPACITY = 5;

  constructor() {
    this.currentFloor = 5;
    this.distance = 0;
    this.direction = 1;

    this.passengers = [];
    this.tasks = [];

    this.setTasks();
    this.setDirection();
    this.setDistance();
  }

  displayTasks() {
    console.log("##############################################################");
    console.log(
      util.inspect(`남은 작업: ${this.tasks.length}`, INSPECT_OPTIONS),
      util.inspect(this, INSPECT_OPTIONS),
      // util.inspect(this.tasks, INSPECT_OPTIONS),
    );
    console.log("##############################################################");
  }

  displayHandling(state) {
    console.log(`[${state.padEnd(4, " ")}]: ${this.currentFloor.toString().padStart(2, " ")}층 | 남은 거리: ${this.distance} | 남은 승객수: ${this.passengers.length} | 남은 작업수: ${this.tasks.length}`)
  }

  setTasks() {
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
    this.tasks.push(new Passenger({ currentFloor: 4, targetFloor: 6 }));
    this.tasks.push(new Passenger({ currentFloor: 5, targetFloor: 2 }));
    this.tasks.push(new Passenger({ currentFloor: 7, targetFloor: 4 }));
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
  }

  getTasksWithDirection() {
    return this.tasks
      .filter(task => this.direction === task.direction)
      .filter(task => Math.sign(this.direction) > 0
        ? (this.currentFloor <= task.currentFloor)
        : (this.currentFloor >= task.currentFloor));
  }

  setDirection() {
    this.direction = Math.sign(this.tasks[0].currentFloor - this.currentFloor);
  }

  setDistance() {
    const leftCapacity = ElevatorManager.CAPACITY - this.passengers.length;
    const tasks = this.getTasksWithDirection().slice(0, leftCapacity - 1);

    let maxDistanceTask;
    for (const task of tasks) {
      const distance = Math.abs(task.targetFloor - task.currentFloor);

      if (this.distance < distance) {
        this.distance = distance;
        maxDistanceTask = task;
      }
    }

    if (this.direction === maxDistanceTask.direction) {
      this.distance += Math.abs(this.currentFloor - maxDistanceTask.currentFloor);
    }
  }

  getInPassenger() {
    return this.tasks.filter(task => {
      return (this.direction === task.direction)
        && (this.currentFloor === task.currentFloor);
    });
  }

  getOutPassenger() {
    return this.passengers.filter(passenger => {
      return (this.direction === passenger.direction)
        && (this.currentFloor === passenger.targetFloor);
    });
  }

  handleInPassenger() {
    const leftCapacity = ElevatorManager.CAPACITY - this.passengers.length;
    const tasks = this.getInPassenger().slice(0, leftCapacity - 1);

    tasks.forEach(task => {
      const index = this.tasks.indexOf(task);
      this.tasks.splice(index, 1);
      this.passengers.push(task);
    });

    this.displayHandling("IN");
  }

  handleOutPassenger() {
    const passengers = this.getOutPassenger();

    passengers.forEach(passenger => {
      const index = this.passengers.indexOf(passenger);
      this.passengers.splice(index, 1);
    })

    this.displayHandling("OUT");
  }
}

module.exports = { elevatorDirection, ElevatorManager };