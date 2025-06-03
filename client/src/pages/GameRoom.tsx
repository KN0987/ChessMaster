import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChessBoard from "../components/chess/ChessBoard";
import GameControls from "../components/chess/GameControls";
import PlayerInfo from "../components/chess/PlayerInfo";
import ChatBox from "../components/chess/ChatBox";
import { Card } from "../components/ui/Card";
import { Chess, Move } from "chess.js";
import { Clock, MessageCircle, Users } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

const GameRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [game, setGame] = useState(new Chess());
  const [orientation, setOrientation] = useState<"white" | "black">("white");
  const [timeWhite, setTimeWhite] = useState(300); // 5 minutes in seconds
  const [timeBlack, setTimeBlack] = useState(300);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Game started. Good luck!",
      timestamp: new Date(),
      isSystem: true,
    },
  ]);
  
  // Mock player data
  const whitePlayer = {
    username: "Player1",
    rating: 1650,
    timeLeft: timeWhite,
  };
  
  const blackPlayer = {
    username: "Player2",
    rating: 1720,
    timeLeft: timeBlack,
  };
  
  // Handle chess moves
  const handleMove = (move: Move) => {
    try {
      // Update move history
      setMoveHistory([...moveHistory, move.san]);
      
      // Update game state (in a real app this would be synced with the server)
      const newGame = new Chess(game.fen());
      newGame.move({
        from: move.from,
        to: move.to,
        promotion: move.promotion,
      });
      setGame(newGame);
      
      // Check for game over
      if (newGame.isGameOver()) {
        let endMessage = "Game over: ";
        if (newGame.isCheckmate()) {
          endMessage += `Checkmate! ${newGame.turn() === "w" ? "Black" : "White"} wins!`;
        } else if (newGame.isDraw()) {
          endMessage += "Draw!";
          if (newGame.isStalemate()) {
            endMessage += " (Stalemate)";
          } else if (newGame.isThreefoldRepetition()) {
            endMessage += " (Threefold Repetition)";
          } else if (newGame.isInsufficientMaterial()) {
            endMessage += " (Insufficient Material)";
          }
        }
        
        // Add game over message
        addMessage({
          id: Date.now().toString(),
          sender: "System",
          content: endMessage,
          timestamp: new Date(),
          isSystem: true,
        });
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };
  
  // Flip the board
  const handleFlipBoard = () => {
    setOrientation(orientation === "white" ? "black" : "white");
  };
  
  // Handle chat messages
  const handleSendMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content,
      timestamp: new Date(),
    };
    addMessage(newMessage);
  };
  
  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };
  
  // Toggle chat visibility
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  // Handle resign
  const handleResign = () => {
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: "You resigned. Game over.",
      timestamp: new Date(),
      isSystem: true,
    });
  };
  
  // Handle offer draw
  const handleOfferDraw = () => {
    addMessage({
      id: Date.now().toString(),
      sender: "System",
      content: "You offered a draw.",
      timestamp: new Date(),
      isSystem: true,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game information */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="flex justify-between items-center mb-4">
              <h1 className="font-serif text-2xl font-bold text-gray-900 dark:text-white">
                Game #{roomId}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4" />
                <span>5:00</span>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Live</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Top player info */}
              <PlayerInfo
                username={orientation === "white" ? blackPlayer.username : whitePlayer.username}
                rating={orientation === "white" ? blackPlayer.rating : whitePlayer.rating}
                timeLeft={orientation === "white" ? timeBlack : timeWhite}
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
                username={orientation === "white" ? whitePlayer.username : blackPlayer.username}
                rating={orientation === "white" ? whitePlayer.rating : blackPlayer.rating}
                timeLeft={orientation === "white" ? timeWhite : timeBlack}
                isActive={game.turn() === (orientation === "white" ? "w" : "b")}
              />
            </div>
          </div>
        </div>
        
        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Game controls */}
          <Card className="p-4">
            <GameControls
              onUndo={() => {}}
              onReset={() => {}}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              onFlipBoard={handleFlipBoard}
              onExportPgn={() => {}}
              onToggleChat={toggleChat}
              canUndo={false}
              gameInProgress={!game.isGameOver()}
              moveHistory={moveHistory}
              orientation={orientation}
            />
          </Card>
          
          {/* Spectators */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-900 dark:text-white">
                Spectators
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4" />
                <span>3</span>
              </div>
            </div>
            <div className="space-y-2">
              {["Spectator1", "Spectator2", "Spectator3"].map((name, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Chat */}
          {showChat && (
            <ChatBox
              messages={messages}
              onSendMessage={handleSendMessage}
              onClose={toggleChat}
            />
          )}
          
          {!showChat && (
            <button
              className="flex items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-md w-full justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              onClick={toggleChat}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Open Chat</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameRoom;