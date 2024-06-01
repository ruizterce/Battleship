import Gameboard from '../src/classes/Gameboard.mjs';

describe('Gameboard class', () => {
  test('instance constructs and has an empty array', () => {
    const gameboard = new Gameboard();
    expect(gameboard.ships).toEqual([]);
  });

  test('.place() is called and adds ships to .ships array', () => {
    const gameboard = new Gameboard();
    const placeSpy = jest.spyOn(gameboard, 'place');
    gameboard.place(2, 2, 5, 'H');
    expect(placeSpy).toHaveBeenCalled();
    expect(gameboard.ships).toEqual([{ length: 5, sunk: false, hitCounter: 0 }]);
    gameboard.place(7, 3, 3, 'V');
    expect(placeSpy).toHaveBeenCalledTimes(2);
    expect(gameboard.ships).toEqual([
      { length: 5, sunk: false, hitCounter: 0 },
      { length: 3, sunk: false, hitCounter: 0 }
    ]);
  });

  test('.place() is called and adds pointers to .pointers array', () => {
    const gameboard = new Gameboard();
    const placeSpy = jest.spyOn(gameboard, 'place');
    gameboard.place(2, 2, 2, 'H');
    expect(placeSpy).toHaveBeenCalled();
    expect(gameboard.pointers).toEqual([
      { x: 2, y: 2, parent: { length: 2, sunk: false, hitCounter: 0 }, shot: false },
      { x: 3, y: 2, parent: { length: 2, sunk: false, hitCounter: 0 }, shot: false }
    ]);
    gameboard.place(0, 0, 4, 'V');
    expect(placeSpy).toHaveBeenCalled();
    expect(gameboard.pointers).toEqual([
      { x: 2, y: 2, parent: { length: 2, sunk: false, hitCounter: 0 }, shot: false },
      { x: 3, y: 2, parent: { length: 2, sunk: false, hitCounter: 0 }, shot: false },
      { x: 0, y: 0, parent: { length: 4, sunk: false, hitCounter: 0 }, shot: false },
      { x: 0, y: 1, parent: { length: 4, sunk: false, hitCounter: 0 }, shot: false },
      { x: 0, y: 2, parent: { length: 4, sunk: false, hitCounter: 0 }, shot: false },
      { x: 0, y: 3, parent: { length: 4, sunk: false, hitCounter: 0 }, shot: false }
    ]);
  });

  test('.receiveAttack() looks for a pointer in the given coordinates and hits it', () => {
    const gameboard = new Gameboard();
    gameboard.place(2, 2, 2, 'H');
    expect(gameboard.ships[0].hitCounter).toEqual(0);
    expect(gameboard.containsPointer(3, 2).shot).toBe(false);
    gameboard.receiveAttack(3, 2);
    expect(gameboard.ships[0].hitCounter).toEqual(1);
    expect(gameboard.containsPointer(3, 2).shot).toBe(true);
  });

  test('.receiveAttack() hits a ship several times and sinks it', () => {
    const gameboard = new Gameboard();
    gameboard.place(3, 2, 3, 'H');
    expect(gameboard.ships[0].hitCounter).toEqual(0);
    gameboard.receiveAttack(3, 2);
    expect(gameboard.ships[0].hitCounter).toEqual(1);
    expect(gameboard.ships[0].isSunk()).toBe(false);
    gameboard.receiveAttack(4, 2);
    expect(gameboard.ships[0].hitCounter).toEqual(2);
    gameboard.receiveAttack(5, 2);
    expect(gameboard.ships[0].hitCounter).toEqual(3);
    expect(gameboard.ships[0].isSunk()).toBe(true);
  });

  test('.receiveAttack() saves missedAttacks coordinates', () => {
    const gameboard = new Gameboard();
    expect(gameboard.missedAttacks).toEqual([]);
    gameboard.receiveAttack(3, 2);
    expect(gameboard.missedAttacks).toEqual([[3, 2]]);
    gameboard.receiveAttack(5, 5);
    expect(gameboard.missedAttacks).toEqual([
      [3, 2],
      [5, 5]
    ]);
  });
});
