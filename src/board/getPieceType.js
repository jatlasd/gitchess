export function getPieceType(file, row) {
    switch (row) {
      case '1':
      case '8':
        switch (file) {
          case 'a':
          case 'h':
            return 'rook';
          case 'b':
          case 'g':
            return 'knight';
          case 'c':
          case 'f':
            return 'bishop';
          case 'd':
            return 'queen';
          case 'e':
            return 'king';
        }
        break;
      case '2':
      case '7':
        return 'pawn';
    }
  }