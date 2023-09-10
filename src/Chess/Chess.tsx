import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Image } from "react-native";
import {
  FIFTHCOLOR,
  FOURTHCOLOR,
  PeiceType,
  SECONDARYCOLOR,
  TERSIARYCOLOR,
  TILEWIDTH,
} from "../constants";
import { ChessPiece, Bishop, King, Knight, Pawn, Queen, Rook } from "./Peices";

function getChessPeice(
  type: PeiceType,
  row: number,
  column: number,
  boardState: PeiceType[][]
): ChessPiece {
  if (type === "p") {
    return new Pawn(
      "black",
      require("../../assets/chess-peices/b_pawn.png"),
      row,
      column,
      boardState
    );
  } else if (type === "r") {
    return new Rook(
      "black",
      require("../../assets/chess-peices/b_rook.png"),
      row,
      column,
      boardState
    );
  } else if (type === "n") {
    return new Knight(
      "black",
      require("../../assets/chess-peices/b_knight.png"),
      row,
      column,
      boardState
    );
  } else if (type === "b") {
    return new Bishop(
      "black",
      require("../../assets/chess-peices/b_bishop.png"),
      row,
      column,
      boardState
    );
  } else if (type === "q") {
    return new Queen(
      "black",
      require("../../assets/chess-peices/b_queen.png"),
      row,
      column,
      boardState
    );
  } else if (type === "k") {
    return new King(
      "black",
      require("../../assets/chess-peices/b_king.png"),
      row,
      column,
      boardState
    );
  } else if (type === "P") {
    return new Pawn(
      "white",
      require("../../assets/chess-peices/w_pawn.png"),
      row,
      column,
      boardState
    );
  } else if (type === "R") {
    return new Rook(
      "white",
      require("../../assets/chess-peices/w_rook.png"),
      row,
      column,
      boardState
    );
  } else if (type === "N") {
    return new Knight(
      "white",
      require("../../assets/chess-peices/w_knight.png"),
      row,
      column,
      boardState
    );
  } else if (type === "B") {
    return new Bishop(
      "white",
      require("../../assets/chess-peices/w_bishop.png"),
      row,
      column,
      boardState
    );
  } else if (type === "Q") {
    return new Queen(
      "white",
      require("../../assets/chess-peices/w_queen.png"),
      row,
      column,
      boardState
    );
  } else if (type === "K") {
    return new King(
      "white",
      require("../../assets/chess-peices/w_king.png"),
      row,
      column,
      boardState
    );
  }

  // Return a default piece (can be an instance of a base ChessPiece class)
  return new ChessPiece("r", "black", 3, row, column, boardState);
}
const initialBoard: PeiceType[][] = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

function Chess() {
  const [boardState, setBoardState] = useState<PeiceType[][]>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<ChessPiece | null>(null);
  const [whiteTurn, setWhiteTurn] = useState(true);

  const handleSquarePress = (row: number, col: number) => {
    console.log(`row: ${row}, col: ${col}`);

    if (selectedPiece === null && boardState[row][col]) {
      //no peice selected select a peice
      const placeholderPeice = getChessPeice(
        boardState[row][col],
        row,
        col,
        boardState
      );
      if (whiteTurn) {
        if (placeholderPeice.player === "white") {
          setSelectedPiece(placeholderPeice);
        }
      } else {
        if (placeholderPeice.player === "black") {
          setSelectedPiece(placeholderPeice);
        }
      }
    } else if (selectedPiece) {
      //peice is selected
      const newBoardState = [...boardState];
      // Check if the selected piece can move to the target square
      if (selectedPiece.isValidMove(row, col)) {
        // Move the piece to the target square
        newBoardState[row][col] =
          newBoardState[selectedPiece.row!][selectedPiece.column!];
        newBoardState[selectedPiece.row!][selectedPiece.column!] = null;
        setBoardState(newBoardState);
        setWhiteTurn(!whiteTurn); 
      }
      setSelectedPiece(null);
    }
  };

  const renderSquare = (row: number, col: number) => {
    const piece = boardState[row][col]
      ? getChessPeice(boardState[row][col], row, col, boardState)
      : null;
    let backgroundColor =
      (row + col) % 2 === 0 ? TERSIARYCOLOR : SECONDARYCOLOR;
    if (selectedPiece) {
      if (selectedPiece.row === row && selectedPiece.column === col) {
        backgroundColor = FOURTHCOLOR;
      }
      if (selectedPiece.moveset && selectedPiece.moveset.length > 0) {
        if (
          selectedPiece.moveset.some(
            ([moveRow, moveCol]) =>
              selectedPiece.row! + moveRow === row &&
              selectedPiece.column! + moveCol === col
          )
        ) {
          backgroundColor = FIFTHCOLOR;
        }
      }
    }

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={[styles.square, { backgroundColor }]}
        onPress={() => handleSquarePress(row, col)}
      >
        {piece && (
          <Image
            source={piece.image}
            style={styles.pieceImage}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.chessContainer}>
      {boardState.map((row, rowIndex) =>
        row.map((_, colIndex) => renderSquare(rowIndex, colIndex))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  chessContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    maxWidth: TILEWIDTH * 8,
  },
  square: {
    width: TILEWIDTH,
    height: TILEWIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  pieceImage: {
    width: TILEWIDTH * 0.8,
    height: TILEWIDTH * 0.8,
  },
});

export default Chess;
