import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";

let queenMoves = [];

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
}

function findAvailableBishoplikeMoves(
  blocked,
  squares,
  clickedPiece,
  availableSquares
) {
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);

    if (queenMoves.includes(square.id)) {
      if (file > clickedFile) {
        if (row > blocked.downRight && clickedRow > row) {
          availableSquares.push(square.id);
        } else if (row < blocked.upRight && clickedRow < row) {
          availableSquares.push(square.id);
        }
      } else if (file < clickedFile) {
        if (row < blocked.upLeft && clickedRow < row) {
          availableSquares.push(square.id);
        } else if (row > blocked.downLeft && clickedRow > row) {
          availableSquares.push(square.id);
        }
      }
    }
  });
}

function findAvailableRooklikeMoves(
  blocked,
  squares,
  availableSquares,
  clickedPiece
) {
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;

  squares.forEach((square) => {
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);
    if (file == clickedFile) {
      if (row < blocked.up && clickedRow < row) {
        availableSquares.push(square.id);
      } else if (row > blocked.down && clickedRow > row) {
        availableSquares.push(square.id);
      }
    } else if (row == clickedRow) {
      if (file > blocked.left && file < clickedFile) {
        availableSquares.push(square.id);
      } else if (file < blocked.right && file > clickedFile) {
        availableSquares.push(square.id);
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
  let clickedFile = clickedPiece.file.charCodeAt(0);
  let clickedRow = clickedPiece.row;
  squares.forEach((square) => {
    const isOdd = square.dataset.squareColor == "odd";
    let splitId = square.id.split("");
    let file = splitId[0].charCodeAt(0);
    let row = parseInt(splitId[1]);
    if (queenMoves.includes(square.id)) {
      if (
        square.dataset.occupied &&
        square.dataset.color !== clickedPiece.color
      ) {
        if (file == clickedFile) {
          if (row == blocked.up || row == blocked.down) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        } else if (row == clickedRow) {
          if (file == blocked.right || file == blocked.left) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        } else if (row > clickedRow) {
          if (row == blocked.upRight || row == blocked.upLeft) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        } else if (row < clickedRow) {
          if (row == blocked.downRight || row == blocked.downLeft) {
            square.classList.add(isOdd ? "capture-black" : "capture-white");
            square.classList.remove(isOdd ? "black-to" : "white-to");
          }
        }
      }
    }
  });
}

export function handleQueenMove(squares, clickedPiece, availableSquares) {
  allQueenMoves(squares, clickedPiece);
  filterQueenMoves(clickedPiece);

  blocked.upLeft = Math.min(...separatedMoves.upLeft);
  blocked.upRight = Math.min(...separatedMoves.upRight);
  blocked.downLeft = Math.max(...separatedMoves.downLeft);
  blocked.downRight = Math.max(...separatedMoves.downRight);
  blocked.up = Math.min(...separatedMoves.up);
  blocked.down = Math.max(...separatedMoves.down);
  blocked.left = Math.max(...separatedMoves.left);
  blocked.right = Math.min(...separatedMoves.right);

  findAvailableBishoplikeMoves(
    blocked,
    squares,
    clickedPiece,
    availableSquares
  );
  findAvailableRooklikeMoves(blocked, squares, availableSquares, clickedPiece);
  findQueenCaptures(blocked, squares, clickedPiece);

  highlightAvailableSquares(availableSquares);
}
