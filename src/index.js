const ElevatorManager = require("./elevatorManager");
const Elevator = require("./elevator");
const { clearInterval } = require("timers");
const CONCURRENCY = 2;

(async function main() {
  const manager = new ElevatorManager(CONCURRENCY);
  manager.displayTasks();

  const elevatorStates = [];

  for (let elevatorID = 1; elevatorID <= CONCURRENCY; elevatorID++) {
    const elevator = new Elevator(elevatorID, manager);
    elevatorStates.push(manager.runElevator(elevator));
  }

  await Promise.all(elevatorStates)
    .then((intervalID) => {
      clearInterval(intervalID)
      manager.displayTasks();

    }).catch((err) => {
      console.err(err);
    })
})();