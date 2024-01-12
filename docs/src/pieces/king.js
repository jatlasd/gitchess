import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";

let kingMoves;

function allKingMoves(squares, clickedPiece) {
  kingMoves = [];
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;
  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);
    if (row == clickedRow || row == clickedRow + 1 || row == clickedRow - 1) {
      if (
        file == clickedFile ||
        file == clickedFile - 1 ||
        file == clickedFile + 1
      ) {
        kingMoves.push(square.id);
      }
    }
  });
}

function filterKingMoves(clickedPiece, availableSquares) {
  for (const move of kingMoves) {
    let square = document.getElementById(move);
    const isOdd = square.dataset.squareColor == "odd";
    if (!square.dataset.occupied) {
      availableSquares.push(square.id);
    } else if (square.dataset.color !== clickedPiece.color) {
      square.classList.add(isOdd ? "capture-black" : "capture-white");
      square.classList.remove(isOdd ? "black-to" : "white-to");
    }
  }
}


function checkCastle(clickedPiece, availableSquares, castle) {
  let isWhite = clickedPiece.color == "white";
  let castleSquares = isWhite ? [["b1", "c1", "d1"], ["f1", "g1"]] : [["b8", "c8", "d8"], ["f8", "g8"]];
  let rookPositions = isWhite ? ["a1", "h1"] : ["a8", "h8"];
  let castlePositions = isWhite ? ["c1", "g1"] : ["c8", "g8"];

  if (!clickedPiece.hasMoved) {
    castleSquares.forEach((squares, index) => {
      if (checkCastleSquares(squares)) {
        if (!document.getElementById(rookPositions[index]).dataset.hasMoved) {
          castle.canCastle = true;
          castle.queensideCastle = index === 0;
          castle.kingsideCastle = index === 1;
          availableSquares.push(castlePositions[index]);
        }
      }
    });
  }
}

function checkCastleSquares(squares) {
  return squares.every((squareId) => {
    const square = document.getElementById(squareId);
    return square && !square.dataset.occupied;
  });
}

export function handleCastle(squares, castle, clickedPiece) {
  squares.forEach((square) => {
    let splitId = square.id.split("");
    let row = parseInt(splitId[1]);
    let isKingside = castle.kingsideCastle;
    let rookPosition = isKingside ? "h" : "a";
    let newId = (isKingside ? "f" : "d") + row;

    if (square.dataset.color == clickedPiece.color && square.dataset.piece == "rook" && splitId[0] == rookPosition) {
      let newSquare = document.getElementById(newId);
      square.classList.remove(clickedPiece.color, clickedPiece.piece);
      square.dataset.move = true;
      square.dataset.color = "";
      square.dataset.piece = "";
      square.dataset.occupied = "";
      square.style.setProperty("background-image", "");
      newSquare.classList.add(clickedPiece.color, "rook");
      newSquare.dataset.move = true;
      newSquare.dataset.color = clickedPiece.color;
      newSquare.dataset.piece = "rook";
      newSquare.dataset.hasMoved = true;
      newSquare.dataset.occupied = true;
      newSquare.style.setProperty(
        "background-image",
        `url(assets/${clickedPiece.color}-rook.png)`
      );
    }
  });
  castle.kingsideCastle = false;
  castle.queensideCastle = false;
  castle.canCastle = false;
}

export function handleKingMove(
  squares,
  clickedPiece,
  availableSquares,
  castle
) {
  allKingMoves(squares, clickedPiece);
  filterKingMoves(clickedPiece, availableSquares);
  checkCastle(clickedPiece, availableSquares, castle);
  highlightAvailableSquares(availableSquares);
}
