import Gameboard from './Gameboard.mjs';

export default class Player {
  constructor(isCpu) {
    this.isCpu = isCpu;
    this.name = this.isCpu ? 'Computer' : 'Player';
    this.gameboard = new Gameboard();
  }
}
