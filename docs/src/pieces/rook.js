import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";

let rookMoves = [];

let blocked = {
  up: "",
  down: "",
  left: "",
  right: "",
};

let movesUp;
let movesDown;
let movesLeft;
let movesRight;

function allRookMoves(squares, clickedPiece) {
  squares.forEach((square) => {
    let split = square.id.split("");
    let file = split[0].charCodeAt(0);
    let row = parseInt(split[1]);
    if (file == clickedPiece.file.charCodeAt(0)) {
      rookMoves.push(square.id);
    } else if (row == clickedPiece.row) {
      rookMoves.push(square.id);
    }
  });
}

function filterPieceMoves(clickedPiece) {
  movesUp = [];
  movesDown = [];
  movesLeft = [];
  movesRight = [];
  for (const move of rookMoves) {
    let square = document.getElementById(move);
    if (square.dataset.occupied) {
      let splitId = square.id.split("");
      // If file is same, get squares above and below
      if (splitId[0].charCodeAt(0) == clickedPiece.file.charCodeAt(0)) {
        if (parseInt(splitId[1]) > parseInt(clickedPiece.row)) {
          movesUp.push(parseInt(splitId[1]));
        } else if (parseInt(splitId[1]) < parseInt(clickedPiece.row)) {
          movesDown.push(parseInt(splitId[1]));
        }
        // If row is the same, get squares to left and right
      } else if (parseInt(splitId[1]) == parseInt(clickedPiece.row)) {
        if (splitId[0].charCodeAt(0) < clickedPiece.file.charCodeAt(0)) {
          movesLeft.push(splitId[0].charCodeAt(0));
        } else if (splitId[0].charCodeAt(0) > clickedPiece.file.charCodeAt(0)) {
          movesRight.push(splitId[0].charCodeAt(0));
        }
      }
    }
  }
}

function findPieceCaptures(squares, clickedPiece, clickedFile, clickedRow) {
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    let splitId = square.id.split("");
    let newFile = splitId[0].charCodeAt(0);
    let newRow = parseInt(splitId[1]);
    if (newFile == clickedFile) {
      if (square.dataset.occupied) {
        if (square.dataset.color !== clickedPiece.color) {
          if (newRow == blocked.up || newRow == blocked.down) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        }
      }
    } else if (newRow == clickedRow) {
      if (square.dataset.occupied) {
        if (square.dataset.color !== clickedPiece.color) {
          if (newFile == blocked.left || newFile == blocked.right) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        }
      }
    }
  });
}

export function handleRookMove(squares, clickedPiece, availableSquares) {
  allRookMoves(squares, clickedPiece);
  filterPieceMoves(clickedPiece);
  blocked.up = Math.min(...movesUp);
  blocked.down = Math.max(...movesDown);
  blocked.left = Math.max(...movesLeft);
  blocked.right = Math.min(...movesRight);

  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = parseInt(clickedPiece.row);

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let newFile = splitId[0].charCodeAt(0);
    let newRow = parseInt(splitId[1]);
    if (newFile == clickedFile) {
      if (newRow < blocked.up && clickedRow < newRow) {
        availableSquares.push(square.id);
      } else if (newRow > blocked.down && clickedRow > newRow) {
        availableSquares.push(square.id);
      }
    } else if (newRow == clickedRow) {
      if (newFile > blocked.left && newFile < clickedFile) {
        availableSquares.push(square.id);
      } else if (newFile < blocked.right && newFile > clickedFile) {
        availableSquares.push(square.id);
      }
    }
  });
  findPieceCaptures(squares, clickedPiece, clickedFile, clickedRow);
  highlightAvailableSquares(availableSquares);
}
