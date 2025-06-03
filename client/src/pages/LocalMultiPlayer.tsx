import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChessBoard from '../components/chess/ChessBoard';
import GameControls from '../components/chess/GameControls';
import PlayerInfo from '../components/chess/PlayerInfo';
import { Card } from '../components/ui/Card';
import { Chess, Move } from 'chess.js';

const LocalMultiPlayer = () => {
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  
  // Handle chess moves
  const handleMove = (move: Move) => {
    try {
      // Update move history
      setMoveHistory([...moveHistory, move.san]);
      
      // Update game state
      const newGame = new Chess(game.fen());
      newGame.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });
      setGame(newGame);
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };
  
  // Flip the board
  const handleFlipBoard = () => {
    setOrientation(orientation === "white" ? "black" : "white");
  };
  
  // Reset game
  const handleReset = () => {
    setGame(new Chess());
    setMoveHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <Link to="/" className="mr-4">
            <button className="cartoon-button bg-white px-4 py-2 rounded-xl">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </Link>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Local Multiplayer
          </h1>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {/* Top player info */}
            <PlayerInfo
              username={orientation === "white" ? "Black Player" : "White Player"}
              isActive={game.turn() === (orientation === "white" ? "b" : "w")}
              isTop={true}
            />
            
            {/* Chess board */}
            <ChessBoard
              position={game.fen()}
              onMove={handleMove}
              orientation={orientation}
              allowMoves={true}
              className="aspect-square"
            />
            
            {/* Bottom player info */}
            <PlayerInfo
              username={orientation === "white" ? "White Player" : "Black Player"}
              isActive={game.turn() === (orientation === "white" ? "w" : "b")}
            />
            
            {/* Game controls */}
            <GameControls
              onFlipBoard={handleFlipBoard}
              onReset={handleReset}
              gameInProgress={!game.isGameOver()}
              moveHistory={moveHistory}
              orientation={orientation}
            />
          </div>
        </Card>
        
        {/* Game status */}
        {game.isGameOver() && (
          <div className="mt-6 p-4 cartoon-card bg-accent-100 text-center">
            <h2 className="text-xl font-bold mb-2">Game Over!</h2>
            <p>
              {game.isCheckmate()
                ? `Checkmate! ${game.turn() === 'w' ? 'Black' : 'White'} wins!`
                : game.isDraw()
                ? "It's a draw!"
                : 'Game ended'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalMultiPlayer;