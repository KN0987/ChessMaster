/**
 * Utility functions for chess operations
 */

/**
 * Convert algebraic notation to board coordinates
 */
export const squareToCoords = (square: string): [number, number] => {
  const file = square.charCodeAt(0) - 97; // 'a' -> 0, 'b' -> 1, etc.
  const rank = 8 - parseInt(square[1]); // '1' -> 7, '2' -> 6, etc.
  return [rank, file];
};

/**
 * Convert board coordinates to algebraic notation
 */
export const coordsToSquare = (row: number, col: number): string => {
  const file = String.fromCharCode(97 + col); // 0 -> 'a', 1 -> 'b', etc.
  const rank = 8 - row; // 7 -> '1', 6 -> '2', etc.
  return `${file}${rank}`;
};

/**
 * Get color name from piece color
 */
export const getColorName = (color: 'w' | 'b'): 'white' | 'black' => {
  return color === 'w' ? 'white' : 'black';
};

/**
 * Format time in seconds to mm:ss
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

/**
 * Format ELO rating change
 */
export const formatRatingChange = (change: number): string => {
  if (change > 0) {
    return `+${change}`;
  }
  return `${change}`;
};

/**
 * Generate a PGN string from a list of moves
 */
export const generatePGN = (
  moves: string[],
  whitePlayer: string,
  blackPlayer: string,
  result: string,
  date: Date
): string => {
  const eventDate = date.toISOString().split('T')[0];
  
  let pgn = `[Event "Online Chess Game"]
[Site "ChessMaster"]
[Date "${eventDate}"]
[White "${whitePlayer}"]
[Black "${blackPlayer}"]
[Result "${result}"]

`;

  // Add moves
  for (let i = 0; i < moves.length; i++) {
    if (i % 2 === 0) {
      pgn += `${Math.floor(i / 2) + 1}. `;
    }
    pgn += `${moves[i]} `;
    
    // Add line break every 5 full moves
    if (i % 10 === 9) {
      pgn += '\n';
    }
  }
  
  pgn += ` ${result}`;
  
  return pgn;
};

/**
 * Calculate estimated ELO change based on result and rating difference
 */
export const calculateEloChange = (
  playerRating: number,
  opponentRating: number,
  result: 'win' | 'loss' | 'draw'
): number => {
  const K = 32; // K-factor
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
  
  let actualScore = 0.5;
  if (result === 'win') actualScore = 1;
  if (result === 'loss') actualScore = 0;
  
  return Math.round(K * (actualScore - expectedScore));
};