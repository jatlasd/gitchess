import { isCheck } from "./check.js";
let hypoKings = {
    white: "",
    black: "",
  };
  
  let hypotheticalCheck = false
  
  let kingPosition;
  let hypoBlockingMoves = [];
  
  function getKingPosition(hypotheticalBoard) {
    hypotheticalBoard.forEach((square) => {
      const isKing = square.dataset.piece == "king";
      if (isKing) {
        const color = square.dataset.color
        hypoKings[color] = `${square.id}`;
        kingPosition = hypoKings[color];
      }
    });
  }
  
  let hypotheticalCheckingPiece = {
    color: "",
    piece: "",
    location: "",
  };

  function checkIfIsDiscoveredCheck(hypotheticalBoard, hypotheticalMoves, colorToMove) {
    hypotheticalCheck = false
    getKingPosition(hypotheticalBoard);
    if (NodeList.prototype.isPrototypeOf(hypotheticalBoard)) {
      hypotheticalBoard = Array.from(hypotheticalBoard);
    }
    let kingPosition = colorToMove == "white" ? hypoKings.white : hypoKings.black;
    let opposingColor = colorToMove == "white" ? "black" : "white";
    
  
    for (let pieceType in hypotheticalMoves[opposingColor]) {
      if (pieceType == "queen") {
        for (let move of hypotheticalMoves[opposingColor].queen) {
          let index = move.indexOf(kingPosition);
          if (index !== -1) {
            if(isCheck[colorToMove] == false) {
              hypotheticalCheck = true;
              hypotheticalCheckingPiece = {
                color: opposingColor,
                type: "queen",
                piece: "",
                position: hypotheticalBoard
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
        }
      } else {
        for (let piece in hypotheticalMoves[opposingColor][pieceType]) {
          for (let move of hypotheticalMoves[opposingColor][pieceType][piece]) {
            let index = move.indexOf(kingPosition);
            if (index !== -1) {
              if(isCheck[colorToMove] == false) {
                hypotheticalCheck = true;
                hypotheticalCheckingPiece = {
                  color: opposingColor,
                  type: pieceType,
                  piece: piece,
                  position: hypotheticalBoard
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
    }
  
    return !hypotheticalCheckingPiece.color == "" ? hypotheticalCheckingPiece : null; // Return null if no piece is checking the king
  }
  
  function handleInDiscoveredCheckMove(
    hypotheticalBoard,
    hypotheticalMoves,
    colorToMove,
    hypoValidMoves,
    hypotheticalCheckingPiece
  ) {
    if (hypotheticalCheckingPiece !== null) {
      getBlockingMoves(hypotheticalBoard, hypotheticalMoves, colorToMove, hypotheticalCheckingPiece, hypoValidMoves);
    }
  }

  function getBlockingMoves(hypotheticalBoard, hypotheticalMoves, colorToMove, hypotheticalCheckingPiece) {
    let checkingPieceMoves;
    let hypotheticalValidMoves = [];
    getKingPosition(hypotheticalBoard, colorToMove);
    // if (NodeList.prototype.isPrototypeOf(squares)) {
      //   squares = Array.from(squares);
      // }
      let opposingColor = colorToMove == "white" ? "black" : "white";
  
    // Get the moves of the checking piece
    if (hypotheticalCheckingPiece.type == "queen") {
      checkingPieceMoves = hypotheticalMoves[opposingColor].queen;
    } else {
      checkingPieceMoves =
        hypotheticalMoves[opposingColor][hypotheticalCheckingPiece.type][hypotheticalCheckingPiece.piece];
    }
    // Iterate over the moves of the checking piece
    for (let move of checkingPieceMoves) {
      if (move === hypotheticalCheckingPiece.position) {
        hypotheticalValidMoves.push(move);
      } else {
        // Flatten the array of moves for the checking piece
        let hypoCheckingPieceMoves = [].concat(...checkingPieceMoves);
        if (hypoCheckingPieceMoves.includes(move)) {

          // Check if the move captures the checking piece or blocks the check
          hypoBlockingMoves = isOnDiscoveredLineOfAttack(
            hypotheticalCheckingPiece,
            colorToMove,
            kingPosition,
            hypoCheckingPieceMoves
          );
          if (hypoBlockingMoves.includes(move)) {
            hypotheticalValidMoves.push(move);
          }
        }
      }
    }
  }

  function isOnDiscoveredLineOfAttack(
    hypotheticalCheckingPiece,
    colorToMove,
    kingPosition,
    hypotheticalValidMoves
  ) {
    const isWhite = colorToMove == "white";
    kingPosition = isWhite ? hypoKings.white : hypoKings.black;
    let hypoBlockingMoves = [];
    let [kingFile, kingRow] = kingPosition.split("");
    let [checkingFile, checkingRow] = hypotheticalCheckingPiece.position[0].split("");
    kingRow = parseInt(kingRow);
    checkingRow = parseInt(checkingRow);
  
    hypoBlockingMoves.push(hypotheticalCheckingPiece.position[0])
    for (let move of hypotheticalValidMoves) {
      let [moveFile, moveRow] = move.split("");
      moveRow = parseInt(moveRow);
      
      // Up and Down
      if (kingFile == checkingFile && moveFile == kingFile) {
        if (checkingRow > kingRow) {
          if (moveRow < checkingRow && moveRow > kingRow) {
            hypoBlockingMoves.push(move);
          }
        } else if (checkingRow < kingRow) {
          if (moveRow > checkingRow && moveRow < kingRow) {
            hypoBlockingMoves.push(move);
          }
        }
        // Left and Right
      } else if (kingRow == checkingRow && moveRow == kingRow) {
        if (checkingFile < kingFile) {
          if (moveFile > checkingFile && moveFile < kingFile) {
            hypoBlockingMoves.push(move);
          }
        } else if (checkingFile > kingFile) {
          if (moveFile < checkingFile && moveFile > kingFile) {
            hypoBlockingMoves.push(move);
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
          hypoBlockingMoves.push(move);
        }
      }
    }
    return hypoBlockingMoves;
  }

  
  
  export function handleIsDiscoveredCheck(hypotheticalBoard, hypotheticalMoves, colorToMove, hypoValidMoves, isCheck) {
    let hypotheticalCheckingPiece = checkIfIsDiscoveredCheck(hypotheticalBoard, hypotheticalMoves, colorToMove, isCheck);
    if (hypotheticalCheckingPiece !== null) {
      handleInDiscoveredCheckMove(
        hypotheticalBoard,
        hypotheticalMoves,
        colorToMove,
        hypoValidMoves,
        hypotheticalCheckingPiece
      );
    }
  }  

  export { hypotheticalCheck, hypoBlockingMoves }