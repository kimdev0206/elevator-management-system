const ElevatorManager = require("./src/elevatorManager");
const Elevator = require("./src/elevator");
require("./src/log");

// ✨ You can customize. ✨
const CONCURRENCY = 2;
const START_FLOOR_LIST = [5, 1];

(async function main() {
  const manager = new ElevatorManager(CONCURRENCY);
  manager.displayTasks();

  const elevatorStates = [];

  for (let elevatorID = 1; elevatorID <= CONCURRENCY; elevatorID++) {
    const elevator = new Elevator(
      elevatorID,
      START_FLOOR_LIST.pop(),
      manager
    );

    elevatorStates.push(manager.run(elevator));
  }

  try {
    const result = await Promise.allSettled(elevatorStates);

    for (const each of result) {
      manager.stop(each.value);
    }
  } catch (err) {
    console.err(err);
  } finally {
    manager.displayTasks();
  }
})();