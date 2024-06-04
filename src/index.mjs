import './style.css';
import DOMController from './controllers/DOMController.mjs';
import Player from './classes/Player.mjs';

const ui = new DOMController();
const gameContainer = document.querySelector('.game-container');

const p1 = new Player(false);
const p2 = new Player(true);

// Place ships
async function placeShips() {
  let activePlayer;
  do {
    activePlayer = activePlayer === p1 ? p2 : p1;
    do {
      if (activePlayer.isCpu === false) {
        // Human places ships
        ui.renderPlacingBoard(gameContainer, activePlayer);
        let validPlacing;
        do {
          validPlacing = await ui.placeListener(
            activePlayer,
            activePlayer.ships[activePlayer.ships.length - 1]
          );
        } while (!validPlacing);
        activePlayer.ships.pop();
      } else {
        // Computer places ships
        cpuPlaces();
      }
    } while (activePlayer.ships.length > 0);
    console.log(p1.ships.length, p2.ships.length);
  } while (p1.ships.length > 0 || p2.ships.length > 0);

  function cpuPlaces() {
    let placeX;
    let placeY;
    let validPlacing;
    do {
      placeX = Math.floor(Math.random() * 10);
      placeY = Math.floor(Math.random() * 10);
      const direction = Math.random() > 0.5 ? 'V' : 'H';
      console.log('Placing ' + placeX + ', ' + placeY);
      validPlacing = activePlayer.gameboard.place(
        placeX,
        placeY,
        activePlayer.ships[activePlayer.ships.length - 1],
        direction
      );
    } while (!validPlacing);
    activePlayer.ships.pop();
  }
}

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
await placeShips();
await ui.fadeIn(document.querySelector('body'));
gameLoop();
await ui.fadeOut(document.querySelector('body'));
