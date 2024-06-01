import Gameboard from './Gameboard.mjs';

export default class Player {
  constructor(isCpu) {
    this.isCpu = isCpu;
    this.gameboard = new Gameboard();
  }
}
