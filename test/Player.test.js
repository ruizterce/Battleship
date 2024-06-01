import Player from '../src/classes/Player.mjs';

describe('Player class', () => {
  test('Human player constructs and has properties set', () => {
    const player = new Player(false);
    expect(player.isCpu).toBe(false);
    expect(player.name).toBe('Player');
    expect(player.gameboard).toEqual({
      ships: [],
      pointers: [],
      missedAttacks: []
    });
  });

  test('CPU player constructs and has properties set', () => {
    const player = new Player(true);
    expect(player.isCpu).toBe(true);
    expect(player.name).toBe('Computer');
    expect(player.gameboard).toEqual({
      ships: [],
      pointers: [],
      missedAttacks: []
    });
  });
});
