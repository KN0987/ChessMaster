import { Server } from 'socket.io';

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  const waitingPlayers = {
    blitz: [],
    quick: [],
    normal: [],
  };

  // Stores pending matches awaiting player confirmation
  const pendingMatches = new Map();

  io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on('joinQueue', ({ matchType, timeControl, uid }) => {
      const queue = waitingPlayers[timeControl];

      if (!queue) {
        console.warn(`Invalid timeControl: ${timeControl}`);
        return;
      }

      queue.push({ socketId: socket.id, uid, matchType });
      console.log('Adding Player to queue: ',waitingPlayers);

      if (queue.length >= 2) {
        const player1 = queue.shift();
        const player2 = queue.shift();

        const matchId = generateUniqueRoomId();

        pendingMatches.set(matchId, {
          player1,
          player2,
          timeControl,
          matchType,
          accepted: new Set(),
        });

        io.to(player1.socketId).emit('matchFound', { matchId, opponent: player2.uid });
        io.to(player2.socketId).emit('matchFound', { matchId, opponent: player1.uid });
      }
    });

    socket.on("cancelQueue", ({timeControl, uid }) => {
      const queue = waitingPlayers[timeControl];
      if (!queue) {
        console.warn(`Invalid timeControl: ${timeControl}`);
        return;
      }

      const index = queue.findIndex(player => player.uid === uid);
      if (index !== -1) {
        queue.splice(index, 1);
        console.log(`Player ${uid} removed from ${timeControl} queue.`);
        console.log('Current waiting players:', waitingPlayers);
      } else {
        console.warn(`Player ${uid} not found in ${timeControl} queue.`);
      }
    })

    socket.on('acceptMatch', ({ matchId, uid }) => {
      const match = pendingMatches.get(matchId);
      if (!match) return;

      match.accepted.add(uid);

      if (
        match.accepted.has(match.player1.uid) &&
        match.accepted.has(match.player2.uid)
      ) {
        const roomId = generateUniqueRoomId();
        console.log(`Starting match ${matchId} in room ${roomId}`);

        io.sockets.sockets.get(match.player1.socketId)?.join(roomId);
        io.sockets.sockets.get(match.player2.socketId)?.join(roomId);

        io.to(roomId).emit('gameStart', { roomId });
        pendingMatches.delete(matchId);
      }
    });

    socket.on('declineMatch', ({ matchId, uid }) => {
      const match = pendingMatches.get(matchId);
      if (!match) return;
    
      const { player1, player2, timeControl } = match;
      console.log("Player 1", player1);
      console.log("Player 2", player2);
      const declinedBy = uid;
      const otherPlayer = player1.uid === uid ? player2 : player1;
    
      // Requeue the player who accepted
      if (timeControl) {
        waitingPlayers[timeControl].push(otherPlayer);
      }
    
      // Notify both players
      io.to(player1.socketId).emit('matchDeclined', { declinedBy: uid });
      io.to(player2.socketId).emit('matchDeclined', { declinedBy: uid });
    
      pendingMatches.delete(matchId);
      console.log('Match declined by', uid, ". Current waiting players:", waitingPlayers);
    });
    

    socket.on('disconnect', () => {
      console.log('A player disconnected:', socket.id);

      // Remove from queues
      Object.keys(waitingPlayers).forEach(type => {
        waitingPlayers[type] = waitingPlayers[type].filter(p => p.socketId !== socket.id);
      });

      // Remove from pending matches
      for (const [matchId, match] of pendingMatches.entries()) {
        if (match.player1.socketId === socket.id || match.player2.socketId === socket.id) {
          io.to(match.player1.socketId).emit('matchDeclined', { declinedBy: 'disconnected' });
          io.to(match.player2.socketId).emit('matchDeclined', { declinedBy: 'disconnected' });
          pendingMatches.delete(matchId);
        }
      }
    });
  });

  const generateUniqueRoomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };
};

export default setupSocket;
