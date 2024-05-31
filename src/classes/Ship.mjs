export default class Ship {
  constructor(length) {
    if (!Number.isInteger(length) || length <= 0) {
      throw new Error('Length must be a positive integer');
    }

    this.length = length;
    this.sunk = false;
    this.hitCounter = 0;
  }

  hit() {
    this.hitCounter += 1;
  }

  isSunk() {
    if (this.hitCounter >= this.length) {
      this.sunk = true;
    }
    return this.sunk;
  }
}
