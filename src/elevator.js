const util = require("util");
const { INSPECT_OPTIONS } = require("./constants");

class Elevator {
  static CAPACITY = 5;

  constructor(ID, manager) {
    this.ID = ID;
    this.manager = manager;

    this.currentFloor = 5;
    this.distance = 0;
    this.direction = 1;
    this.passengers = [];

    this.setDirection();
    this.setDistance();
  }

  getTasksWithDirection() {
    return this.manager.tasks
      .filter(task => this.direction === task.direction)
      .filter(task => Math.sign(this.direction) > 0
        ? (this.currentFloor <= task.currentFloor)
        : (this.currentFloor >= task.currentFloor));
  }

  setDirection() {
    const latestTask = this.manager.tasks[0];
    this.direction = Math.sign(latestTask.currentFloor - this.currentFloor);
  }

  setDistance() {
    const leftCapacity = Elevator.CAPACITY - this.passengers.length;
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
    return this.manager.tasks.filter(task => {
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
    const leftCapacity = Elevator.CAPACITY - this.passengers.length;
    const tasks = this.getInPassenger().slice(0, leftCapacity - 1);

    tasks.forEach(task => {
      const index = this.manager.tasks.indexOf(task);
      this.manager.tasks.splice(index, 1);
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

  displayHandling(state) {
    console.log(`[E${this.ID}:${state.padEnd(4, " ")}]: ${this.currentFloor.toString().padStart(2, " ")}층 | 남은 거리: ${this.distance} | 남은 승객수: ${this.passengers.length} | 남은 작업수: ${this.manager.tasks.length}`)
  }
}

module.exports = Elevator;