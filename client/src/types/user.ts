export interface User {
    uid: string;
    name: string;
    email: string;
    elo: number;
    created_at: string;
    total_games: number;
    num_wins: number;
    num_losses: number;
    num_draws: number;
  }