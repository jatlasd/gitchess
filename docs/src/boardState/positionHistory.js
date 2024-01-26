let positions = [];
let position;
let moves = 0;
let currentPosition = moves;

export function setPosition(squares) {
  let squaresArray = Array.from(squares);
  position = squaresArray.map((square) => square.cloneNode(true));

  if (currentPosition + 1 < moves) {
    positions = positions.slice(0, currentPosition + 1);
    moves = currentPosition + 1;
  }
  positions.push({ moves, position });
  moves++;
  currentPosition = moves - 1;
}

function resetBoard(move) {
  positions[move].position.forEach((storedSquare) => {
    let currentSquare = document.getElementById(storedSquare.id);
    if (
      JSON.stringify(Object.assign({}, storedSquare.dataset)) !==
        JSON.stringify(Object.assign({}, currentSquare.dataset)) ||
      storedSquare.className !== currentSquare.className
    ) {
      for (let key in currentSquare.dataset) {
        delete currentSquare.dataset[key];
      }
      for (let key in storedSquare.dataset) {
        currentSquare.dataset[key] = storedSquare.dataset[key];
      }
      currentSquare.className = storedSquare.className;
    }
  });
  replaceImages();
}

function replaceImages() {
  let squares = document.querySelectorAll(".square");

  squares.forEach((square) => {
    let color = square.dataset.color;
    let piece = square.dataset.piece;
    if (color && piece) {
      square.style.setProperty(
        "background-image",
        `url(assets/${color}-${piece}.png)`
      );
    } else {
      square.style.setProperty("background-image", "");
    }
  });
}

export function getPosition() {
  if (currentPosition > 0) {
    currentPosition--;
    resetBoard(currentPosition);
    return true;
  }
  return false;
}

export function getForwardPosition() {
  if (currentPosition < moves - 1 && currentPosition < positions.length - 1) {
    currentPosition++;
    resetBoard(currentPosition);
    return true;
  }
  return false;
}
