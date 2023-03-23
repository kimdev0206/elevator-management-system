function getRandomNumber() {
  const max = 10;
  const min = 1;

  return Math.floor(Math.random() * (max - min + 1) + min);
}

class Passenger {
  constructor({ currentFloor, targetFloor }) {
    this.currentFloor = currentFloor || getRandomNumber();
    this.targetFloor = targetFloor || getRandomNumber();
  }
}

module.exports = Passenger;

