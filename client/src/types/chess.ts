// Type definitions for chess components and game state

export interface ChessGame {
  id: string;
  whitePlayer: Player;
  blackPlayer: Player;
  status: GameStatus;
  moves: string[];
  pgn: string;
  timeControl: TimeControl;
  createdAt: Date;
  result?: GameResult;
}

export interface Player {
  id: string;
  username: string;
  rating: number;
  avatar?: string;
}


export type GameStatus = 'waiting' | 'active' | 'completed' | 'aborted';

export interface TimeControl {
  baseTime: number; // in seconds
  increment: number; // in seconds
  type: 'bullet' | 'blitz' | 'rapid' | 'classical';
}

export interface GameResult {
  winner?: 'white' | 'black';
  reason: 'checkmate' | 'timeout' | 'resignation' | 'draw' | 'stalemate' | 'insufficient' | 'repetition' | 'agreement' | 'abandoned';
}

export interface ChatMessage {
  id: string;
  gameId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface GameMove {
  from: string;
  to: string;
  promotion?: string;
  piece: string;
  color: 'w' | 'b';
  san: string;
  timestamp: Date;
  timeLeft: number; // time left in seconds after move
}

export interface AISettings {
  level: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  ratingEstimate: number;
  depth?: number;
  skillLevel?: number;
}