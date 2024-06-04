import Ship from './Ship.mjs';

export default class Gameboard {
  constructor() {
    this.ships = [];
    this.pointers = [];
    this.missedAttacks = [];
  }

  // Place a ship 'H'orizontally or 'V'ertically
  place(x, y, length, direction) {
    if (!this.isValidPlace(x, y, length, direction)) {
      return false;
    }
    // Add the ship object to ships
    let ship = new Ship(length);
    this.ships.push(ship);

    // Place pointers to the ship object in the occupied coordinates
    for (let i = 0; i < length; i++) {
      this.pointers.push(
        new pointer(direction === 'H' ? x + i : x, direction === 'V' ? y + i : y, ship)
      );
    }
    return true;
  }

  isValidPlace(x, y, length, direction) {
    let alreadyOccupied;
    for (let i = 0; i < length; i++) {
      if (direction === 'H') {
        let targetX = x + i;
        let targetY = y;
        alreadyOccupied = this.containsPointer(targetX, targetY);
        if (alreadyOccupied != undefined || targetX > 9) {
          return false;
        }
      } else if (direction === 'V') {
        let targetX = x;
        let targetY = y + i;
        alreadyOccupied = this.containsPointer(targetX, targetY);
        if (alreadyOccupied != undefined || targetY > 9) {
          return false;
        }
      }
    }
    return true;
  }

  // Receive enemy attack, return true if shot is valid, false if not
  receiveAttack(x, y) {
    // Hit a pointer if it's not already shot
    const pointer = this.containsPointer(x, y);
    if (pointer != undefined) {
      if (!pointer.shot) {
        pointer.hit();
        return true;
      } else {
        return false;
      }
    } else {
      // Hit a missing area if it was not already shot
      if (!this.containsMissedAttack(x, y)) {
        this.missedAttacks.push([x, y]);
        return true;
      } else {
        return false;
      }
    }
  }

  containsPointer(x, y) {
    return this.pointers.find((pointer) => pointer.x === x && pointer.y === y);
  }

  containsMissedAttack(x, y) {
    return this.missedAttacks.find(
      (missedAttack) => missedAttack[0] === x && missedAttack[1] === y
    );
  }

  checkAllSunk() {
    return this.ships.every((ship) => ship.isSunk());
  }
}

class pointer {
  constructor(x, y, parent) {
    this.x = x;
    this.y = y;
    this.parent = parent;
    this.shot = false;
  }

  hit() {
    this.shot = true;
    this.parent.hit();
  }
}
