const { elevatorDirection, ElevatorManager } = require("./elevator");

(function main() {
  const manager = new ElevatorManager();
  manager.displayTasks();

  const interval = setInterval(() => {
    if (!manager.tasks.length && !manager.passengers.length) {
      clearInterval(interval);
      manager.displayTasks();
    }

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

    manager.currentFloor += manager.direction;
    manager.distance -= 1;
  }, 1000);
})();