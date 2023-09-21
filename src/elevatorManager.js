const util = require("util");
const { INSPECT_OPTIONS } = require("./constants");
const Passenger = require("./Passenger");

class ElevatorManager {
  static FILE_PATH = "./current-floor-list.json";
  static DIRECTION = {
    [1]: "UP",
    [-1]: "DOWN",
  };

  constructor(size) {
    this.size = size;
    this.tasks = [];
    this.setTasks();
  }

  setTasks() {
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
    this.tasks.push(new Passenger({ currentFloor: 4, targetFloor: 6 }));
    this.tasks.push(new Passenger({ currentFloor: 5, targetFloor: 2 }));
    this.tasks.push(new Passenger({ currentFloor: 7, targetFloor: 4 }));
    this.tasks.push(new Passenger({ currentFloor: 3, targetFloor: 9 }));
  }

  run(elevator) {
    return new Promise((resolve, reject) => {
      const intervalID = setInterval(() => {
        const inPassengerCount = elevator.getInPassenger().length;
        const outPassengerCount = elevator.getOutPassenger().length;

        if (inPassengerCount) {
          elevator.handleInPassenger();
        }

        if (outPassengerCount) {
          elevator.handleOutPassenger();
        }

        if (!(inPassengerCount || outPassengerCount)) {
          elevator.displayHandling(
            ElevatorManager.DIRECTION[elevator.direction]
          );
        }

        if (this.tasks.length && !elevator.distance) {
          elevator.setDirection();
          elevator.setDistance();
        }

        elevator.currentFloor += elevator.direction;
        elevator.distance -= 1;

        if (!this.tasks.length && !elevator.passengers.length) {
          resolve(intervalID);
        }

        if (elevator.currentFloor < 0 || elevator.distance < 0) {
          reject(new Error("시스템 에러 발생"));
        }
      }, 1000);
    });
  }

  stop(intervalID) {
    clearInterval(intervalID);
  }

  displayTasks() {
    console.log(
      "##############################################################"
    );
    console.log(
      util.inspect(`남은 작업: ${this.tasks.length}`, INSPECT_OPTIONS),
      util.inspect(this.tasks, INSPECT_OPTIONS)
    );
    console.log(
      "##############################################################"
    );
  }

  async loadState(fs) {
    const states = await fs.readFile(ElevatorManager.FILE_PATH, {
      encoding: "utf8",
    });

    if (!states) {
      return Array.from({ length: this.size }, (_, i) => ({
        ID: i + 1,
        currentFloor: 1,
      }));
    }

    return JSON.parse(states);
  }

  async saveState({ fs, elevators }) {
    const states = [];

    for (const { ID, currentFloor } of elevators) {
      states.push({
        ID,
        currentFloor,
      });
    }

    await fs.writeFile(ElevatorManager.FILE_PATH, JSON.stringify(states));
  }
}

module.exports = ElevatorManager;
