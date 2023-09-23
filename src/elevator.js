class Elevator {
  static CAPACITY = 5;
  distance = 0;
  direction = 1;
  passengers = [];

  constructor(ID, startFloor, manager) {
    this.ID = ID;
    this.currentFloor = startFloor;
    this.manager = manager;

    this.setDirection();
    this.setDistance();
  }

  getTasksWithSameDirection({ reverse = false }) {
    return this.manager.tasks
      .filter((task) =>
        reverse
          ? this.direction !== task.direction
          : this.direction === task.direction
      )
      .filter((task) =>
        Math.sign(this.direction) > 0
          ? this.currentFloor <= task.currentFloor
          : this.currentFloor >= task.currentFloor
      );
  }

  setDirection() {
    const latestTask = this.manager.tasks[0];

    if (latestTask.currentFloor === this.currentFloor) {
      this.direction = latestTask.direction;
      return;
    }

    this.direction = Math.sign(latestTask.currentFloor - this.currentFloor);
  }

  setDistance() {
    let tasks = this.getTasksWithSameDirection({ reverse: false });

    if (!tasks.length) {
      tasks = this.getTasksWithSameDirection({ reverse: true });
    }

    const leftCapacity = Elevator.CAPACITY - this.passengers.length;
    tasks = tasks.slice(0, leftCapacity - 1);

    let maxDistanceTask;
    for (const task of tasks) {
      const distance = Math.abs(task.targetFloor - task.currentFloor);

      if (this.distance < distance) {
        this.distance = distance;
        maxDistanceTask = task;
      }
    }

    if (this.direction === maxDistanceTask.direction) {
      this.distance += Math.abs(
        this.currentFloor - maxDistanceTask.currentFloor
      );
    }
  }

  getInPassenger() {
    return this.manager.tasks.filter((task) => {
      return (
        this.direction === task.direction &&
        this.currentFloor === task.currentFloor
      );
    });
  }

  getOutPassenger() {
    return this.passengers.filter((passenger) => {
      return (
        this.direction === passenger.direction &&
        this.currentFloor === passenger.targetFloor
      );
    });
  }

  addPassengers() {
    const leftCapacity = Elevator.CAPACITY - this.passengers.length;
    const tasks = this.getInPassenger().slice(0, leftCapacity - 1);

    tasks.forEach((task) => {
      const index = this.manager.tasks.indexOf(task);
      this.manager.tasks.splice(index, 1);
      this.passengers.push(task);
    });

    this.display({ state: "IN" });
  }

  removePassengers() {
    const passengers = this.getOutPassenger();

    passengers.forEach((passenger) => {
      const index = this.passengers.indexOf(passenger);
      this.passengers.splice(index, 1);
    });

    this.display({ state: "OUT" });
  }

  display({ state }) {
    const stateFormat = state.padEnd(4, " ");
    const currentFloorFormat = this.currentFloor.toString().padStart(2, " ");
    const distanceFormat = this.distance.toString().padStart(2, " ");

    console.log(
      `[${this.ID}호기:${stateFormat}]: ${currentFloorFormat}층 | 남은 거리: ${distanceFormat} | 남은 승객수: ${this.passengers.length} | 남은 작업수: ${this.manager.tasks.length}`
    );
  }
}

module.exports = Elevator;
