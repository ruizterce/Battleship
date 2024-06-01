import './style.css';
import DOMController from './controllers/DOMController.mjs';
import Player from './classes/Player.mjs';

const ui = new DOMController();
const gameContainer = document.querySelector('.game-container');

const p1 = new Player(false);
const p2 = new Player(true);

// Placeholder ship placement
p1.gameboard.place(0, 0, 3, 'H');
p1.gameboard.place(0, 2, 2, 'V');
p2.gameboard.place(5, 5, 3, 'H');
p2.gameboard.place(5, 6, 2, 'V');

p1.gameboard.receiveAttack(1, 1);
p2.gameboard.receiveAttack(4, 4);
console.log(p2.gameboard);

// Game loop
async function gameLoop() {
  let gameEnded = false;
  let activePlayer;

  do {
    activePlayer = activePlayer === p1 ? p2 : p1;
    let enemyPlayer = activePlayer === p1 ? p2 : p1;
    console.log(activePlayer);

    if (activePlayer.isCpu) {
      // Cpu plays
      cpuAttacks(enemyPlayer);
    } else {
      // Human plays
      ui.renderBoard(gameContainer, activePlayer, enemyPlayer);
      let validShot;
      do {
        validShot = await ui.attackListener(enemyPlayer);
      } while (!validShot);
    }

    if (enemyPlayer.gameboard.checkAllSunk()) {
      gameEnded = true;
      ui.renderBoard(gameContainer, activePlayer, enemyPlayer);
    }
  } while (!gameEnded);

  console.log(activePlayer.name, 'WINS!');

  // Auxiliary CPU logic
  function cpuAttacks(enemyPlayer) {
    let attackX;
    let attackY;
    let validShot;
    do {
      attackX = Math.floor(Math.random() * 10);
      attackY = Math.floor(Math.random() * 10);
      console.log('Shooting ' + attackX + ', ' + attackY);
      validShot = enemyPlayer.gameboard.receiveAttack(attackX, attackY);
    } while (!validShot);
  }
}
gameLoop();
