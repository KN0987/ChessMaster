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
      console.log('Queue updated:', waitingPlayers);

      if (queue.length >= 2) {
        const player1 = queue.shift();
        const player2 = queue.shift();
        const matchId = generateUniqueRoomId();

        const timeout = setTimeout(() => {
          const match = pendingMatches.get(matchId);
          if (!match) return;

          const { accepted, player1, player2, timeControl } = match;

          if (!accepted.has(player1.uid) && !accepted.has(player2.uid)) {
            io.to(player1.socketId).emit('matchDeclined', { declinedBy: player1.uid, reason: 'timeout' });
            io.to(player2.socketId).emit('matchDeclined', { declinedBy: player2.uid, reason: 'timeout' });
            pendingMatches.delete(matchId);
          } else {
            const acceptedPlayer = accepted.has(player1.uid) ? player1 : player2;
            const declinedPlayer = accepted.has(player1.uid) ? player2 : player1;

            io.to(acceptedPlayer.socketId).emit('matchDeclined', { declinedBy: declinedPlayer.uid, reason: 'timeout' });
            io.to(declinedPlayer.socketId).emit('matchDeclined', { declinedBy: declinedPlayer.uid, reason: 'timeout' });

            waitingPlayers[timeControl].push(acceptedPlayer);
            pendingMatches.delete(matchId);
          }
        }, 15000);

        pendingMatches.set(matchId, {
          player1,
          player2,
          timeControl,
          matchType,
          accepted: new Set(),
          timeout,
        });

        io.to(player1.socketId).emit('matchFound', { matchId, opponent: player2.uid });
        io.to(player2.socketId).emit('matchFound', { matchId, opponent: player1.uid });
      }
    });

    socket.on('cancelQueue', ({ timeControl, uid }) => {
      const queue = waitingPlayers[timeControl];
      if (!queue) return;

      const index = queue.findIndex(player => player.uid === uid);
      if (index !== -1) {
        queue.splice(index, 1);
        console.log(`Player ${uid} removed from ${timeControl} queue.`);
      }
    });

    socket.on('acceptMatch', ({ matchId, uid }) => {
      const match = pendingMatches.get(matchId);
      if (!match) return;

      match.accepted.add(uid);

      if (
        match.accepted.has(match.player1.uid) &&
        match.accepted.has(match.player2.uid)
      ) {
        clearTimeout(match.timeout);

        const roomId = generateUniqueRoomId();
        console.log(`Both players accepted. Starting match ${matchId} in room ${roomId}`);

        io.sockets.sockets.get(match.player1.socketId)?.join(roomId);
        io.sockets.sockets.get(match.player2.socketId)?.join(roomId);

        io.to(roomId).emit('gameStart', { roomId });
        pendingMatches.delete(matchId);
      }
    });

    socket.on('declineMatch', ({ matchId, uid }) => {
      const match = pendingMatches.get(matchId);
      if (!match) return;

      clearTimeout(match.timeout);

      const { player1, player2, timeControl } = match;
      const declinedBy = uid;
      const otherPlayer = player1.uid === uid ? player2 : player1;

      waitingPlayers[timeControl].push(otherPlayer);

      io.to(player1.socketId).emit('matchDeclined', { declinedBy: uid, reason: 'manual' });
      io.to(player2.socketId).emit('matchDeclined', { declinedBy: uid, reason: 'manual' });

      pendingMatches.delete(matchId);
    });

    socket.on('disconnect', () => {
      console.log('A player disconnected:', socket.id);

      // Remove from waiting queues
      Object.keys(waitingPlayers).forEach(type => {
        waitingPlayers[type] = waitingPlayers[type].filter(p => p.socketId !== socket.id);
      });

      for (const [matchId, match] of pendingMatches.entries()) {
        if (match.player1.socketId === socket.id || match.player2.socketId === socket.id) {
          clearTimeout(match.timeout);
          io.to(match.player1.socketId).emit('matchDeclined', { declinedBy: 'disconnected', reason: 'disconnect' });
          io.to(match.player2.socketId).emit('matchDeclined', { declinedBy: 'disconnected', reason: 'disconnect' });
          pendingMatches.delete(matchId);
        }
      }
    });
  });

  const generateUniqueRoomId = () => {
    return Math.random().toString(36).substring(2, 10);
  };
};

export default setupSocket;
