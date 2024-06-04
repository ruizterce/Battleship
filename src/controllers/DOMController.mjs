export default class DOMController {
  updateText(selector, text) {
    const element = document.querySelector(selector);
    if (element) {
      element.textContent = text;
    }
  }

  // General board rendering
  renderBoard(parentElement, player, enemy = null, isPlacing = false) {
    const directionBtn = document.querySelector('.direction-btn') || null;
    const direction = directionBtn ? directionBtn.dataset.direction : 'H';
    parentElement.innerHTML = '';

    // Create a board
    const createBoard = (gameboard, isEnemy = false) => {
      const boardContainer = document.createElement('div');

      const boardTitle = document.createElement('h2');
      boardTitle.textContent = isPlacing
        ? 'Place your ships'
        : isEnemy
          ? "Enemy's waters"
          : "Player's waters";
      boardContainer.appendChild(boardTitle);

      if (isPlacing) {
        const directionBtn = document.createElement('button');
        directionBtn.classList.add('direction-btn');
        directionBtn.textContent = direction === 'H' ? 'Horizontal' : 'Vertical';
        directionBtn.dataset.direction = direction;
        directionBtn.addEventListener('click', changeDirection);
        boardContainer.appendChild(directionBtn);
        function changeDirection() {
          if (directionBtn.textContent === 'Horizontal') {
            directionBtn.textContent = 'Vertical';
            directionBtn.dataset.direction = 'V';
          } else {
            directionBtn.textContent = 'Horizontal';
            directionBtn.dataset.direction = 'H';
          }
        }
      }

      const board = document.createElement('div');
      board.classList.add(isPlacing ? 'placing-board' : isEnemy ? 'enemy-board' : 'player-board');
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
      boardContainer.appendChild(board);
      return boardContainer;
    };

    // Render player's board
    const myBoard = createBoard(player.gameboard);
    parentElement.appendChild(myBoard);

    // If not in placing mode, render enemy's board
    if (!isPlacing && enemy) {
      const separator = document.createElement('div');
      separator.style.height = '20px';
      parentElement.appendChild(separator);

      const enemyBoard = createBoard(enemy.gameboard, true);
      parentElement.appendChild(enemyBoard);
    }
  }

  // Click listener in enemy's board for attacking
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

  // Render the placing board for a player
  renderPlacingBoard(parentElement, player) {
    this.renderBoard(parentElement, player, null, true);
  }

  // Click listener for placing ships
  placeListener(player, shipLength) {
    const board = document.querySelector('.placing-board');

    return new Promise((resolve) => {
      const onClick = (e) => {
        if (!e.target.dataset.coordinates) {
          return false;
        }
        const [x, y] = e.target.dataset.coordinates.split(',').map(Number);
        const directionBtn = document.querySelector('.direction-btn');
        const direction = directionBtn.dataset.direction;
        let validPlacing = player.gameboard.place(x, y, shipLength, direction);
        board.removeEventListener('click', onClick);
        resolve(validPlacing);
      };
      board.addEventListener('click', onClick);
    });
  }
}
