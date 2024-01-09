import { populateBoard } from "./src/board/populateBoard.js";
import { handlePawnMove } from "./src/pieces/pawn.js";
import { handleRookMove } from "./src/pieces/rook.js";

populateBoard();

let squares = document.querySelectorAll(".square");
let colorToMove = "white";

squares.forEach((square) => {
  square.addEventListener("click", () => {
    if (moveSquares.length == 0) {
      moveSquares.push(square.dataset.color);
    }
    if (square.dataset.color == colorToMove) {
      if (square.dataset.occupied) {
        assignClickedPiece(square);
        handlePieceClick(event);
        movePiece();
      }
    }
  });
});

// Important Variables
let availableSquares = [];
let clickedPiece = {};
let moveSquares = [];

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

function highlightAvailableSquares() {
  squares.forEach((square) => {
    for (let i = 0; i < availableSquares.length; i++) {
      if (square.id === availableSquares[i]) {
        if (!square.dataset.occupied) {
          square.classList.contains("odd")
            ? square.classList.add("black-available")
            : square.classList.add("white-available");
        }
      }
    }
  });
}

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
  const isSelectedBlack = square.classList.contains("selected-black");
  const isSelectedWhite = square.classList.contains("selected-white");
  const isOdd = square.classList.contains("odd");

  if (!isSelectedBlack && !isSelectedWhite) {
    square.classList.add(isOdd ? "selected-black" : "selected-white");
    moveSquares.push(square.id);
    switch (square.dataset.piece) {
      case "pawn":
        return handlePawnMove(squares, clickedPiece, availableSquares);
      case "rook":
        return handleRookMove(squares, clickedPiece, availableSquares);
      case "knight":
        return handleKnightMove();
      case "bishop":
        return handleBishopMove();
      case "king":
        return handleKingMove();
      case "queen":
        return handleQueenMove();
    }
  } else if (isSelectedBlack || isSelectedWhite) {
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
  square.classList.add(clickedPiece.color, clickedPiece.piece);
  square.dataset.move = true;
  square.dataset.color = clickedPiece.color;
  square.dataset.piece = clickedPiece.piece;
  if (clickedPiece.piece == "pawn") {
    square.dataset.hasMoved = true;
  }
  square.dataset.occupied = true;
  square.style.setProperty(
    "background-image",
    `url(assets/${clickedPiece.color}-${clickedPiece.piece}.png)`
  );
}

function clearOldSquare() {
  squares.forEach((square) => {
    if (square.id == moveSquares[1]) {
      const isOdd = square.classList.contains("odd");
      square.classList.remove(clickedPiece.color, clickedPiece.piece);
      square.dataset.move = true;
      square.dataset.color = "";
      square.dataset.piece = "";
      square.dataset.occupied = "";
      square.style.setProperty("background-image", "");
      setMoveSquares();
      square.classList.remove(isOdd ? "selected-black" : "selected-white");
    }
  });
}

// Individual Piece Movements and Captures

function clearCaptureClass() {
  squares.forEach((square) => {
    const isBlack = square.classList.contains("capture-black");
    square.classList.remove(isBlack ? "capture-black" : "capture-white");
  });
  setMoveSquares();
}

//! Bishop

function handleBishopMove() {}

//! Knight

function handleKnightMove() {}

//! Queen

function handleQueenMove() {}

//! King

function handleKingMove() {}
