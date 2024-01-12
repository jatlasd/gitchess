import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";

let pawnMoves;
let blockedSquares;
let blocked;

function allPawnMoves(squares, clickedPiece) {
  pawnMoves = [];
  const clickedFile = clickedPiece.file.charCodeAt(0);
  const clickedRow = clickedPiece.row;
  const moveDirection = clickedPiece.color === "white" ? 1 : -1;
  squares.forEach((square) => {
    let split = square.id.split("");
    let file = split[0].charCodeAt(0);
    let row = parseInt(split[1]);
    if (file == clickedFile) {
      if (!clickedPiece.hasMoved) {
        if (
          row == clickedRow + moveDirection ||
          row == clickedRow + 2 * moveDirection
        ) {
          pawnMoves.push(square.id);
        }
      } else {
        if (row == clickedRow + moveDirection) {
          pawnMoves.push(square.id);
        }
      }
    }
  });
}

function findPawnBlock(clickedPiece) {
  blockedSquares = [];
  const isWhite = clickedPiece.color == "white";
  for (const move of pawnMoves) {
    let square = document.getElementById(move);
    let split = square.id.split("");
    let row = parseInt(split[1]);
    if (square.dataset.occupied) {
      blockedSquares.push(row);
    }
  }
  if (isWhite) {
    blocked = Math.min(...blockedSquares);
  } else {
    blocked = Math.max(...blockedSquares);
  }
}

export function findPawnCaptures(squares, clickedPiece) {
  const isWhite = clickedPiece.color == "white";
  const clickedFile = clickedPiece.file.charCodeAt(0);
  const clickedRow = clickedPiece.row;
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    let split = square.id.split("");
    let file = split[0].charCodeAt(0);
    let row = parseInt(split[1]);
    if (file == clickedFile + 1 || file == clickedFile - 1) {
      if (
        square.dataset.color !== clickedPiece.color &&
        square.dataset.occupied
      ) {
        if (row == (isWhite ? clickedRow + 1 : clickedRow - 1)) {
          square.classList.add(isOdd ? "capture-black" : "capture-white");
          square.classList.remove(isOdd ? "black-to" : "white-to");
        }
      }
    }
  });
}

export function handlePawnPromotion(square) {
  let pieces = ["queen", "bishop", "rook", "knight"];
  let splitId = square.id.split("");
  let whiteToPromote = parseInt(splitId[1]) == 8;
  if (parseInt(splitId[1]) == 8 || parseInt(splitId[1]) == 1) {
    let promoteSquare = square.id;
    let select = document.createElement("div");
    select.className = "pawn-select";
    for (let i = 0; i < 4; i++) {
      let piece = document.createElement("div");
      piece.classList.add(`select-piece`);
      piece.classList.add(pieces[i]);
      piece.id = `${whiteToPromote ? "white" : "black"}-${pieces[i]}`;
      piece.style.setProperty(
        "background-image",
        `url(../assets/${whiteToPromote ? "white" : "black"}-${pieces[i]}.png`
      );
      select.appendChild(piece);
    }
    square.appendChild(select);
    setPiece(promoteSquare, select);
  }
}

function setPiece(promoteSquare, select) {
  let promotionSquare = document.getElementById(promoteSquare);
  let pieces = document.querySelectorAll(".select-piece");
  pieces.forEach((piece) => {
    piece.addEventListener("click", function () {
      promotionSquare.classList.remove("pawn");
      promotionSquare.classList.add(piece.classList[1]);
      promotionSquare.dataset.piece = piece.classList[1];
      promotionSquare.style.setProperty(
        "background-image",
        `url(../assets/${piece.id}.png)`
      );
      select.remove();
    });
  });
}

export function handlePawnMove(squares, clickedPiece, availableSquares) {
  const isWhite = clickedPiece.color == "white";
  const clickedFile = clickedPiece.file.charCodeAt(0);
  const clickedRow = clickedPiece.row;
  allPawnMoves(squares, clickedPiece);
  findPawnBlock(clickedPiece);
  squares.forEach((square) => {
    let split = square.id.split("");
    let file = split[0].charCodeAt(0);
    let row = parseInt(split[1]);
    if (pawnMoves.includes(square.id)) {
      if (file == clickedFile) {
        if (isWhite) {
          if (row < blocked && row > clickedRow) {
            availableSquares.push(square.id);
          }
        } else {
          if (row > blocked && row < clickedRow) {
            availableSquares.push(square.id);
          }
        }
      }
    }
  });
  highlightAvailableSquares(availableSquares);
  findPawnCaptures(squares, clickedPiece);
}
