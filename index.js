const fs = require("node:fs/promises");
const util = require("node:util");

const ElevatorManager = require("./src/elevatorManager");
const Passenger = require("./src/Passenger");
require("./src/log");

function displayTasks(tasks) {
  console.log(
    ` 남은 작업수: ${tasks.length} `.padStart(30, "#").padEnd(55, "#")
  );
  console.log(
    util.inspect(tasks, {
      showHidden: false,
      depth: null,
    })
  );
  console.log("#".padStart(60, "#"));
}

function delay() {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

function isPassengerable(passenger, task) {
  return (
    passenger.direction === task.direction &&
    passenger.currentFloor <= task.currentFloor &&
    passenger.targetFloor >= task.targetFloor
  );
}

(async function main() {
  const elevatorManager = new ElevatorManager();
  let tasks = [
    new Passenger({ currentFloor: 3, targetFloor: 9 }),
    new Passenger({ currentFloor: 4, targetFloor: 6 }),
    new Passenger({ currentFloor: 5, targetFloor: 2 }),
    new Passenger({ currentFloor: 7, targetFloor: 4 }),
    new Passenger({ currentFloor: 3, targetFloor: 9 }),
  ];
  const promises = [];

  displayTasks(tasks);

  try {
    await elevatorManager.loadFloorState(fs);

    while (tasks.length) {
      if (!elevatorManager.isAssignable()) {
        await delay();
        continue;
      }

      const priorityPassenger = tasks.shift();
      const passengers = tasks.filter((task) =>
        isPassengerable(priorityPassenger, task)
      );
      tasks = tasks.filter((task) => !isPassengerable(priorityPassenger, task));

      promises.push(
        elevatorManager.assignElevator([priorityPassenger, ...passengers])
      );
    }

    await Promise.allSettled(promises);
  } catch (err) {
    console.error(err);
  } finally {
    displayTasks(tasks);
  }
})();
