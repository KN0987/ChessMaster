import { useState, useEffect } from "react";
import { Chess, Move, PieceSymbol, Color, Square } from "chess.js";
import { Maximize2, Minimize2 } from "lucide-react";
import ChessPiece from "./ChessPiece";
import { twMerge } from "tailwind-merge";

interface ChessBoardProps {
  position?: string;
  onMove?: (move: Move) => void;
  orientation?: "white" | "black";
  allowMoves?: boolean;
  className?: string;
}

const ChessBoard = ({
  position = "start",
  onMove,
  orientation = "white",
  allowMoves = true,
  className,
}: ChessBoardProps) => {
  const [game, setGame] = useState(new Chess(position));
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(orientation);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Update the game if position changes
  useEffect(() => {
    setGame(new Chess(position));
  }, [position]);
  
  // Update orientation if it changes
  useEffect(() => {
    setBoardOrientation(orientation);
  }, [orientation]);

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const boardElement = document.getElementById('chess-board');
        if (boardElement) {
          await boardElement.requestFullscreen();
        }
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };
  
  // Handle square click
  const handleSquareClick = (square: Square) => {
    if (!allowMoves) return;
    
    // If no square is selected, select the square if it has a piece
    if (!selectedSquare) {
      const piece = game.get(square);
      if (piece && piece.color === game.turn()) {
        setSelectedSquare(square);
        // Get legal moves for the selected piece
        const moves = game.moves({ square, verbose: true });
        setLegalMoves(moves.map((move) => move.to as Square));
      }
    } 
    // If a square is already selected
    else {
      // If the clicked square is a legal move, make the move
      if (legalMoves.includes(square)) {
        try {
          const move = game.move({
            from: selectedSquare,
            to: square,
            promotion: "q", // Always promote to queen for simplicity
          });
          
          if (move && onMove) {
            onMove(move);
          }
          
          // Reset selection
          setSelectedSquare(null);
          setLegalMoves([]);
        } catch (error) {
          console.error("Invalid move:", error);
        }
      } 
      // If the clicked square has a piece of the current player's color, select it
      else {
        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
          setSelectedSquare(square);
          const moves = game.moves({ square, verbose: true });
          setLegalMoves(moves.map((move) => move.to as Square));
        } else {
          // Reset selection
          setSelectedSquare(null);
          setLegalMoves([]);
        }
      }
    }
  };
  
  // Generate the board squares
  const renderBoard = () => {
    const squares = [];
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
    
    // Reverse the ranks if black orientation
    const orderedRanks = boardOrientation === "white" ? [...ranks].reverse() : ranks;
    const orderedFiles = boardOrientation === "white" ? files : [...files].reverse();
    
    for (const rank of orderedRanks) {
      for (const file of orderedFiles) {
        const square = `${file}${rank}` as Square;
        const isLight = (parseInt(rank) + files.indexOf(file)) % 2 === 1;
        const piece = game.get(square);
        
        squares.push(
          <div
            key={square}
            className={twMerge(
              "relative w-1/8 aspect-square flex items-center justify-center",
              isLight ? "bg-board-light" : "bg-board-dark",
              legalMoves.includes(square) && "after:absolute after:w-4 after:h-4 after:rounded-full",
              game.turn() === "w" ? "after:bg-white" : "after:bg-black",
      
            )}
            onClick={() => handleSquareClick(square)}
            data-square={square}
          >
            {piece && (
              <ChessPiece 
                type={piece.type} 
                color={piece.color} 
                isSelected={selectedSquare === square} 
              />
            )}
            
            {/* File labels (bottom row) */}
            {rank === (boardOrientation === "white" ? "1" : "8") && (
              <span className="absolute bottom-0 right-1 text-xs opacity-70">
                {file}
              </span>
            )}
            
            {/* Rank labels (leftmost column) */}
            {file === (boardOrientation === "white" ? "a" : "h") && (
              <span className="absolute top-0 left-1 text-xs opacity-70">
                {rank}
              </span>
            )}
          </div>
        );
      }
    }
    
    return squares;
  };

  return (
    <div 
      id="chess-board"
      className={twMerge(
        "relative w-full max-w-2xl mx-auto overflow-hidden rounded-xl cartoon-card",
        isFullscreen && "max-w-none h-screen flex items-center justify-center bg-gray-900",
        className
      )}
    >
      <div className="grid grid-cols-8 w-full">
        {renderBoard()}
      </div>
      <button
        onClick={toggleFullscreen}
        className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg shadow-md hover:bg-white transition-colors"
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? (
          <Minimize2 className="w-5 h-5" />
        ) : (
          <Maximize2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ChessBoard;