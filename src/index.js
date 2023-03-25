const { elevatorDirection, ElevatorManager } = require("./elevator");

(function main() {
  const manager = new ElevatorManager();
  manager.displayTasks();

  const interval = setInterval(() => {
    const inPassengerCount = manager.getInPassenger().length;
    const outPassengerCount = manager.getOutPassenger().length;

    if (inPassengerCount) {
      manager.handleInPassenger();
    }

    if (outPassengerCount) {
      manager.handleOutPassenger();
    }

    if (!(inPassengerCount || outPassengerCount)) {
      manager.displayHandling(elevatorDirection[manager.direction]);
    }

    if (!manager.distance) {
      manager.setDirection();
      manager.setDistance();
    }

    if ((!manager.distance)
      && (!manager.passengers.length)) {
      clearInterval(interval);
      manager.displayTasks();
    }

    manager.currentFloor += manager.direction;
    manager.distance -= 1;
  }, 1000);
})();