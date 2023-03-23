const util = require("util");
const { elevatorState, Elevator } = require("./elevator");
const { inspectOptions } = require("./utils");

(function main() {
  const elevator = new Elevator();
  elevator.displayTasks();

  const interval = setInterval(() => {
    if (elevator.currentFloor === elevator.tasks[0].targetFloor) {
      console.log(
        util.inspect(
          `[STOP]: ${elevator.currentFloor}층 도착, 남은거리: ${elevator.distance}`, inspectOptions
        )
      );

      elevator.tasks.shift();
    } else {
      console.log(
        util.inspect(
          `[${elevatorState[elevator.direction]}]: ${elevator.currentFloor}층, 남은거리: ${elevator.distance}`, inspectOptions
        )
      );
    }

    if (elevator.distance === 0) {
      clearInterval(interval);
      elevator.displayTasks();
    }

    elevator.currentFloor += 1;
    elevator.distance -= 1;
  }, 1000);
})();