import Player from '../src/classes/Player.mjs';

describe('Player class', () => {
  test('instance constructs and has properties set', () => {
    const player = new Player(false);
    expect(player.isCpu).toBe(false);
    expect(player.gameboard).toEqual({ ships: [], pointers: [], missedAttacks: [] });
  });
});
