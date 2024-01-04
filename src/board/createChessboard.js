export function createChessboard() {
    const boardContainer = document.getElementById('chessboard');
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  
    for (let row = 8; row >= 1; row--) {
      for (const file of files) {
        const squareId = file + row;
        const square = document.createElement('div');
  
        square.classList.add('square');
        square.dataset.squareColor = (files.indexOf(file) + row) % 2 === 0 ? 'even' : 'odd'
        square.id = squareId;
  
        boardContainer.appendChild(square);
      }
    }
  }