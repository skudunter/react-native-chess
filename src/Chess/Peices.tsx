import { PeiceType } from "../constants";

//base class peice that all peices inherit from, isvalidmove just checks if the new square the
//player wants to move to is in the moveset array the moveset array creation is called in the constructor and is then displayed on screen
export class ChessPiece {
  type: PeiceType;
  player: "black" | "white";
  image: any;
  row: number;
  column: number;
  boardState: PeiceType[][];
  moveset?: [number, number][] | null;

  constructor(
    type: PeiceType,
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][],
    moveset?: [number, number][]
  ) {
    this.type = type;
    this.player = player;
    this.image = image;
    this.row = row;
    this.column = column;
    this.moveset = moveset;
    this.boardState = boardState;
    this.moveset = this.getArrayOfValidMoves();
  }
  getPlayer(peice: PeiceType): "black" | "white" | null {
    if (
      peice === "B" ||
      peice === "Q" ||
      peice === "K" ||
      peice === "N" ||
      peice === "P" ||
      peice === "R"
    ) {
      return "white";
    } else if (
      peice === "b" ||
      peice === "q" ||
      peice === "k" ||
      peice === "n" ||
      peice === "p" ||
      peice === "r"
    ) {
      return "black";
    } else {
      return null;
    }
  }
  getArrayOfValidMoves(): [number, number][] | null {
    return null;
  }
  isValidMove(targetRow: number, targetCol: number): boolean {
    if (this.moveset) {
      const validMoves = this.moveset;
      const [currentRow, currentCol] = [this.row, this.column];

      for (const [moveRow, moveCol] of validMoves!) {
        const newRow = currentRow! + moveRow;
        const newCol = currentCol! + moveCol;

        if (newRow === targetRow && newCol === targetCol) {
          return true;
        }
      }
    }
    return false;
  }
}

export class Pawn extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("p", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    let validMoves: [number, number][] = [];

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    if (this.player === "white") {
      // Forward movement for white pawn
      const forwardRow = this.row - 1;
      if (
        isValidCell(forwardRow, this.column) &&
        isCellEmpty(forwardRow, this.column)
      ) {
        validMoves.push([-1, 0]);

        // Double forward movement from starting position
        if (this.row === 6 && isCellEmpty(forwardRow - 1, this.column)) {
          validMoves.push([-2, 0]);
        }
      }

      // Diagonal captures
      const diagonalRows = [forwardRow, forwardRow];
      const diagonalColumns = [this.column + 1, this.column - 1];
      for (let i = 0; i < 2; i++) {
        const row = diagonalRows[i];
        const column = diagonalColumns[i];
        if (
          isValidCell(row, column) &&
          !isCellEmpty(row, column) &&
          this.getPlayer(this.boardState[row][column]) !== this.player
        ) {
          validMoves.push([row - this.row, column - this.column]);
        }
      }
    } else if (this.player === "black") {
      // Forward movement for black pawn
      const forwardRow = this.row + 1;
      if (
        isValidCell(forwardRow, this.column) &&
        isCellEmpty(forwardRow, this.column)
      ) {
        validMoves.push([1, 0]);

        // Double forward movement from starting position
        if (this.row === 1 && isCellEmpty(forwardRow + 1, this.column)) {
          validMoves.push([2, 0]);
        }
      }
      // Diagonal captures
      const diagonalRows = [forwardRow, forwardRow];
      const diagonalColumns = [this.column + 1, this.column - 1];
      for (let i = 0; i < 2; i++) {
        const row = diagonalRows[i];
        const column = diagonalColumns[i];
        if (
          isValidCell(row, column) &&
          !isCellEmpty(row, column) &&
          this.getPlayer(this.boardState[row][column]) !== this.player
        ) {
          validMoves.push([row - this.row, column - this.column]);
        }
      }
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}

export class Rook extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("r", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    let validMoves: [number, number][] = [];

    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const addMove = (rowOffset: number, columnOffset: number) => {
      let newRow = this.row + rowOffset;
      let newColumn = this.column + columnOffset;
      while (isValidCell(newRow, newColumn)) {
        if (isCellEmpty(newRow, newColumn)) {
          validMoves.push([newRow - this.row, newColumn - this.column]);
        } else {
          if (
            this.getPlayer(this.boardState[newRow][newColumn]) !== this.player
          ) {
            validMoves.push([newRow - this.row, newColumn - this.column]);
          }
          break;
        }
        newRow += rowOffset;
        newColumn += columnOffset;
      }
    };

    // Possible rook move offsets
    const moveOffsets: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [rowOffset, columnOffset] of moveOffsets) {
      addMove(rowOffset, columnOffset);
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}

export class Knight extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("n", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    const validMoves: [number, number][] = [];

    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const addMove = (rowOffset: number, columnOffset: number) => {
      const newRow = this.row + rowOffset;
      const newColumn = this.column + columnOffset;
      if (
        isValidCell(newRow, newColumn) &&
        (isCellEmpty(newRow, newColumn) ||
          this.getPlayer(this.boardState[newRow][newColumn]) !== this.player)
      ) {
        validMoves.push([newRow - this.row, newColumn - this.column]);
      }
    };

    // Possible knight move offsets
    const moveOffsets: [number, number][] = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const [rowOffset, columnOffset] of moveOffsets) {
      addMove(rowOffset, columnOffset);
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}

export class Bishop extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("b", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    let validMoves: [number, number][] = [];
    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const addMove = (rowOffset: number, columnOffset: number) => {
      let newRow = this.row + rowOffset;
      let newColumn = this.column + columnOffset;
      while (isValidCell(newRow, newColumn)) {
        if (isCellEmpty(newRow, newColumn)) {
          validMoves.push([newRow - this.row, newColumn - this.column]);
        } else {
          if (
            this.getPlayer(this.boardState[newRow][newColumn]) !== this.player
          ) {
            validMoves.push([newRow - this.row, newColumn - this.column]);
          }
          break;
        }
        newRow += rowOffset;
        newColumn += columnOffset;
      }
    };

    // Possible bishop move offsets
    const moveOffsets: [number, number][] = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];

    for (const [rowOffset, columnOffset] of moveOffsets) {
      addMove(rowOffset, columnOffset);
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}

export class Queen extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("q", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    let validMoves: [number, number][] = [];

    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const addMove = (rowOffset: number, columnOffset: number) => {
      let newRow = this.row + rowOffset;
      let newColumn = this.column + columnOffset;
      while (isValidCell(newRow, newColumn)) {
        if (isCellEmpty(newRow, newColumn)) {
          validMoves.push([newRow - this.row, newColumn - this.column]);
        } else {
          if (
            this.getPlayer(this.boardState[newRow][newColumn]) !== this.player
          ) {
            validMoves.push([newRow - this.row, newColumn - this.column]);
          }
          break;
        }
        newRow += rowOffset;
        newColumn += columnOffset;
      }
    };

    // Possible queen move offsets
    const moveOffsets: [number, number][] = [
      [-1, -1], // top left
      [-1, 0], // top
      [-1, 1], // top right
      [0, -1], // left
      [0, 1], // right
      [1, -1], // bottom left
      [1, 0], // bottom
      [1, 1], // bottom right
    ];

    for (const [rowOffset, columnOffset] of moveOffsets) {
      addMove(rowOffset, columnOffset);
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}

export class King extends ChessPiece {
  constructor(
    player: "black" | "white",
    image: any,
    row: number,
    column: number,
    boardState: PeiceType[][]
  ) {
    super("q", player, image, row, column, boardState);
  }
  getArrayOfValidMoves(): [number, number][] | null {
    let validMoves: [number, number][] = [];

    const isValidCell = (row: number, column: number): boolean => {
      return row >= 0 && row < 8 && column >= 0 && column < 8;
    };

    const isCellEmpty = (row: number, column: number): boolean => {
      return this.boardState[row][column] === null;
    };

    const addMove = (rowOffset: number, columnOffset: number) => {
      const newRow = this.row + rowOffset;
      const newColumn = this.column + columnOffset;
      if (
        isValidCell(newRow, newColumn) &&
        (isCellEmpty(newRow, newColumn) ||
          this.getPlayer(this.boardState[newRow][newColumn]) !== this.player)
      ) {
        validMoves.push([newRow - this.row, newColumn - this.column]);
      }
    };

    // Possible king move offsets
    const moveOffsets: [number, number][] = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [rowOffset, columnOffset] of moveOffsets) {
      addMove(rowOffset, columnOffset);
    }
    return validMoves.length > 0 ? validMoves : null;
  }
}
