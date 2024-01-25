import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";
import { hypoBlockingMoves, hypotheticalCheck } from "../boardState/hypotheticalCheck.js";


let queenMoves = [];

let captureSquares = [];

let separatedMoves = {
  up: [],
  down: [],
  left: [],
  right: [],
  upLeft: [],
  upRight: [],
  downLeft: [],
  downRight: [],
};

let blocked = {
  up: "",
  down: "",
  left: "",
  right: "",
  upLeft: "",
  upRight: "",
  downLeft: "",
  downRight: "",
};

function allQueenMoves(squares, clickedPiece) {
  queenMoves = [];
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
          queenMoves.push(square.id);
        }
      }
    }
    if (file == clickedPiece.file.charCodeAt(0)) {
      queenMoves.push(square.id);
    } else if (row == clickedPiece.row) {
      queenMoves.push(square.id);
    }
  });
  return queenMoves;
}

function findAvailableBishoplikeMoves(
  blocked,
  squares,
  clickedPiece,
  availableSquares,
  colorToMove,
  isCheck,
  blockingMoves
) {
  const isWhite = clickedPiece.color == "white";
  let isCheckColor = isWhite ? isCheck.white : isCheck.black;
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;

  blockingMoves.forEach(move => {
    if (document.getElementById(move).dataset.occupied) {
      isCheckColor = false;
    }
  });

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);

    if (queenMoves.includes(square.id)) {
      if (file > clickedFile) {
        if (row > blocked.downRight && clickedRow > row) {
          if (!isCheckColor || blockingMoves.includes(square.id)) {
            if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
              availableSquares.push(square.id);
            }            
          }
        } else if (row < blocked.upRight && clickedRow < row) {
          if (!isCheckColor || blockingMoves.includes(square.id)) {
            if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
              availableSquares.push(square.id);
            }           
          }
        }
      } else if (file < clickedFile) {
        if (row < blocked.upLeft && clickedRow < row) {
          if (!isCheckColor || blockingMoves.includes(square.id)) {
            if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
              availableSquares.push(square.id);
            }         
          }
        } else if (row > blocked.downLeft && clickedRow > row) {
          if (!isCheckColor || blockingMoves.includes(square.id)) {
            if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
              availableSquares.push(square.id);
            }            
          }
        }
      }
    }
  });
}
function findAvailableRooklikeMoves(blocked, squares, availableSquares, colorToMove, clickedPiece, isCheck, blockingMoves) {
  const isWhite = clickedPiece.color == "white";
  let isCheckColor = isWhite ? isCheck.white : isCheck.black;
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;

  if (blockingMoves.includes(clickedPiece.square)) {
    return;
  }

  blockingMoves.forEach(move => {
    if (document.getElementById(move).dataset.occupied) {
      isCheckColor = false;
    }
  });

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);

    if (file == clickedFile) {
      if ((row < blocked.up && clickedRow < row) || (row > blocked.down && clickedRow > row)) {
        if (!isCheckColor || blockingMoves.includes(square.id)) {
          if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
            availableSquares.push(square.id);
          }           
        } 
      }
    } else if (row == clickedRow) {
      if ((file > blocked.left && file < clickedFile) || (file < blocked.right && file > clickedFile)) {
        if (!isCheckColor || blockingMoves.includes(square.id)) {
        if(!hypotheticalCheck || (hypotheticalCheck && hypoBlockingMoves.includes(square.id))) {
          availableSquares.push(square.id);
        }         
        }
      }
    }
  });
}

function filterRooklikeQueenMoves(clickedPiece) {
  for (const move of queenMoves) {
    let square = document.getElementById(move);
    if (square.dataset.occupied) {
      let splitId = square.id.split("");
      let file = splitId[0].charCodeAt(0);
      let row = parseInt(splitId[1]);
      let clickedFile = clickedPiece.file.charCodeAt(0);
      let clickedRow = clickedPiece.row;

      if (file == clickedFile) {
        if (row > clickedRow) {
          separatedMoves.up.push(row);
        } else if (row < clickedRow) {
          separatedMoves.down.push(row);
        }
      } else if (row == clickedRow) {
        if (file > clickedFile) {
          separatedMoves.right.push(file);
        } else if (file < clickedFile) {
          separatedMoves.left.push(file);
        }
      }
    }
  }
}

function filterBishoplikeQueenMoves(clickedPiece) {
  for (const move of queenMoves) {
    let square = document.getElementById(move);
    if (square.dataset.occupied) {
      let splitId = square.id.split("");
      let file = splitId[0].charCodeAt(0);
      let row = parseInt(splitId[1]);
      let clickedFile = clickedPiece.file.charCodeAt(0);
      let clickedRow = clickedPiece.row;
      if (file < clickedFile && row > clickedRow) {
        separatedMoves.upLeft.push(row);
      } else if (file < clickedFile && row < clickedRow) {
        separatedMoves.downLeft.push(row);
      } else if (file > clickedFile && row > clickedRow) {
        separatedMoves.upRight.push(row);
      } else if (file > clickedFile && row < clickedRow) {
        separatedMoves.downRight.push(row);
      }
    }
  }
}

function filterQueenMoves(clickedPiece) {
  separatedMoves = {
    up: [],
    down: [],
    left: [],
    right: [],
    upLeft: [],
    upRight: [],
    downLeft: [],
    downRight: [],
  };

  filterRooklikeQueenMoves(clickedPiece);
  filterBishoplikeQueenMoves(clickedPiece);
}

function findQueenCaptures(blocked, squares, clickedPiece) {
  captureSquares = [];
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;

  let closestPieces = {
    up: null,
    down: null,
    left: null,
    right: null,
    upLeft: null,
    upRight: null,
    downLeft: null,
    downRight: null,
  };

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);

    if (queenMoves.includes(square.id)) {
      if (square.dataset.occupied) {
        let direction;
        if (file == clickedFile) {
          direction = row > clickedRow ? "up" : "down";
        } else if (row == clickedRow) {
          direction = file > clickedFile ? "right" : "left";
        } else if (row > clickedRow) {
          direction = file > clickedFile ? "upRight" : "upLeft";
        } else if (row < clickedRow) {
          direction = file > clickedFile ? "downRight" : "downLeft";
        }

        if (
          !closestPieces[direction] ||
          (["up", "down"].includes(direction) &&
            Math.abs(row - clickedRow) <
              Math.abs(closestPieces[direction].row - clickedRow)) ||
          (["left", "right"].includes(direction) &&
            Math.abs(file - clickedFile) <
              Math.abs(closestPieces[direction].file - clickedFile)) ||
          (["upLeft", "upRight", "downLeft", "downRight"].includes(direction) &&
            Math.abs(file - clickedFile) + Math.abs(row - clickedRow) <
              Math.abs(closestPieces[direction].file - clickedFile) +
                Math.abs(closestPieces[direction].row - clickedRow))
        ) {
          closestPieces[direction] = { square, row, file };
        }
      }
    }
  });

  for (let direction in closestPieces) {
    let piece = closestPieces[direction];
    if (piece && piece.square.dataset.color !== clickedPiece.color) {
      let isOdd = piece.square.dataset.squareColor == "odd";
      if (
        !hypotheticalCheck ||
        (hypotheticalCheck && hypoBlockingMoves.includes(piece.square.id))
      ) {
        piece.square.classList.add(isOdd ? "capture-black" : "capture-white");
        piece.square.classList.remove(isOdd ? "black-to" : "white-to");
      }
    }
  }
}

export function handleQueenMove(
  squares,
  clickedPiece,
  availableSquares,
  colorToMove,
  isCheck,
  blockingMoves,
  hypotheticalMoves
) {
  queenMoves = allQueenMoves(squares, clickedPiece);

  separatedMoves = {
    up: [],
    down: [],
    left: [],
    right: [],
    upLeft: [],
    upRight: [],
    downLeft: [],
    downRight: [],
  };

  filterQueenMoves(clickedPiece);

  blocked = {
    up: Math.min(...separatedMoves.up),
    down: Math.max(...separatedMoves.down),
    left: Math.max(...separatedMoves.left),
    right: Math.min(...separatedMoves.right),
    upLeft: Math.min(...separatedMoves.upLeft),
    upRight: Math.min(...separatedMoves.upRight),
    downLeft: Math.max(...separatedMoves.downLeft),
    downRight: Math.max(...separatedMoves.downRight),
  };

  findAvailableBishoplikeMoves(
    blocked,
    squares,
    clickedPiece,
    availableSquares,
    colorToMove,
    isCheck,
    blockingMoves,
    hypotheticalMoves
  );
  findAvailableRooklikeMoves(blocked, squares, availableSquares, colorToMove, clickedPiece, isCheck, blockingMoves, hypotheticalMoves);
  findQueenCaptures(blocked, squares, clickedPiece);

  highlightAvailableSquares(availableSquares);
}
