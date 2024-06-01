export default class DOMController {
  updateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  renderBoard(parentElement, player, enemy) {
    parentElement.innerHTML = '';

    function createBoard(gameboard, isEnemy = false) {
      const board = document.createElement('div');
      if (isEnemy) board.classList.add('enemy-board');
      for (let i = 0; i < 10; i++) {
        const row = document.createElement('div');
        for (let j = 0; j < 10; j++) {
          const square = document.createElement('button');
          square.dataset.coordinates = `${j},${i}`;
          const pointer = gameboard.containsPointer(j, i);
          if (pointer) {
            if (pointer.shot) {
              square.textContent = 'H';
              square.style.backgroundColor = 'red';
            } else if (!isEnemy) {
              square.textContent = 'X';
            } else {
              square.textContent = 'O';
            }
          } else if (gameboard.containsMissedAttack(j, i)) {
            square.textContent = 'M';
            square.style.backgroundColor = 'blue';
          } else {
            square.textContent = 'O';
          }
          row.appendChild(square);
        }
        board.appendChild(row);
      }
      return board;
    }

    const myBoard = createBoard(player.gameboard);
    parentElement.appendChild(myBoard);

    const separator = document.createElement('div');
    separator.style.height = '20px';
    parentElement.appendChild(separator);

    const enemyBoard = createBoard(enemy.gameboard, true);
    parentElement.appendChild(enemyBoard);
  }

  attackListener(enemy) {
    const enemyBoard = document.querySelector('.enemy-board');
    return new Promise((resolve) => {
      const onClick = (e) => {
        if (!e.target.dataset.coordinates) {
          return false;
        }
        const [x, y] = e.target.dataset.coordinates.split(',').map(Number);
        let validShot = enemy.gameboard.receiveAttack(x, y);
        enemyBoard.removeEventListener('click', onClick);
        resolve(validShot);
      };
      enemyBoard.addEventListener('click', onClick);
    });
  }
}
