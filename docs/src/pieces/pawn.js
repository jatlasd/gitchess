import { highlightAvailableSquares } from "../squareChanges/availableSquares.js";

export function handlePawnMove(squares, clickedPiece, availableSquares) {
  squares.forEach((square) => {
    const [file, row] = square.id;
    const newRow = parseInt(row);

    checkPawnCapture(square, clickedPiece);
    const moveDirection = clickedPiece.color === "white" ? 1 : -1;

    if (
      !clickedPiece.hasMoved &&
      (newRow === clickedPiece.row + moveDirection ||
        newRow === clickedPiece.row + 2 * moveDirection)
    ) {
      if (file === clickedPiece.file) {
        availableSquares.push(`${file}${newRow}`);
        highlightAvailableSquares(availableSquares);
      }
    } else if (
      clickedPiece.hasMoved &&
      newRow === clickedPiece.row + moveDirection
    ) {
      if (file === clickedPiece.file) {
        availableSquares.push(`${file}${newRow}`);
        highlightAvailableSquares(availableSquares);
      }
    }
  });
}

function checkPawnCapture(square, clickedPiece) {
  const isBlack = square.dataset.squareColor == "odd";
  const fileDiff = square.id.charCodeAt(0) - clickedPiece.file.charCodeAt(0);
  const rowDiff = square.id.charAt(1) - clickedPiece.row;

  const isCaptureLeftWhite = fileDiff === -1 && rowDiff === 1;
  const isCaptureRightWhite = fileDiff === 1 && rowDiff === 1;
  const isCaptureLeftBlack = fileDiff === -1 && rowDiff === -1;
  const isCaptureRightBlack = fileDiff === 1 && rowDiff === -1;
  if (clickedPiece.color == "white") {
    if (isCaptureLeftWhite || isCaptureRightWhite) {
      if (square.dataset.piece && square.dataset.color !== clickedPiece.color) {
        square.classList.remove(isBlack ? 'black-to' : 'white-to')
        square.classList.add(isBlack ? 'capture-black' : 'capture-white')
      }
    }
  } else if (clickedPiece.color == "black") {
    if (isCaptureLeftBlack || isCaptureRightBlack) {
      if (square.dataset.piece && square.dataset.color !== clickedPiece.color) {
        square.classList.remove(isBlack ? 'black-to' : 'white-to')
        square.classList.add(isBlack ? 'capture-black' : 'capture-white')
      }
    }
  }
}
