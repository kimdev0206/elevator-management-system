class Elevator {
  static CAPACITY = 5;
  static DIRECTION = {
    [1]: "UP",
    [-1]: "DOWN",
  };

  constructor({ ID, currentFloor }) {
    this.ID = ID;
    this.currentFloor = currentFloor || 1;
    this.tasks = [];
    this.passengers = [];
    this.direction = 1;
    this.distance = 0;
    this.isRunning = false;
  }

  setDistance(passenger) {
    this.distance =
      Math.abs(passenger.currentFloor - this.currentFloor) +
      Math.abs(passenger.targetFloor - passenger.currentFloor);
  }

  setDirection(floor) {
    if (floor === this.currentFloor) {
      return;
    }

    this.direction = Math.sign(floor - this.currentFloor);
  }

  moveTo(floor) {
    this.isRunning = true;

    return new Promise((resolve, reject) => {
      const intervalID = setInterval(() => {
        const isAddable = this.tasks.some((passenger) =>
          this.isAddable(passenger)
        );

        if (isAddable) {
          this.tasks
            .filter((passenger) => this.isAddable(passenger))
            .forEach((passenger) => this.addPassenger(passenger));

          this.display({ state: "IN" });
        }

        const isRemoveable = this.passengers.some((passenger) =>
          this.isRemoveable(passenger)
        );

        if (isRemoveable) {
          this.passengers
            .filter((passenger) => this.isRemoveable(passenger))
            .forEach((passenger) => this.removePassenger(passenger));

          this.display({ state: "OUT" });
        }

        if (!(isAddable || isRemoveable)) {
          this.display({
            state: Elevator.DIRECTION[this.direction],
          });
        }

        if (this.currentFloor === floor) {
          this.isRunning = false;
          clearInterval(intervalID);
          return resolve();
        }

        if (this.currentFloor < 0 || this.distance < 0) {
          clearInterval(intervalID);
          return reject(new RangeError());
        }

        this.currentFloor += this.direction;
        this.distance -= 1;
      }, 1000);
    });
  }

  isAddable(passenger) {
    return (
      passenger.direction === this.direction &&
      passenger.currentFloor === this.currentFloor
    );
  }

  isRemoveable(passenger) {
    return (
      passenger.direction === this.direction &&
      passenger.targetFloor === this.currentFloor
    );
  }

  addPassenger(passenger) {
    this.passengers.push(passenger);
  }

  removePassenger(passenger) {
    const index = this.passengers.indexOf(passenger);

    if (index > -1) {
      this.passengers.splice(index, 1);
    }
  }

  /**
   * TODO:
   * 엘리베이터 관리 → 각 엘리베이터로 display 메소드가 변경되면서,
   * 남은 작업수를 각 엘리베이터의 타이머 객체에 실시간으로 전달 하기 어려워짐.
   * Events API를 적용해볼 수 있음.
   */
  display({ state }) {
    const stateFormat = state.padEnd(4, " ");
    const currentFloorFormat = this.currentFloor.toString().padStart(2, " ");
    const distanceFormat = this.distance.toString().padStart(2, " ");

    console.log(
      `[${this.ID}호기:${stateFormat}]: ${currentFloorFormat}층 | 남은 거리: ${distanceFormat} | 남은 승객수: ${this.passengers.length}`
    );
  }
}

module.exports = Elevator;
