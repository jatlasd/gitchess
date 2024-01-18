import { handleIsDiscoveredCheck } from "./hypotheticalCheck.js";

let pieces = {
    pawns: {
      white: [],
      black: [],
    },
    rooks: {
      white: [],
      black: [],
    },
    knights: {
      white: [],
      black: [],
    },
    bishops: {
      white: [],
      black: [],
    },
    queens: {
      white: [],
      black: [],
    },
  };
  
  let colors = ["white", "black"];
  
  function updatePieces(hypotheticalBoard) {
    pieces = {
      pawns: {
        white: [],
        black: [],
      },
      rooks: {
        white: [],
        black: [],
      },
      knights: {
        white: [],
        black: [],
      },
      bishops: {
        white: [],
        black: [],
      },
      queens: {
        white: [],
        black: [],
      },
    };
    hypotheticalBoard.forEach((square) => {
      const isWhite = square.dataset.color == "white";
      switch (square.dataset.piece) {
        case "pawn":
          return isWhite
            ? pieces.pawns.white.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              })
            : pieces.pawns.black.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              });
        case "rook":
          return isWhite
            ? pieces.rooks.white.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              })
            : pieces.rooks.black.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              });
        case "knight":
          return isWhite
            ? pieces.knights.white.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              })
            : pieces.knights.black.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              });
        case "bishop":
          return isWhite
            ? pieces.bishops.white.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              })
            : pieces.bishops.black.push({
                identifier: square.dataset.pieceIdentifier,
                location: square.id,
              });
        case "queen":
          return isWhite
            ? pieces.queens.white.push(square.id)
            : pieces.queens.black.push(square.id);
      }
    });
  }
  
  function updatePawnMoves(squares, hypotheticalMoves) {
    updatePieces(squares);
    hypotheticalMoves.white.pawn = {
      apawn: [],
      bpawn: [],
      cpawn: [],
      dpawn: [],
      epawn: [],
      fpawn: [],
      gpawn: [],
      hpawn: [],
    };
    hypotheticalMoves.black.pawn = {
      apawn: [],
      bpawn: [],
      cpawn: [],
      dpawn: [],
      epawn: [],
      fpawn: [],
      gpawn: [],
      hpawn: [],
    };
  
    colors.forEach((color) => {
      let direction = color === "white" ? 1 : -1;
      for (let pawn of pieces.pawns[color]) {
        if (pawn.location) {
          let file = pawn.location[0].charCodeAt(0);
          let row = parseInt(pawn.location[1]);
          let iden = pawn.identifier;
  
          let capLeft, capRight;
          if (file > 97) {
            capLeft = `${String.fromCharCode(file - 1)}${row + direction}`;
          }
          if (file < 104) {
            capRight = `${String.fromCharCode(file + 1)}${row + direction}`;
          }
          if (capLeft && !hypotheticalMoves[color].pawn[iden].includes(capLeft)) {
            hypotheticalMoves[color].pawn[iden].push(capLeft);
          }
          if (
            capRight &&
            !hypotheticalMoves[color].pawn[iden].includes(capRight)
          ) {
            hypotheticalMoves[color].pawn[iden].push(capRight);
          }
        }
      }
    });
  }
  
  function updateRookMoves(hypotheticalBoard, hypotheticalMoves) {
      updatePieces(hypotheticalBoard);
      if (NodeList.prototype.isPrototypeOf(hypotheticalBoard)) {
        hypotheticalBoard = Array.from(hypotheticalBoard);
      }
    
      hypotheticalMoves.black.rook = {
        arook: [],
        hrook: [],
      };
      hypotheticalMoves.white.rook = {
        arook: [],
        hrook: [],
      };
    
      colors.forEach((color) => {
        for (let rook of pieces.rooks[color]) {
          if (rook.location) {
            let file = rook.location[0].charCodeAt(0);
            let row = parseInt(rook.location[1]);
            let iden = rook.identifier;
    
            // Directions: right, left, up, down
            const directions = [
              [0, 1],
              [0, -1],
              [-1, 0],
              [1, 0],
            ];
    
            for (let [dx, dy] of directions) {
              for (let i = 1; i < 8; i++) {
                let newFile = file + i * dx;
                let newRow = row + i * dy;
    
                if (newFile < 97 || newFile > 104 || newRow < 1 || newRow > 8) {
                  break; // Out of board
                }
    
                let newSquareId = `${String.fromCharCode(newFile)}${newRow}`;
                let newSquare = hypotheticalBoard.find((square) => square.id === newSquareId);
    
                if (newSquare.dataset.occupied === "false" || newSquare.dataset.occupied === undefined || newSquare.dataset.occupied == "") {
                  if (!hypotheticalMoves[color].rook[iden].includes(newSquareId)) {
                    hypotheticalMoves[color].rook[iden].push(newSquareId);
                  }
                } else {
                  // If the square is occupied by an opponent's piece, it's a valid move
                  if (newSquare.dataset.color !== color && newSquare.dataset.piece == "king") {
                    if (
                      !hypotheticalMoves[color].rook[iden].includes(newSquareId)
                    ) {
                      hypotheticalMoves[color].rook[iden].push(newSquareId);
                    }
                  }
                  break; // Can't jump over a piece
                }
              }
            }
          }
        }
      });
    }
  
  
  function calculateKnightMoves(id) {
    let file = id.location[0].charCodeAt(0);
    let row = parseInt(id.location[1]);
    let potentialMoves = [
      { row: row - 2, file: file - 1 },
      { row: row - 2, file: file + 1 },
      { row: row - 1, file: file - 2 },
      { row: row - 1, file: file + 2 },
      { row: row + 1, file: file - 2 },
      { row: row + 1, file: file + 2 },
      { row: row + 2, file: file - 1 },
      { row: row + 2, file: file + 1 },
    ];
    let validMoves = potentialMoves.filter((move) => {
      return (
        move.row >= 1 &&
        move.row <= 8 &&
        move.file >= "a".charCodeAt(0) &&
        move.file <= "h".charCodeAt(0)
      );
    });
    let validMoveIds = validMoves.map((move) => {
      return `${String.fromCharCode(move.file)}${move.row}`;
    });
  
    return validMoveIds;
  }
  
  function updateKnightMoves(hypotheticalBoard, hypotheticalMoves) {
      updatePieces(hypotheticalBoard);
      if (NodeList.prototype.isPrototypeOf(hypotheticalBoard)) {
        hypotheticalBoard = Array.from(hypotheticalBoard);
      }
    
      hypotheticalMoves.white.knight = {
        bknight: [],
        gknight: [],
      };
      hypotheticalMoves.black.knight = {
        bknight: [],
        gknight: [],
      };
    
      colors.forEach((color) => {
        for (let knight of pieces.knights[color]) {
          let iden = knight.identifier;
          let validMoves = calculateKnightMoves(knight);
          validMoves.forEach((move) => {
            let newSquare = hypotheticalBoard.find((square) => square.id === move);
            if (newSquare.dataset.occupied === "false" || newSquare.dataset.occupied === undefined || newSquare.dataset.occupied == "") {
              if (!hypotheticalMoves[color].knight[iden].includes(move)) {
              hypotheticalMoves[color].knight[iden].push(move);
            }
          } else {
              if (newSquare.dataset.color !== color && newSquare.dataset.piece == "king") {
                  if (!hypotheticalMoves[color].knight[iden].includes(move)) {
                hypotheticalMoves[color].knight[iden].push(move);
              }
            }
          }
          });
        }
      });
    }
  
  function updateQueenMoves(hypotheticalBoard, hypotheticalMoves) {
      updatePieces(hypotheticalBoard);
      if (NodeList.prototype.isPrototypeOf(hypotheticalBoard)) {
        hypotheticalBoard = Array.from(hypotheticalBoard);
      }
      hypotheticalMoves.white.queen = [];
      hypotheticalMoves.black.queen = [];
    
      colors.forEach((color) => {
        for (let queen of pieces.queens[color]) {
          let splitId = queen.split("");
          let file = splitId[0].charCodeAt(0);
          let row = parseInt(splitId[1]);
          const directions = [
            [-1, -1],
            [+1, +1],
            [-1, +1],
            [+1, -1],
            [0, 1],
            [0, -1],
            [-1, 0],
            [1, 0],
          ];
          for (let [dx, dy] of directions) {
            for (let i = 1; i <= 8; i++) {
              let newFile = file + i * dx;
              let newRow = row + i * dy;
    
              if (newFile < 97 || newFile > 104 || newRow < 1 || newRow > 8) {
                break; // Out of board
              }
    
              let newSquareId = `${String.fromCharCode(newFile)}${newRow}`;
              let newSquare = hypotheticalBoard.find((square) => square.id === newSquareId);
    
              if (newSquare.dataset.occupied === "false" || newSquare.dataset.occupied === undefined || newSquare.dataset.occupied == "") {
                  if (!hypotheticalMoves[color].queen.includes(newSquareId)) {
                  hypotheticalMoves[color].queen.push(newSquareId);
                }
              } else {
                  if (newSquare.dataset.color !== color && newSquare.dataset.piece == "king") {
                      if (!hypotheticalMoves[color].queen.includes(newSquareId)) {
                    hypotheticalMoves[color].queen.push(newSquareId);
                  }
                }
                break;
              }
            }
          }
        }
      });
    }
  
  
  function updateBishopMoves(hypotheticalBoard, hypotheticalMoves) {
    updatePieces(hypotheticalBoard);
    if (NodeList.prototype.isPrototypeOf(hypotheticalBoard)) {
      hypotheticalBoard = Array.from(hypotheticalBoard);
    }
    hypotheticalMoves.white.bishop = {
      whitebishop: [],
      blackbishop: [],
    };
    hypotheticalMoves.black.bishop = {
      whitebishop: [],
      blackbishop: [],
    };
  
    colors.forEach((color) => {
      for (let bishop of pieces.bishops[color]) {
        let file = bishop.location[0].charCodeAt(0);
        let row = parseInt(bishop.location[1]);
        let iden = bishop.identifier;
        const directions = [
          [-1, -1],
          [+1, +1],
          [-1, +1],
          [+1, -1],
        ];
        for (let [dx, dy] of directions) {
          for (let i = 1; i <= 8; i++) {
            let newFile = file + i * dx;
            let newRow = row + i * dy;
  
            if (newFile < 97 || newFile > 104 || newRow < 1 || newRow > 8) {
              break; // Out of board
            }
  
            let newSquareId = `${String.fromCharCode(newFile)}${newRow}`;
            let newSquare = hypotheticalBoard.find(
              (square) => square.id === newSquareId
            );
  
            if (newSquare.dataset.occupied === "false" || newSquare.dataset.occupied === undefined || newSquare.dataset.occupied == "") {
              if (!hypotheticalMoves[color].bishop[iden].includes(newSquareId)) {
                hypotheticalMoves[color].bishop[iden].push(newSquareId);
              }
            } else {
              if (newSquare.dataset.color !== color && newSquare.dataset.piece == "king") {
                if (!hypotheticalMoves[color].bishop[iden].includes(newSquareId)) {
                  hypotheticalMoves[color].bishop[iden].push(newSquareId);
                }
              }
              break;
            }
          }
        }
      }
    });
  }
  
  
  
  function hypotheticalAllMoves(hypotheticalBoard, hypotheticalMoves, colorToMove) {
    updatePawnMoves(hypotheticalBoard, hypotheticalMoves);
    updateRookMoves(hypotheticalBoard, hypotheticalMoves);
    updateKnightMoves(hypotheticalBoard, hypotheticalMoves);
    updateBishopMoves(hypotheticalBoard, hypotheticalMoves);
    updateQueenMoves(hypotheticalBoard, hypotheticalMoves);
    handleIsDiscoveredCheck(hypotheticalBoard, hypotheticalMoves, colorToMove);
  }
  
  
  import { clickedPiece } from "../../main.js";

  export function checkHypotheticalMove(squares, hypotheticalMoves, colorToMove) {
    let hypotheticalBoard = [];
    // Make a copy of the current board state
    let squaresArray = Array.from(squares);
  
    hypotheticalBoard = squaresArray.map((square) => square.cloneNode(true));
  
    let squareToModify = hypotheticalBoard.find(
      (square) => square.id == clickedPiece.square
    );
    if (squareToModify) {
      squareToModify.dataset.occupied = false;
    }
  
    // Calculate allMoves for the hypothetical board state
    hypotheticalAllMoves(hypotheticalBoard, hypotheticalMoves, colorToMove);
    ;
  }
  