let kings = {
  white: "",
  black: "",
};

let isCheck = {
  white: false,
  black: false,
};

let kingPosition;
let blockingMoves = [];

function getKingPosition(squares) {
  squares.forEach((square) => {
    const isKing = square.dataset.piece == "king";
    if (isKing) {
      const color = square.dataset.color;
      kings[color] = `${square.id}`;
      kingPosition = kings[color];
    }
  });
}

let checkingPiece = {
  color: "",
  piece: "",
  location: "",
};

function checkIfIsCheck(squares, allMoves, colorToMove) {
  isCheck.white = false
  isCheck.black = false
  getKingPosition(squares);
  if (NodeList.prototype.isPrototypeOf(squares)) {
    squares = Array.from(squares);
  }
  let kingPosition = colorToMove == "white" ? kings.white : kings.black;
  let opposingColor = colorToMove == "white" ? "black" : "white";

  for (let pieceType in allMoves[opposingColor]) {
    if (pieceType == "queen") {
      for (let move of allMoves[opposingColor].queen) {
        let index = move.indexOf(kingPosition);
        if (index !== -1) {
          isCheck[colorToMove] = true;
          checkingPiece = {
            color: opposingColor,
            type: "queen",
            piece: "",
            position: squares
              .filter((square) => {
                return (
                  square.dataset.piece == pieceType &&
                  square.dataset.color == opposingColor
                );
              })
              .map((square) => square.id),
          };
        }
      }
    } else {
      for (let piece in allMoves[opposingColor][pieceType]) {
        for (let move of allMoves[opposingColor][pieceType][piece]) {
          let index = move.indexOf(kingPosition);
          if (index !== -1) {
            isCheck[colorToMove] = true;
            checkingPiece = {
              color: opposingColor,
              type: pieceType,
              piece: piece,
              position: squares
                .filter((square) => {
                  return (
                    square.dataset.piece == pieceType &&
                    square.dataset.pieceIdentifier == piece &&
                    square.dataset.color == opposingColor
                  );
                })
                .map((square) => square.id),
            };
          }
        }
      }
    }
  }

  return !checkingPiece.color == "" ? checkingPiece : null; // Return null if no piece is checking the king
}

function handleInCheckMove(
  squares,
  allMoves,
  colorToMove,
  validMoves,
  checkingPiece
) {
  if (checkingPiece !== null) {
    getBlockingMoves(squares, allMoves, colorToMove, checkingPiece, validMoves);
  }
}

function getBlockingMoves(squares, allMoves, colorToMove, checkingPiece) {
  let checkingPieceMoves;
  let validMoves = [];
  getKingPosition(squares, colorToMove);
  if (NodeList.prototype.isPrototypeOf(squares)) {
    squares = Array.from(squares);
  }
  let opposingColor = colorToMove == "white" ? "black" : "white";

  // Get the moves of the checking piece
  if (checkingPiece.type == "queen") {
    checkingPieceMoves = allMoves[opposingColor].queen;
  } else {
    checkingPieceMoves =
      allMoves[opposingColor][checkingPiece.type][checkingPiece.piece];
  }
  // Iterate over the moves of the checking piece
  for (let move of checkingPieceMoves) {
    if (move === checkingPiece.position) {
      validMoves.push(move);
    } else {
      // Flatten the array of moves for the checking piece
      let allCheckingPieceMoves = [].concat(...checkingPieceMoves);
      if (allCheckingPieceMoves.includes(move)) {
        // Check if the move captures the checking piece or blocks the check
        blockingMoves = isOnLineOfAttack(
          checkingPiece,
          colorToMove,
          kingPosition,
          allCheckingPieceMoves
        );
        if (blockingMoves.includes(move)) {
          validMoves.push(move);
        }
      }
    }
  }
}




function isOnLineOfAttack(
  checkingPiece,
  colorToMove,
  kingPosition,
  validMoves
) {
  const isWhite = colorToMove == "white";
  kingPosition = isWhite ? kings.white : kings.black;
  let blockingMoves = [];
  let [kingFile, kingRow] = kingPosition.split("");
  let [checkingFile, checkingRow] = checkingPiece.position[0].split("");
  kingRow = parseInt(kingRow);
  checkingRow = parseInt(checkingRow);

  for (let move of validMoves) {
    let [moveFile, moveRow] = move.split("");
    moveRow = parseInt(moveRow);

    // Up and Down
    if (kingFile == checkingFile && moveFile == kingFile) {
      if (checkingRow > kingRow) {
        if (moveRow < checkingRow && moveRow > kingRow) {
          blockingMoves.push(move);
        }
      } else if (checkingRow < kingRow) {
        if (moveRow > checkingRow && moveRow < kingRow) {
          blockingMoves.push(move);
        }
      }
      // Left and Right
    } else if (kingRow == checkingRow && moveRow == kingRow) {
      if (checkingFile < kingFile) {
        if (moveFile > checkingFile && moveFile < kingFile) {
          blockingMoves.push(move);
        }
      } else if (checkingFile > kingFile) {
        if (moveFile < checkingFile && moveFile > kingFile) {
          blockingMoves.push(move);
        }
      }
    }
    // Diagonal
    else if (
      Math.abs(kingFile.charCodeAt(0) - moveFile.charCodeAt(0)) ==
      Math.abs(kingRow - moveRow)
    ) {
      if (
        (checkingFile < kingFile &&
          checkingRow < kingRow &&
          moveFile > checkingFile &&
          moveRow > checkingRow &&
          moveFile < kingFile &&
          moveRow < kingRow) ||
        (checkingFile > kingFile &&
          checkingRow > kingRow &&
          moveFile < checkingFile &&
          moveRow < checkingRow &&
          moveFile > kingFile &&
          moveRow > kingRow) ||
        (checkingFile < kingFile &&
          checkingRow > kingRow &&
          moveFile > checkingFile &&
          moveRow < checkingRow &&
          moveFile < kingFile &&
          moveRow > kingRow) ||
        (checkingFile > kingFile &&
          checkingRow < kingRow &&
          moveFile < checkingFile &&
          moveRow > checkingRow &&
          moveFile > kingFile &&
          moveRow < kingRow)
      ) {
        blockingMoves.push(move);
      }
    }
  }
  return blockingMoves;
}

export function handleIsCheck(squares, allMoves, colorToMove, validMoves) {
  let checkingPiece = checkIfIsCheck(squares, allMoves, colorToMove);
  if (checkingPiece !== null) {
    handleInCheckMove(
      squares,
      allMoves,
      colorToMove,
      validMoves,
      checkingPiece
    );
  }
}


export { isCheck, blockingMoves };
