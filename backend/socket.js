import { Server } from 'socket.io';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Store players waiting for a match using their uid
  let waitingPlayers = [];

  io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // When a player joins the queue
    socket.on('joinQueue', ({ matchType, timeControl, uid }) => {
      // Store the player's uid in the waiting queue
      waitingPlayers.push({ socketId: socket.id, uid, matchType, timeControl });
      console.log(`Player ${uid} joined the queue. Waiting players: ${waitingPlayers.length}`);

      if (waitingPlayers.length >= 2) {
        // Match two players
        const player1 = waitingPlayers.pop();
        const player2 = waitingPlayers.pop();

        const roomId = generateUniqueRoomId();
        io.to(player1.socketId).join(roomId); // Player 1 joins the room
        io.to(player2.socketId).join(roomId); // Player 2 joins the room

        // Notify both players that they have been matched
        io.to(player1.socketId).emit('matchFound', { roomId, opponent: player2.uid });
        io.to(player2.socketId).emit('matchFound', { roomId, opponent: player1.uid });

        // Start the game
        io.to(roomId).emit('gameStart');
      }
    });

    // Handle disconnections
    socket.on('disconnect', () => {
      console.log('A player disconnected:', socket.id);
      // Remove from waiting players if they were waiting for a match
      waitingPlayers = waitingPlayers.filter(player => player.socketId !== socket.id);
    });

    // Handle cancelQueue event
    socket.on('cancelQueue', ({ uid }) => {
      waitingPlayers = waitingPlayers.filter(player => player.uid !== uid); // Remove player from queue by uid
      console.log(`Player ${uid} cancelled waiting`);
    });
  });

  // Function to generate a unique room ID
  const generateUniqueRoomId = () => {
    return Math.random().toString(36).substr(2, 9); // Random 9-character string
  };
};

export default setupSocket;
