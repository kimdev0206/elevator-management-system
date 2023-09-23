const Elevator = require("./elevator");

class ElevatorManager {
  static FILE_PATH = "./current-floor-list.json";

  constructor() {
    this.elevators = [];
  }

  async assignElevator(passengers) {
    const priorityPassenger = passengers[0];
    let elevator = this.getClosestElevator(priorityPassenger);

    if (elevator.isRunning) {
      elevator = this.getRunnableElevator();
    }

    elevator.setDistance(priorityPassenger);
    elevator.tasks = passengers;

    elevator.setDirection(priorityPassenger.currentFloor);
    await elevator.moveTo(priorityPassenger.currentFloor);

    elevator.setDirection(priorityPassenger.targetFloor);
    await elevator.moveTo(priorityPassenger.targetFloor);
  }

  getClosestElevator(passenger) {
    let closestElevator = this.elevators[0];
    let minDistance = Math.abs(
      passenger.currentFloor - closestElevator.currentFloor
    );

    for (const elevator of this.elevators) {
      const distance = Math.abs(passenger.currentFloor - elevator.currentFloor);

      if (distance < minDistance) {
        closestElevator = elevator;
        minDistance = distance;
      }
    }

    return closestElevator;
  }

  getRunnableElevator() {
    return this.elevators.find((elevator) => !elevator.isRunning);
  }

  isAssignable() {
    return this.elevators.some((elevator) => !elevator.isRunning);
  }

  async loadFloorState(fs) {
    const data = await fs.readFile(ElevatorManager.FILE_PATH, {
      encoding: "utf8",
    });

    if (!data) {
      this.elevators = [new Elevator(), new Elevator()];
      return;
    }

    const states = JSON.parse(data);

    this.elevators = states.map(
      ({ ID, currentFloor }) => new Elevator({ ID, currentFloor })
    );
  }

  async saveFloorState({ fs, elevators }) {
    const states = elevators.map(({ ID, currentFloor }) => ({
      ID,
      currentFloor,
    }));

    await fs.writeFile(ElevatorManager.FILE_PATH, JSON.stringify(states));
  }
}

module.exports = ElevatorManager;
