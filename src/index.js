const { elevatorState, Elevator } = require("./elevator");

(function main() {
  const elevator = new Elevator();
  elevator.displayTasks();

  const interval = setInterval(() => {
    const inPassengerCount = elevator.getHandleableTasks("currentFloor")?.length;
    const outPassengerCount = elevator.getHandleableTasks("targetFloor")?.length;

    if (inPassengerCount) {
      elevator.handleInPassenger();
    }

    if (outPassengerCount) {
      elevator.handleOutPassenger();
    }

    if (!(inPassengerCount || outPassengerCount)) {
      elevator.displayProcessing(elevatorState[elevator.direction]);
    }

    if (!elevator.distance) {
      elevator.sort();
      elevator.setDirection();
      elevator.setDistance();
    }

    if (!elevator.tasks.length
      && !elevator.passengerCount) {
      clearInterval(interval);
      elevator.displayTasks();
    }

    elevator.currentFloor += elevator.direction;
    elevator.distance -= 1;
  }, 1000);
})();