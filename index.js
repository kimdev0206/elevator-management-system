const fs = require("node:fs/promises");
const ElevatorManager = require("./src/elevatorManager");
const Elevator = require("./src/elevator");
require("./src/log");

// ✨ You can customize. ✨
const size = 2;

(async function main() {
  const manager = new ElevatorManager(size);

  const elevatorStates = await manager.loadState(fs);
  const elevators = [];

  while (elevatorStates.length) {
    const { ID, currentFloor } = elevatorStates.shift();
    const elevator = new Elevator(ID, currentFloor, manager);

    elevators.push(elevator);
  }

  const elevatorPromises = [];

  for (const elevator of elevators) {
    elevatorPromises.push(manager.run(elevator));
  }

  manager.displayTasks();

  try {
    const result = await Promise.allSettled(elevatorPromises);

    for (const each of result) {
      manager.stop(each.value);
    }

    manager.saveState({ fs, elevators });
  } catch (err) {
    console.error(err);
  } finally {
    manager.displayTasks();
  }
})();
