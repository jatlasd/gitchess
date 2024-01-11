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

  let whiteCastle = [
    ["b1", "c1", "d1"],
    ["f1", "g1"],
  ];

  let blackCastle = [
    ["b8", "c8", "d8"],
    ["f8", "g8"],
  ];

  if (!clickedPiece.hasMoved) {
    if (isWhite) {
      if (checkCastleSquares(whiteCastle)[0]) {
        if (!document.getElementById("a1").dataset.hasMoved) {
          castle.canCastle = true;
          castle.queensideCastle = true;
          availableSquares.push("c1");
        }
      }
      if (checkCastleSquares(whiteCastle)[1]) {
        if (!document.getElementById("h1").dataset.hasMoved) {
          castle.canCastle = true;
          castle.kingsideCastle = true;
          availableSquares.push("g1");
        }
      }
    } else if (!isWhite) {
      if (checkCastleSquares(blackCastle)[0]) {
        if (!document.getElementById("a8").dataset.hasMoved) {
          castle.canCastle = true;
          castle.queensideCastle = true;
          availableSquares.push("c8");
        }
      }
      if (checkCastleSquares(blackCastle)[1]) {
        if (!document.getElementById("h8").dataset.hasMoved) {
          castle.canCastle = true;
          castle.kingsideCastle = true;
          availableSquares.push("g8");
        }
      }
    }
  }
}

function checkCastleSquares(colorCastle) {
  return colorCastle.map((row) =>
    row.every((squareId) => {
      const square = document.getElementById(squareId);
      return square && !square.dataset.occupied;
    })
  );
}

export function handleCastle(squares, castle, clickedPiece) {
  squares.forEach((square) => {
    let splitId = square.id.split("");
    let row = parseInt(splitId[1]);
    if (castle.kingsideCastle) {
      if (square.dataset.color == clickedPiece.color)
        if (square.dataset.piece == "rook" && splitId[0] == "h") {
          let newId = "f" + row;
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
    } else if (castle.queensideCastle) {
      if (square.dataset.color == clickedPiece.color) {
        if (square.dataset.piece == "rook" && splitId[0] == "a") {
          let newId = "d" + row;
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
      }
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
