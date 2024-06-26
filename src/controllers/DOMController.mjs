export default class DOMController {
  // General board rendering
  renderBoard(parentElement, player, enemy = null, isPlacing = false) {
    const directionBtn = document.querySelector('.direction-btn') || null;
    const direction = directionBtn ? directionBtn.dataset.direction : 'H';
    parentElement.innerHTML = '';

    // Create a board
    const createBoard = (gameboard, isEnemy = false) => {
      const boardContainer = document.createElement('div');
      boardContainer.classList.add('board-container');

      const boardTitle = document.createElement('h2');
      boardTitle.textContent = isPlacing
        ? 'Place your ships'
        : isEnemy
          ? 'Enemy waters'
          : 'Ally waters';
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
          square.dataset.coordinates = `${i},${j}`;
          const pointer = gameboard.containsPointer(i, j);
          if (pointer) {
            if (pointer.shot) {
              square.classList.add('hit');
            } else if (!isEnemy) {
              square.classList.add('ally-ship');
            } else {
              square.classList.add('water');
            }
          } else if (gameboard.containsMissedAttack(i, j)) {
            square.classList.add('miss');
          } else {
            square.classList.add('water');
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
    const currentShipLength = player.ships[player.ships.length - 1];
    this.addHoverEffect(player, currentShipLength);
    console.log(player);
    console.log(currentShipLength);
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

  // Hover effect to visualize ship length and direction on Ship Placing Stage
  addHoverEffect(player, shipLength) {
    const board = document.querySelector('.placing-board');
    const buttons = board.querySelectorAll('button');

    buttons.forEach((button) => {
      button.addEventListener('mouseenter', (e) => {
        const [x, y] = e.target.dataset.coordinates.split(',').map(Number);
        const directionBtn = document.querySelector('.direction-btn');
        const direction = directionBtn.dataset.direction;
        this.highlightAdjacentButtons(player, x, y, shipLength, direction);
      });

      button.addEventListener('mouseleave', () => {
        this.removeHighlight();
      });
    });
  }

  highlightAdjacentButtons(player, x, y, length, direction) {
    for (let i = 0; i < length; i++) {
      let targetX = x;
      let targetY = y;
      if (direction === 'H') {
        targetX += i;
      } else {
        targetY += i;
      }

      let classToAdd;
      if (player.gameboard.isValidPlace(x, y, length, direction)) {
        classToAdd = 'highlight';
      } else {
        classToAdd = 'highlight-error';
      }

      if (targetX <= 9 && targetY <= 9) {
        const button = document.querySelector(`button[data-coordinates="${targetX},${targetY}"]`);
        if (button) {
          button.classList.add(classToAdd);
        }
      }
    }
  }

  removeHighlight() {
    const highlightedButtons = document.querySelectorAll('.highlight');
    highlightedButtons.forEach((button) => {
      button.classList.remove('highlight');
    });

    const highlightedErrorButtons = document.querySelectorAll('.highlight-error');
    highlightedErrorButtons.forEach((button) => {
      button.classList.remove('highlight-error');
    });
  }

  // Screen transition functions
  fadeIn(parentContainer) {
    return new Promise((resolve) => {
      const transitionContainer = document.createElement('div');
      transitionContainer.className = 'fullscreen-transition';

      const text = document.createElement('div');
      text.textContent = 'Deploying Fleet';
      text.className = 'deploying-text';
      transitionContainer.appendChild(text);

      parentContainer.appendChild(transitionContainer);
      transitionContainer.offsetHeight;
      transitionContainer.classList.add('visible');
      setTimeout(resolve, 1000);
    });
  }

  fadeOut(parentContainer) {
    return new Promise((resolve) => {
      const transitionContainer = parentContainer.querySelector('.fullscreen-transition');

      transitionContainer.classList.remove('visible');
      setTimeout(() => {
        parentContainer.removeChild(transitionContainer);
        resolve();
      }, 1000);
    });
  }

  gameEndTransition(parentContainer, winner) {
    const transitionContainer = document.createElement('div');
    transitionContainer.className = 'game-end-transition';

    const text = document.createElement('div');
    text.className = 'game-end-text';
    if (winner.isCpu) {
      text.textContent = 'You were defeated';
      transitionContainer.style.backgroundColor = 'rgb(255, 0, 0, .8)';
    } else {
      text.textContent = 'You won the battle';
      transitionContainer.style.backgroundColor = 'rgb(0, 255, 0, .8)';
    }
    transitionContainer.appendChild(text);
    const button = document.createElement('button');
    button.textContent = 'Restart';
    button.className = 'game-end-button';
    button.addEventListener('click', () => {
      location.reload();
    });
    transitionContainer.appendChild(button);

    parentContainer.appendChild(transitionContainer);
    transitionContainer.offsetHeight;
    transitionContainer.classList.add('visible');
  }
}
