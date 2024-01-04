
import { populateBoard } from "./src/board/populateBoard.js";

populateBoard()

let squares = document.querySelectorAll('.square');

squares.forEach(square => {
    square.addEventListener('click', () => {
        assignClickedPiece(square)
        handlePieceClick(event)
        movePiece()
    })
})

// Important Variables
let availableSquares = []
let clickedPiece = {}
let moveSquares = []
let moveOriginSquare
let lastMoveToSquare

function isEmpty(obj){
    for(var prop in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false
        }
    }
    return true
}

// Universal Functions
function assignClickedPiece(square) {
    if(isEmpty(clickedPiece)) {
        let splitSquare = square.id.split('')
        clickedPiece = {
            color: square.dataset.color,
            piece: square.dataset.piece,
            file: splitSquare[0],
            row: parseInt(splitSquare[1]),
            hasMoved: square.dataset.hasMoved,
            isTo: square.dataset.isTo,

        }
    } 
    else /*console.log(clickedPiece)*/;
}

//! highlights.js

function highlightAvailableSquares() {
    squares.forEach(square => {
        for(let i = 0; i<availableSquares.length; i++) {
            if(square.id === availableSquares[i]) {
                if(!square.dataset.occupied) {
                square.classList.contains('odd')
                ? square.classList.add('black-available')
                : square.classList.add('white-available')
                }
            }
        }
    })
}

function removeHighlightAvailableSquares() {
    availableSquares = []
    moveOriginSquare = ''
    squares.forEach(square => {
        if(square.classList.contains('white-available') || square.classList.contains('black-available')) {
            square.classList.contains('odd')
                ? square.classList.remove('black-available')
                : square.classList.remove('white-available')
        }
    })
}

//!

// TODO: Take the piece check out of handlePawnMove and implement a universal piece check in handlePieceClick

function handlePieceClick(e) {
    const target = e.target;
    

    if (target.classList.contains('pawn')) {
        const isSelectedBlack = target.classList.contains('selected-black');
        const isSelectedWhite = target.classList.contains('selected-white');
        const isOdd = target.classList.contains('odd');

        if (!isSelectedBlack && !isSelectedWhite) {
            target.classList.add(isOdd ? 'selected-black' : 'selected-white');
            // !
            moveSquares.push(target.id)
            // moveOriginSquare = target.id
            // !
            handlePawnMove();
        } else if (isSelectedBlack || isSelectedWhite) {
            clickedPiece = {};
            // !
            moveSquares = []
            // moveOriginSquare = ''
            // !
            target.classList.remove(isOdd ? 'selected-black' : 'selected-white');
            removeHighlightAvailableSquares();
            clearCaptureClass()
        }
    }
}





// Universal Piece Movement

function movePiece() {
    squares.forEach(square => {
        square.addEventListener('click', handleClick);
    });
}

function handleClick(e) {
    const square = e.target;
    if (square.classList.contains('odd')) {
        square.classList.remove('black-to');
    } else {
        square.classList.remove('white-to');
    }

    if (square.classList.contains('black-available') || square.classList.contains('white-available')) {
        removeYellowSquares();
        setNewSquare(square);
        clearOldSquare();
        removeHighlightAvailableSquares();
        clickedPiece = {};
        moveSquares = [];
        moveOriginSquare = '';
    }
}

function setNewSquare(square) {
    const isOdd = square.dataset.squareColor =='odd'
    square.classList.add(clickedPiece.color, clickedPiece.piece)
    square.dataset.color = clickedPiece.color
    square.dataset.piece = clickedPiece.piece
    square.dataset.occupied = true
    square.style.setProperty('background-image', `url(assets/${clickedPiece.color}-${clickedPiece.piece}.png)`)
    square.classList.add(isOdd ? 'black-to' : 'white-to')
}

function clearOldSquare() {
    console.log(moveSquares);
    squares.forEach(square => {
        if(square.id == moveSquares[0]) {
            const isOdd = square.classList.contains('odd')

            square.classList.remove(clickedPiece.color, clickedPiece.piece)
            square.dataset.color = ''
            square.dataset.piece = ''
            square.dataset.occupied = ''
            square.style.setProperty('background-image', '')

            square.classList.remove(isOdd ? 'selected-black' : 'selected-white')

            square.classList.add(isOdd ? 'black-to' : 'white-to')
        }
    })
}

function removeYellowSquares() {
    squares.forEach(square => {
        if(square.classList.contains('black-to')) {
            square.classList.remove('black-to')
        }
        else if (square.classList.contains('white-to')) {
            square.classList.remove('white-to')
        }
    })
}

// Individual Piece Movements and Captures

    //! Pawn

function handlePawnMove() {
    squares.forEach(square => {
        const [file, row] = square.id;
        const newRow = parseInt(row);

        if (clickedPiece.piece === 'pawn') {
            checkPawnCapture()
            const moveDirection = (clickedPiece.color === 'white') ? 1 : -1;

            if (!clickedPiece.hasMoved && (newRow === clickedPiece.row + moveDirection || newRow === clickedPiece.row + 2 * moveDirection)) {
                if (file === clickedPiece.file) {
                    availableSquares.push(`${file}${newRow}`);
                    highlightAvailableSquares();
                }
            } else if (clickedPiece.hasMoved && newRow === clickedPiece.row + moveDirection) {
                if (file === clickedPiece.file) {
                    availableSquares.push(`${file}${newRow}`);
                    highlightAvailableSquares();
                }
            }
        }
    });
}

// function checkPawnCapture() {
//    if(!isEmpty(clickedPiece))  {
//     squares.forEach(square => {
//         let fileDiff = square.id.charCodeAt(0) - clickedPiece.file.charCodeAt(0)
//         const rowDiff = square.id.charAt(1) - clickedPiece.row
//         if(clickedPiece.piece === 'pawn') {
//             const isCaptureLeft = fileDiff === -1 && rowDiff === 1;
//             const isCaptureRight = fileDiff === 1 && rowDiff === 1
//             if(square.id == isCaptureLeft || square.id == isCaptureRight) {
//                 console.log(`square ${square.id} is captureable`);
//             }
//         }
//     })
//    }
   
// }


function checkPawnCapture() {
    // console.log(clickedPiece.color);
    if (!isEmpty(clickedPiece)) {
        squares.forEach(square => {
            if (clickedPiece.piece === 'pawn') {
                const fileDiff = square.id.charCodeAt(0) - clickedPiece.file.charCodeAt(0);
                const rowDiff = square.id.charAt(1) - clickedPiece.row;

                const isCaptureLeftWhite = fileDiff === -1 && rowDiff === 1;
                const isCaptureRightWhite = fileDiff === 1 && rowDiff === 1;
                const isCaptureLeftBlack = fileDiff === -1 && rowDiff === -1;
                const isCaptureRightBlack = fileDiff === 1 && rowDiff === -1;

                // const pieceColor = clickedPiece.dataset.color

                // Check if the square satisfies capture conditions
                if(clickedPiece.color == 'white') {
                    if (isCaptureLeftWhite || isCaptureRightWhite) {
                        if(square.dataset.piece && square.dataset.color !== clickedPiece.color){
                            if(square.classList.contains('black-to')) {
                                square.classList.remove('black-to')
                            }
                            else if (square.classList.contains('white-to')) {
                                square.classList.remove('white-to')
                            }
                            square.classList.add('capture-black');
                        }
                    }
                }
                else if (clickedPiece.color == 'black') {
                    if (isCaptureLeftBlack || isCaptureRightBlack) {
                        if(square.dataset.piece && square.dataset.color !== clickedPiece.color){
                            if(square.classList.contains('black-to')) {
                                square.classList.remove('black-to')
                            }
                            else if (square.classList.contains('white-to')) {
                                square.classList.remove('white-to')
                            }
                            square.classList.add('capture-white');
                        }
                    }
                }
            }
        });
    }
}

function clearCaptureClass () {
    squares.forEach(square=> {
        if(square.classList.contains('capture-black')) {
            square.classList.remove('capture-black')
        }
        else if (square.classList.contains('capture-white')) {
            square.classList.remove('capture-white')
        }
    })
}
