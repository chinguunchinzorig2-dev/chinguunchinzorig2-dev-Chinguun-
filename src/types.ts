export interface Player {
  id: string;
  name: string;
  avatar: string;
  progress: number;
  wpm: number;
  errors: number;
  finished: boolean;
  isHost: boolean;
}

export interface Room {
  code: string;
  players: Player[];
  state: 'waiting' | 'countdown' | 'racing' | 'finished';
  countdown: number;
  quote: {
    text: string;
    author: string;
  };
  language: 'mn' | 'en' | 'all';
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: number;
}

export interface ScoreRecord {
  id: string;
  name: string;
  wpm: number;
  errors: number;
  accuracy: number;
  quoteText: string;
  timestamp: string;
}
