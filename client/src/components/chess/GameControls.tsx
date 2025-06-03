import { useState } from "react";
import Button from "../ui/Button";
import { 
  RotateCcw, 
  FastForward, 
  SkipBack, 
  SkipForward,
  PlayCircle,
  PauseCircle,
  Download,
  Share,
  MessageCircle,
  Flag
} from "lucide-react";

interface GameControlsProps {
  onUndo?: () => void;
  onReset?: () => void;
  onResign?: () => void;
  onOfferDraw?: () => void;
  onFlipBoard?: () => void;
  onExportPgn?: () => void;
  onToggleChat?: () => void;
  canUndo?: boolean;
  gameInProgress?: boolean;
  moveHistory?: string[];
  orientation?: 'white' | 'black';
}

const GameControls = ({
  onUndo,
  onReset,
  onResign,
  onOfferDraw,
  onFlipBoard,
  onExportPgn,
  onToggleChat,
  canUndo = false,
  gameInProgress = true,
  moveHistory = [],
  orientation = 'white'
}: GameControlsProps) => {
  const [viewingMove, setViewingMove] = useState(moveHistory.length);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handlePrevMove = () => {
    if (viewingMove > 0) {
      setViewingMove(viewingMove - 1);
    }
  };
  
  const handleNextMove = () => {
    if (viewingMove < moveHistory.length) {
      setViewingMove(viewingMove + 1);
    }
  };
  
  const handleFirstMove = () => {
    setViewingMove(0);
  };
  
  const handleLastMove = () => {
    setViewingMove(moveHistory.length);
  };
  
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="w-full space-y-4">
      {/* Main controls */}
      <div className="flex flex-wrap gap-2 justify-center">
        {gameInProgress ? (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onUndo} 
              disabled={!canUndo}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              Undo
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onFlipBoard}
              leftIcon={<RotateCcw className="w-4 h-4 rotate-90" />}
            >
              Flip Board
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onOfferDraw}
            >
              Offer Draw
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={onResign}
              leftIcon={<Flag className="w-4 h-4" />}
            >
              Resign
            </Button>
          </>
        ) : (
          <>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReset}
              leftIcon={<RotateCcw className="w-4 h-4" />}
            >
              New Game
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onExportPgn}
              leftIcon={<Download className="w-4 h-4" />}
            >
              Export PGN
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              leftIcon={<Share className="w-4 h-4" />}
            >
              Share
            </Button>
          </>
        )}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleChat}
          leftIcon={<MessageCircle className="w-4 h-4" />}
        >
          Chat
        </Button>
      </div>
      
      {/* Move navigation */}
      {moveHistory.length > 0 && (
        <div className="flex justify-center items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleFirstMove}
            disabled={viewingMove === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handlePrevMove}
            disabled={viewingMove === 0}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={togglePlayback}
          >
            {isPlaying ? (
              <PauseCircle className="w-5 h-5" />
            ) : (
              <PlayCircle className="w-5 h-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleNextMove}
            disabled={viewingMove === moveHistory.length}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLastMove}
            disabled={viewingMove === moveHistory.length}
          >
            <FastForward className="w-4 h-4" />
          </Button>
        </div>
      )}
      
      {/* Move history */}
      <div className="max-h-40 overflow-y-auto bg-gray-50 dark:bg-gray-800 rounded p-2 text-sm">
        {moveHistory.length > 0 ? (
          <div className="grid grid-cols-2 gap-1">
            {moveHistory.map((move, index) => (
              <div 
                key={index}
                className={`px-2 py-1 rounded ${
                  index + 1 === viewingMove 
                    ? "bg-primary-100 dark:bg-primary-900" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                } cursor-pointer transition-colors`}
                onClick={() => setViewingMove(index + 1)}
              >
                {index % 2 === 0 ? (
                  <span className="text-gray-500 mr-2">{Math.floor(index / 2) + 1}.</span>
                ) : null}
                {move}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-4">
            No moves yet
          </div>
        )}
      </div>
    </div>
  );
};

export default GameControls;