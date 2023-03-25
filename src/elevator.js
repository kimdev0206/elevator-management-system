const util = require("util");
const Passenger = require("./Passenger");
const { INSPECT_OPTIONS, MAX_FLOOR, MIN_FLOOR } = require("./constants");

const elevatorDirection = {
  [1]: "UP",
  [-1]: "DOWN"
}

class ElevatorManager {
  static ELEVATOR_CAPACITY = 5;

  constructor() {
    this.currentFloor = 1;
    this.distance = 0;
    this.direction = 1;

    this.passengers = [];
    this.tasks = new Map();

    this.setFloor();
    this.setTasks();
    this.setDirection();
    this.setDistance();
  }

  displayTasks() {
    console.log("##############################################################");
    console.log(
      util.inspect(`남은 작업: ${this.tasks.size}`, INSPECT_OPTIONS),
      util.inspect(this, INSPECT_OPTIONS),
      // util.inspect(this.tasks, INSPECT_OPTIONS),
    );
    console.log("##############################################################");
  }

  displayHandling(state) {
    console.log(`[${state.padEnd(4, " ")}]: ${this.currentFloor.toString().padStart(2, " ")}층 | 남은 거리: ${this.distance} | 남은 승객수: ${this.passengers.length}`)
  }

  setFloor() {
    for (let i = MIN_FLOOR; i <= MAX_FLOOR; i++) {
      this.tasks.set(i, {
        "UP": [],
        "DOWN": []
      });
    }
  }

  setTasks() {
    const requests = [
      new Passenger({ currentFloor: 3, targetFloor: 9 }),
      new Passenger({ currentFloor: 4, targetFloor: 6 }),
      new Passenger({ currentFloor: 5, targetFloor: 2 }),
      new Passenger({ currentFloor: 7, targetFloor: 4 }),
      new Passenger({ currentFloor: 3, targetFloor: 9 }),
    ]

    this.direction = requests[0].direction;

    while (requests.length) {
      const request = requests.pop();
      const direction = elevatorDirection[request.direction];

      this.tasks.get(request.currentFloor)[direction].push(request);
    }
  }

  getTasksWithDirection() {
    const direction = elevatorDirection[this.direction];

    return Array.from(this.tasks)
      .filter(([, floor]) => floor[direction].length)
      .map(([, floor]) => floor[direction])
      .flat();
  }

  setDirection() {
    // +++ 메서드가 호출되는 시점에 요청큐에서 조회되는 요청에 따름
  }

  setDistance() {
    const leftCapacity = ElevatorManager.ELEVATOR_CAPACITY - this.passengers.length;
    const tasks = this.getTasksWithDirection().slice(0, leftCapacity);

    for (const task of tasks) {
      const distanceFollowing = Math.abs(task.targetFloor - task.currentFloor);
      const distancePreceding = Math.abs(task.currentFloor - this.currentFloor);

      this.distance = Math.max(this.distance, distanceFollowing + distancePreceding);
    }
  }

  getInPassenger() {
    const floor = this.tasks.get(this.currentFloor);
    const direction = elevatorDirection[this.direction];

    return floor[direction];
  }

  getOutPassenger() {
    return this.passengers.filter(passenger => {
      return (this.direction === passenger.direction)
        && (this.currentFloor === passenger.targetFloor);
    });
  }

  handleInPassenger() {
    const tasks = this.getInPassenger();

    while (
      (this.passengers.length < ElevatorManager.ELEVATOR_CAPACITY)
      && (tasks.length)
    ) {
      this.passengers.push(tasks.pop());
    }

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