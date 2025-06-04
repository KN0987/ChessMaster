import { PieceSymbol, Color } from "chess.js";
import { twMerge } from "tailwind-merge";

interface ChessPieceProps {
  type: PieceSymbol;
  color: Color;
  isSelected?: boolean;
  className?: string;
}

const ChessPiece = ({ type, color, isSelected = false, className }: ChessPieceProps) => {
  // Helper to get the Unicode character for each piece
  const getPieceUnicode = (type: PieceSymbol, color: Color): string => {
    const pieces = {
      white: {
        p: "♟", // pawn
        n: "♞", // knight
        b: "♝", // bishop
        r: "♜", // rook
        q: "♛", // queen
        k: "♚", // king
      },
      black: {
        p: "♟", // pawn
        n: "♞", // knight
        b: "♝", // bishop
        r: "♜", // rook
        q: "♛", // queen
        k: "♚", // king
      },
    };
    
    return pieces[color === "w" ? "white" : "black"][type];
  };

  return (
    <div
      className={twMerge(
        "w-full h-full flex items-center justify-center piece-transition select-none",
        isSelected ? "scale-105" : "",
        color === "w" ? "text-white drop-shadow-md" : "text-gray-900",
        className
      )}
    >
      <span className="text-4xl md:text-8xl font-bold">
        {getPieceUnicode(type, color)}
      </span>
    </div>
  );
};

export default ChessPiece;