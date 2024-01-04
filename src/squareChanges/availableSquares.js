export function highlightAvailableSquares() {
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

export function removeHighlightAvailableSquares() {
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