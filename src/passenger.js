const { MAX_FLOOR, MIN_FLOOR } = require("./constants");

function getRandomNumber() {
  return Math.floor(Math.random() * (MAX_FLOOR - MIN_FLOOR + 1) + MIN_FLOOR);
}

class Passenger {
  constructor({ currentFloor, targetFloor }) {
    this.currentFloor = currentFloor || getRandomNumber();
    this.targetFloor = targetFloor || getRandomNumber();
    this.direction = Math.sign(this.targetFloor - this.currentFloor);
  }
}

module.exports = Passenger;
