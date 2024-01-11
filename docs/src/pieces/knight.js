import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";


let knightMoves

function allKnightMoves(squares, clickedPiece) {
  knightMoves = []
  let clickedFile = clickedPiece.file.charCodeAt(0)
  let clickedRow = clickedPiece.row
  squares.forEach(square => {
    let splitId = square.id.split('')
    let file = splitId[0].charCodeAt(0)
    let row = parseInt(splitId[1])

    if(row == clickedRow + 1 || row == clickedRow - 1) {
      if(file == clickedFile + 2 || file == clickedFile - 2) {
        knightMoves.push(square.id)
      }
    } else if (row == clickedRow + 2 || row == clickedRow - 2) {
      if(file == clickedFile + 1 || file == clickedFile - 1) {
        knightMoves.push(square.id)
      }
    }
  })
}

function findKnightCaptures(clickedPiece, availableSquares) {
  for(const move of knightMoves) {
    let square = document.getElementById(move)
    const isOdd = square.dataset.squareColor == 'odd'
    if(!square.dataset.occupied) {
      availableSquares.push(square.id)
    } else if (square.dataset.color !== clickedPiece.color) {
      square.classList.add(isOdd ? "capture-black" : "capture-white");
      square.classList.remove(isOdd ? "black-to" : "white-to");
    }
  }
}

export function handleKnightMove(squares, clickedPiece, availableSquares) {
  allKnightMoves(squares, clickedPiece)
  findKnightCaptures(clickedPiece, availableSquares)
  highlightAvailableSquares(availableSquares)
}