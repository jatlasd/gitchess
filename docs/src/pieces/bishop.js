import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";
import { hypotheticalCheck, hypoBlockingMoves } from "../boardState/hypotheticalCheck.js";


let bishopMoves;

let upLeft;
let upRight;
let downLeft;
let downRight;

let blocked = {
  upLeft: "",
  upRight: "",
  downLeft: "",
  downRight: "",
};

function allBishopMoves(squares, clickedPiece) {
  bishopMoves = [];
  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);
    for (let i = 1; i <= 8; i++) {
      if (row == clickedPiece.row + i || row == clickedPiece.row - i) {
        if (
          file == clickedPiece.file.charCodeAt(0) + i ||
          file == clickedPiece.file.charCodeAt(0) - i
        ) {
          bishopMoves.push(square.id);
        }
      }
    }
  });
}

function filterBishopMoves(clickedPiece) {
  upLeft = [];
  upRight = [];
  downLeft = [];
  downRight = [];
  for (const move of bishopMoves) {
    let square = document.getElementById(move);
    if (square.dataset.occupied) {
      let splitId = square.id.split("");
      let file = splitId[0].charCodeAt(0);
      let row = parseInt(splitId[1]);
      let clickedFile = clickedPiece.file.charCodeAt(0);
      let clickedRow = clickedPiece.row;
      if (file < clickedFile && row > clickedRow) {
        upLeft.push(row);
      } else if (file < clickedFile && row < clickedRow) {
        downLeft.push(row);
      } else if (file > clickedFile && row > clickedRow) {
        upRight.push(row);
      } else {
        downRight.push(row);
      }
    }
  }
}

function findBishopCaptures(squares, clickedPiece) {
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    let splitId = square.id.split("");
    let row = parseInt(splitId[1]);
    if (bishopMoves.includes(square.id)) {
      if (square.dataset.occupied) {
        if (square.dataset.color !== clickedPiece.color) {
          if (row == blocked.downRight || row == blocked.upRight) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              square.classList.add(isOdd ? "capture-black" : "capture-white");
              square.classList.remove(isOdd ? "black-to" : "white-to");
            }
          } else if (row == blocked.upLeft || row == blocked.downLeft) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              square.classList.add(isOdd ? "capture-black" : "capture-white");
              square.classList.remove(isOdd ? "black-to" : "white-to");
            }
          }
        }
      }
    }
  });
}
export function handleBishopMove(squares, clickedPiece, availableSquares, colorToMove, isCheck, blockingMoves, hypotheticalMoves) {
  const isWhite = clickedPiece.color == 'white'
  let isCheckColor = isWhite ? isCheck.white : isCheck.black
  allBishopMoves(squares, clickedPiece);
  filterBishopMoves(clickedPiece);
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;
  blocked.upLeft = Math.min(...upLeft);
  blocked.upRight = Math.min(...upRight);
  blocked.downLeft = Math.max(...downLeft);
  blocked.downRight = Math.max(...downRight);

  if (blockingMoves.includes(clickedPiece.square)) {
    return;
  }
  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);
    if (bishopMoves.includes(square.id)) {
      if (file > clickedFile) {
        if (row > blocked.downRight && clickedRow > row) {
          if(!isCheckColor || blockingMoves.includes(square.id)) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              availableSquares.push(square.id);
            }         
          }
        } else if (row < blocked.upRight && clickedRow < row) {
          if(!isCheckColor || blockingMoves.includes(square.id)) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              availableSquares.push(square.id);
            }        
          }
        }
      } else if (file < clickedFile) {
        if (row < blocked.upLeft && clickedRow < row) {
          if(!isCheckColor || blockingMoves.includes(square.id)) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              availableSquares.push(square.id);
            }         
          }
        } else if (row > blocked.downLeft && clickedRow > row) {
          if(!isCheckColor || blockingMoves.includes(square.id)) {
            if (
              !hypotheticalCheck ||
              (hypotheticalCheck && hypoBlockingMoves.includes(square.id))
            ) {
              availableSquares.push(square.id);
            }         
          }        
        }
      }
    }
  });
  findBishopCaptures(squares, clickedPiece);
  highlightAvailableSquares(availableSquares);
}
