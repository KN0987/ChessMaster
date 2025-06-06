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
    <div className="h-screen container mx-auto px-4 py-6">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game information */}
        <div className="lg:col-span-2 flex flex-col h-full">

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full">

            <div className="flex flex-col justify-center items-center flex-grow">
              {/* Top player info */}
              <div className="lg:hidden w-full mb-2">
  <PlayerInfo
    username={orientation === "white" ? blackPlayer.username : whitePlayer.username}
    rating={orientation === "white" ? blackPlayer.rating : whitePlayer.rating}
    timeLeft={orientation === "white" ? timeBlack : timeWhite}
    isActive={game.turn() === (orientation === "white" ? "b" : "w")}
    isTop={true}
  />
</div>


              {/* Chess board */}
              <ChessBoard
                position={game.fen()}
                onMove={handleMove}
                orientation={orientation}
                allowMoves={true}
                className="aspect-square"
              />

              {/* Mobile player info (Bottom) */}
<div className="lg:hidden w-full mt-2">
  <PlayerInfo
    username={orientation === "white" ? whitePlayer.username : blackPlayer.username}
    rating={orientation === "white" ? whitePlayer.rating : blackPlayer.rating}
    timeLeft={orientation === "white" ? timeWhite : timeBlack}
    isActive={game.turn() === (orientation === "white" ? "w" : "b")}
  />
</div>


            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="relative flex flex-col justify-center space-y-4 h-full">
          <div className="absolute w-full top-4 hidden lg:block">
          <PlayerInfo
            username={orientation === "white" ? blackPlayer.username : whitePlayer.username}
            rating={orientation === "white" ? blackPlayer.rating : whitePlayer.rating}
            timeLeft={orientation === "white" ? timeBlack : timeWhite}
            isActive={game.turn() === (orientation === "white" ? "b" : "w")}
            isTop={true}
          />
          </div>

          {/* Game controls */}
          <Card className="p-4">
            <GameControls
              mode="online"
              onUndo={() => { }}
              onReset={() => { }}
              onResign={handleResign}
              onOfferDraw={handleOfferDraw}
              onFlipBoard={handleFlipBoard}
              onExportPgn={() => { }}
              onToggleChat={toggleChat}
              canUndo={false}
              gameInProgress={!game.isGameOver()}
              moveHistory={moveHistory}
              orientation={orientation}
            />
          </Card>

          {/* Bottom player info */}
          <div className="absolute w-full bottom-4 hidden lg:block">

          <PlayerInfo
            username={orientation === "white" ? whitePlayer.username : blackPlayer.username}
            rating={orientation === "white" ? whitePlayer.rating : blackPlayer.rating}
            timeLeft={orientation === "white" ? timeWhite : timeBlack}
            isActive={game.turn() === (orientation === "white" ? "w" : "b")}
          />
          </div>



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