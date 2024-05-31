import Ship from '../src/classes/Ship.mjs';

describe('Ship class', () => {
  test('Ship instance constructs properly', () => {
    const ship = new Ship(5);
    expect(ship.length).toBe(5);
    expect(ship.hitCounter).toBe(0);
    expect(ship.sunk).toBe(false);
  });

  test('throws an error if length is not an integer', () => {
    expect(() => new Ship('five')).toThrow('Length must be a positive integer');
    expect(() => new Ship(5.5)).toThrow('Length must be a positive integer');
  });

  test('throws an error if length is negative', () => {
    expect(() => new Ship(-1)).toThrow('Length must be a positive integer');
  });

  test('throws an error if length is zero', () => {
    expect(() => new Ship(0)).toThrow('Length must be a positive integer');
  });

  test('hit() is called and updates hitCounter', () => {
    const ship = new Ship(5);
    const hitSpy = jest.spyOn(ship, 'hit');

    expect(ship.hitCounter).toBe(0);
    ship.hit();
    expect(hitSpy).toHaveBeenCalled();
    expect(ship.hitCounter).toBe(1);
    ship.hit();
    expect(hitSpy).toHaveBeenCalledTimes(2);
    expect(ship.hitCounter).toBe(2);
  });

  test('isSunk() is called and returns value', () => {
    const ship = new Ship(2);
    const isSunkSpy = jest.spyOn(ship, 'isSunk');

    expect(ship.isSunk()).toBe(false);
    expect(isSunkSpy).toHaveBeenCalled();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
    expect(isSunkSpy).toHaveBeenCalledTimes(2);
  });
});
