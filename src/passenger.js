class Passenger {
  static MAX_FLOOR = 10;
  static MIN_FLOOR = 1;

  constructor({ currentFloor, targetFloor }) {
    this.currentFloor = currentFloor || getRandomNumber();
    this.targetFloor = targetFloor || getRandomNumber();
    this.direction = Math.sign(this.targetFloor - this.currentFloor);
  }

  getRandomNumber() {
    return Math.floor(
      Math.random() * (Passenger.MAX_FLOOR - Passenger.MIN_FLOOR + 1) +
        Passenger.MIN_FLOOR
    );
  }
}

module.exports = Passenger;
