import Ship from './Ship.mjs';

export default class Gameboard {
  constructor() {
    this.ships = [];
    this.pointers = [];
    this.missedAttacks = [];
  }

  place(x, y, length, direction) {
    let ship = new Ship(length);
    this.ships.push(ship);

    for (let i = 0; i < length; i++) {
      if (direction === 'H') {
        this.pointers.push(new pointer(x + i, y, ship));
      } else if (direction === 'V') {
        this.pointers.push(new pointer(x, y + i, ship));
      }
    }
  }

  receiveAttack(x, y) {
    const pointer = this.pointers.find((item) => item.x === x && item.y === y) || null;
    if (pointer != null) {
      pointer.parent.hit();
    } else {
      this.missedAttacks.push([x, y]);
    }
  }
}

class pointer {
  constructor(x, y, parent) {
    this.x = x;
    this.y = y;
    this.parent = parent;
  }
}
