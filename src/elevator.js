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
    this.tasks.get(3)["UP"].push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
    this.tasks.get(4)["UP"].push(new Passenger({ currentFloor: 4, targetFloor: 6 }));
    this.tasks.get(5)["DOWN"].push(new Passenger({ currentFloor: 5, targetFloor: 2 }));
    this.tasks.get(7)["DOWN"].push(new Passenger({ currentFloor: 7, targetFloor: 4 }));
    this.tasks.get(3)["UP"].push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
  }

  getTask() {

  }

  getFloorWithTask() {
    const [, floor] = Array.from(this.tasks).find(([, floor]) => {
      for (const direction in floor) {
        if (floor[direction].length) {
          return true;
        }
      }
    });

    return floor;
  }

  setDirection() {
    const floor = this.getFloorWithTask();

    for (const direction in floor) {
      if (floor[direction].length) {
        this.direction = floor[direction][0].direction;
        return
      }
    }
  }

  setDistance() {
    const floor = this.getFloorWithTask();
    const direction = elevatorDirection[this.direction];

    for (
      let i = 0;
      i < ElevatorManager.ELEVATOR_CAPACITY - this.passengers.length;
      i++
    ) {
      const task = floor[direction][i];
      if (!task) {
        break;
      }

      const distanceInTask = Math.abs(task.targetFloor - task.currentFloor);
      const distanceBetweenTaskAndCurrent = Math.abs(task.currentFloor - this.currentFloor);

      this.distance = Math.max(
        this.distance,
        distanceInTask + distanceBetweenTaskAndCurrent
      );
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