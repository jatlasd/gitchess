import {  handleIsCheck } from "./check.js";
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

function updatePieces(squares) {
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
  squares.forEach((square) => {
    const isWhite = square.dataset.color == "white";
    switch (square.dataset.piece) {
      case "pawn":
        return isWhite
          ? pieces.pawns.white.push({identifier: square.dataset.pieceIdentifier, location: square.id})
          : pieces.pawns.black.push({identifier: square.dataset.pieceIdentifier, location: square.id});
      case "rook":
        return isWhite
          ? pieces.rooks.white.push({identifier: square.dataset.pieceIdentifier, location: square.id})
          : pieces.rooks.black.push({identifier: square.dataset.pieceIdentifier, location: square.id});
      case "knight":
        return isWhite
          ? pieces.knights.white.push({identifier: square.dataset.pieceIdentifier, location: square.id})
          : pieces.knights.black.push({identifier: square.dataset.pieceIdentifier, location: square.id});
      case "bishop":
        return isWhite
          ? pieces.bishops.white.push({identifier: square.dataset.pieceIdentifier, location: square.id})
          : pieces.bishops.black.push({identifier: square.dataset.pieceIdentifier, location: square.id});
      case "queen":
        return isWhite
          ? pieces.queens.white.push(square.id)
          : pieces.queens.black.push(square.id);
    }
  });

}

function updatePawnMoves(squares, allMoves) {
  updatePieces(squares);
  allMoves.white.pawn =  {
    apawn: [],
    bpawn: [],
    cpawn: [],
    dpawn: [],
    epawn: [],
    fpawn: [],
    gpawn: [],
    hpawn: []
  };
  allMoves.black.pawn= {
    apawn: [],
    bpawn: [],
    cpawn: [],
    dpawn: [],
    epawn: [],
    fpawn: [],
    gpawn: [],
    hpawn: []
  };

  colors.forEach((color) => {
    let direction = color === "white" ? 1 : -1;
    for (let pawn of pieces.pawns[color]) {
        if(pawn.location) {
            
            let file = pawn.location[0].charCodeAt(0);
            let row = parseInt(pawn.location[1]);
            let iden = pawn.identifier

            let capLeft, capRight;
            if (file > 97) {
              capLeft = `${String.fromCharCode(file - 1)}${row + direction}`;
            }
            if (file < 104) {
              capRight = `${String.fromCharCode(file + 1)}${row + direction}`;
            }
            if (capLeft && !allMoves[color].pawn[iden].includes(capLeft)) {
              allMoves[color].pawn[iden].push(capLeft);
            }
            if (capRight && !allMoves[color].pawn[iden].includes(capRight)) {
              allMoves[color].pawn[iden].push(capRight);
            }
        }
    }
  });
}

function updateRookMoves(squares, allMoves) {
  updatePieces(squares);
  if (NodeList.prototype.isPrototypeOf(squares)) {
    squares = Array.from(squares);
  }

  allMoves.black.rook = {
    arook: [],
    hrook: []
  };
  allMoves.white.rook = {
    arook: [],
    hrook: []
  };

  colors.forEach((color) => {
    for (let rook of pieces.rooks[color]) {
        if(rook.location) {

            let file = rook.location[0].charCodeAt(0);
            let row = parseInt(rook.location[1]);
            let iden = rook.identifier
      
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
                let newSquare = squares.find((square) => square.id === newSquareId);
      
                if (!newSquare.dataset.occupied) {
                  if (!allMoves[color].rook[iden].includes(newSquareId)) {
                    allMoves[color].rook[iden].push(newSquareId);
                  }
                } else {
                  // If the square is occupied by an opponent's piece, it's a valid move
                  if (newSquare.dataset.color !== color) {
                    if (!allMoves[color].rook[iden].includes(newSquareId)) {
                      allMoves[color].rook[iden].push(newSquareId);
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

function updateKnightMoves(squares, allMoves) {
    updatePieces(squares);
    if (NodeList.prototype.isPrototypeOf(squares)) {
      squares = Array.from(squares);
    }
  
    allMoves.white.knight = {
        bknight: [],
        gknight: []
    };
    allMoves.black.knight = {
        bknight: [],
        gknight: []
    };
  
    colors.forEach((color) => {
      for (let knight of pieces.knights[color]) {
        let iden = knight.identifier
        let validMoves = calculateKnightMoves(knight);
        validMoves.forEach((move) => {
          let square = squares.find((square) => square.id === move);
          if (!square.dataset.occupied || square.dataset.color !== color) {
            allMoves[color].knight[iden].push(move);
          }
        });
      }
    });
  }

function updateBishopMoves(squares, allMoves) {
  updatePieces(squares);
  if (NodeList.prototype.isPrototypeOf(squares)) {
    squares = Array.from(squares);
  }
  allMoves.white.bishop = {
    whitebishop: [],
    blackbishop: []
  };
  allMoves.black.bishop = {
    whitebishop: [],
    blackbishop: []
  };

  colors.forEach((color) => {
    for (let bishop of pieces.bishops[color]) {
      let file = bishop.location[0].charCodeAt(0);
      let row = parseInt(bishop.location[1]);
      let iden = bishop.identifier
      const directions = [
        [-1, -1],
        [+1, +1],
        [-1, +1],
        [+1, -1],
      ];
      for(let [dx, dy] of directions) {
        for(let i = 1; i<=8; i++) {
            let newFile = file + i * dx;
            let newRow = row + i * dy;
  
            if (newFile < 97 || newFile > 104 || newRow < 1 || newRow > 8) {
              break; // Out of board
            }
  
            let newSquareId = `${String.fromCharCode(newFile)}${newRow}`;
            let newSquare = squares.find((square) => square.id === newSquareId);

            if (!newSquare.dataset.occupied) {
                if (!allMoves[color].bishop[iden].includes(newSquareId)) {
                  allMoves[color].bishop[iden].push(newSquareId);
                }
              } else {
                if (newSquare.dataset.color !== color) {
                  if (!allMoves[color].bishop[iden].includes(newSquareId)) {
                    allMoves[color].bishop[iden].push(newSquareId);
                  }
                }
                break;
              }
        }
      }
    }
  });
}

function updateQueenMoves(squares, allMoves) {
    updatePieces(squares);
    if (NodeList.prototype.isPrototypeOf(squares)) {
      squares = Array.from(squares);
    }
    allMoves.white.queen = [];
    allMoves.black.queen = [];
  
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
        for(let [dx, dy] of directions) {
          for(let i = 1; i<=8; i++) {
              let newFile = file + i * dx;
              let newRow = row + i * dy;
    
              if (newFile < 97 || newFile > 104 || newRow < 1 || newRow > 8) {
                break; // Out of board
              }
    
              let newSquareId = `${String.fromCharCode(newFile)}${newRow}`;
              let newSquare = squares.find((square) => square.id === newSquareId);
  
              if (!newSquare.dataset.occupied) {
                  if (!allMoves[color].queen.includes(newSquareId)) {
                    allMoves[color].queen.push(newSquareId);
                  }
                } else {
                  if (newSquare.dataset.color !== color) {
                    if (!allMoves[color].queen.includes(newSquareId)) {
                      allMoves[color].queen.push(newSquareId);
                    }
                  }
                  break;
                }
          }
        }
      }
    });  
}

export function updateAllMoves(squares, allMoves, colorToMove) {
  
           updatePawnMoves(squares, allMoves);
  
           updateRookMoves(squares, allMoves)
  
           updateKnightMoves(squares, allMoves)
  
           updateBishopMoves(squares, allMoves)
           
           updateQueenMoves(squares, allMoves)
      
        handleIsCheck(squares, allMoves, colorToMove)

           

    // })
  }

