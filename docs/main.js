import { populateBoard } from "./src/board/populateBoard.js";
import { handlePawnMove, handlePawnPromotion } from "./src/pieces/pawn.js";
import { handleRookMove } from "./src/pieces/rook.js";
import { handleBishopMove } from "./src/pieces/bishop.js";
import { handleKnightMove } from "./src/pieces/knight.js";
import { handleKingMove, handleCastle } from "./src/pieces/king.js";
import { handleQueenMove } from "./src/pieces/queen.js";
import { highlightAvailableSquares } from "./src/squareChanges/availableSquares.js";

populateBoard();

/* 

To Do:
  - checks
    - detect when check is present
    - only allow moves that block check or capture checking piece
    - disallow moves which put king in check

*/

let squares = document.querySelectorAll(".square");
let colorToMove = "white";
let availableSquares = [];
let clickedPiece = {};
let moveSquares = [];
let castle = {
  canCastle: false,
  kingsideCastle: false,
  queensideCastle: false,
};





squares.forEach((square) => {
  square.addEventListener("click", () => {
    let selectedSquare = square.id;
    if (square.dataset.color == colorToMove) {
      if (square.dataset.occupied) {
        if (moveSquares.length == 0) {
          assignClickedPiece(square);
          handlePieceClick(event);
          movePiece();
        } else {
          if (moveSquares[0] !== selectedSquare) {
            clickedPiece = {};
            availableSquares = [];
            moveSquares = [];
            removeSelectedSquares();
            removeHighlightAvailableSquares();
            clearCaptureClass();
            assignClickedPiece(square);
            handlePieceClick(event);
            movePiece();
          } else {
            clickedPiece = {};
            moveSquares = [];
            removeSelectedSquares();
            removeHighlightAvailableSquares();
            if (square.dataset.move) {
              square.dataset.move = "";
            }
            clearCaptureClass();
          }
        }
      }
    }
  });
});

// Universal Functions
function assignClickedPiece(square) {
  let splitSquare = square.id.split("");
  clickedPiece = {
    color: square.dataset.color,
    piece: square.dataset.piece,
    file: splitSquare[0],
    row: parseInt(splitSquare[1]),
    hasMoved: square.dataset.hasMoved,
    isTo: square.dataset.isTo,
  };
}

//! highlights.js

function removeHighlightAvailableSquares() {
  availableSquares = [];
  squares.forEach((square) => {
    if (
      square.classList.contains("white-available") ||
      square.classList.contains("black-available")
    ) {
      square.classList.contains("odd")
        ? square.classList.remove("black-available")
        : square.classList.remove("white-available");
    }
  });
}

//!

function handlePieceClick(e) {
  const square = e.target;
  const isOdd = square.classList.contains("odd");
  square.classList.add(isOdd ? "selected-black" : "selected-white");
  moveSquares.push(square.id);
  switch (square.dataset.piece) {
    case "pawn":
      return handlePawnMove(squares, clickedPiece, availableSquares);
    case "rook":
      return handleRookMove(squares, clickedPiece, availableSquares);
    case "knight":
      return handleKnightMove(squares, clickedPiece, availableSquares);
    case "bishop":
      return handleBishopMove(squares, clickedPiece, availableSquares);
    case "king":
      return handleKingMove(squares, clickedPiece, availableSquares, castle);
    case "queen":
      return handleQueenMove(squares, clickedPiece, availableSquares);
  }
}
// Universal Piece Movement

function movePiece() {
  squares.forEach((square) => {
    square.addEventListener("click", handleClick);
  });
}

function handleClick(e) {
  const square = e.target;
  const whiteToMove = colorToMove == "white";
  if (
    square.classList.contains("black-available") ||
    square.classList.contains("white-available") ||
    square.classList.contains("capture-white") ||
    square.classList.contains("capture-black")
  ) {
    colorToMove = whiteToMove ? "black" : "white";
    if (castle.canCastle) {
      handleCastle(squares, castle, clickedPiece);
    }
    clearCaptureClass();
    removeMoveSquares();
    setNewSquare(square);
    clearOldSquare();
    removeHighlightAvailableSquares();
    moveSquares = [];
    clickedPiece = {};
  }
}

function removeSelectedSquares() {
  squares.forEach((square) => {
    const isOdd = square.classList.contains("odd");
    square.classList.remove(isOdd ? "selected-black" : "selected-white");
  });
}

function setMoveSquares() {
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    if (square.dataset.move) {
      square.classList.add(isOdd ? "black-to" : "white-to");
    }
  });
}

function removeMoveSquares() {
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    if (square.dataset.move) {
      square.classList.remove(isOdd ? "black-to" : "white-to");
    }
    square.dataset.move = "";
  });
}

function setNewSquare(square) {
  showCapturedPiece(square);
  square.classList.add(clickedPiece.color, clickedPiece.piece);
  square.dataset.move = true;
  square.dataset.color = clickedPiece.color;
  square.dataset.piece = clickedPiece.piece;
  square.dataset.hasMoved = true;
  square.dataset.occupied = true;
  square.style.setProperty(
    "background-image",
    `url(assets/${clickedPiece.color}-${clickedPiece.piece}.png)`
  );
  if(square.dataset.piece == 'pawn') {
    handlePawnPromotion(square, clickedPiece)
  }
}

function showCapturedPiece(square) {
  const isWhite = square.dataset.color == "white";
  let capturedPieceSquare = document.createElement("div");
  capturedPieceSquare.className = "capturedPieceSquare";
  capturedPieceSquare.style.setProperty(
    "background-image",
    `url(assets/${square.dataset.color}-${square.dataset.piece}.png)`
  );
  if (square.dataset.occupied) {
    document
      .getElementById(isWhite ? "black-captures" : "white-captures")
      .appendChild(capturedPieceSquare);
  }
}

function clearOldSquare() {
  let oldSquare = document.getElementById(moveSquares[0]);
  const isOdd = oldSquare.classList.contains("odd");
  oldSquare.classList.remove(clickedPiece.color, clickedPiece.piece);
  oldSquare.dataset.move = true;
  oldSquare.dataset.color = "";
  oldSquare.dataset.piece = "";
  oldSquare.dataset.occupied = "";
  oldSquare.style.setProperty("background-image", "");
  setMoveSquares();
  oldSquare.classList.remove(isOdd ? "selected-black" : "selected-white");
}

// Individual Piece Movements and Captures

function clearCaptureClass() {
  squares.forEach((square) => {
    const isBlack = square.classList.contains("capture-black");
    square.classList.remove(isBlack ? "capture-black" : "capture-white");
  });
  setMoveSquares();
}


