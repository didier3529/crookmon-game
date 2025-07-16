// Core Game Types
export interface Card {
  id: string;
  name: string;
  type: 'creature' | 'spell' | 'artifact';
  cost: number;
  attack?: number;
  defense?: number;
  abilities?: string[];
  description: string;
}

export interface Character {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  statusEffects: StatusEffect[];
}

export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  type: 'buff' | 'debuff';
  effect: any;
}

export interface Move {
  id: string;
  name: string;
  type: 'attack' | 'defend' | 'special';
  damage?: number;
  cost?: number;
  cooldown?: number;
}

// Battle System Types
export interface BattleConfig {
  playerDeck: Card[];
  opponentDeck: Card[];
  seed?: number;
  gameMode?: 'standard' | 'ranked' | 'casual';
  maxTurns?: number;
}

export interface BattleState {
  id: string;
  phase: 'initializing' | 'selecting' | 'resolving' | 'finished';
  player: Character;
  opponent: Character;
  currentTurn: number;
  maxTurns: number;
  playerDeck: Card[];
  opponentDeck: Card[];
  playerHand: Card[];
  opponentHand: Card[];
  lastAction?: BattleAction;
  winner?: 'player' | 'opponent' | 'draw';
  seed: number;
}

export interface BattleAction {
  type: 'attack' | 'defend' | 'use_card' | 'switch' | 'item';
  playerId: 'player' | 'opponent';
  cardId?: string;
  targetId?: string;
  moveId?: string;
  data?: any;
}

export interface VictoryResult {
  winner: 'player' | 'opponent' | 'draw';
  reason: 'defeat' | 'timeout' | 'surrender';
  turnsPlayed: number;
  playerHealth: number;
  opponentHealth: number;
}

// Duel System Types
export interface DuelOutcome {
  winner: 'player' | 'opponent' | 'draw';
  turnsPlayed: number;
  finalScores: {
    player: number;
    opponent: number;
  };
}

export interface DuelTurnResult {
  success: boolean;
  action: BattleAction;
  newState: BattleState;
  events: DuelEvent[];
}

export interface DuelEvent {
  type: string;
  data: any;
  timestamp: number;
}

// AI Types
export interface AIMoveOptions {
  difficulty?: 'easy' | 'medium' | 'hard';
  strategy?: 'aggressive' | 'defensive' | 'balanced';
  randomness?: number;
}

// Event System Types
export type EventListener = (...args: any[]) => void;
export type UnsubscribeFunction = () => void;

// React Hook Types
export interface BattleEngineHook {
  state: BattleState;
  initialize: (config: BattleConfig) => void;
  processTurn: (action: BattleAction) => void;
  generateAIMove: (options?: AIMoveOptions) => BattleAction;
  subscribe: (event: string, listener: EventListener) => UnsubscribeFunction;
  isLoading: boolean;
  error?: string;
}

// Query Params Types
export type QueryParamsInput =
  | Record<string, string | number | boolean | null | undefined>
  | URLSearchParams
  | string[][];

// Settings Types
export interface GameSettings {
  volume: number;
  soundEnabled: boolean;
  musicEnabled: boolean;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: boolean;
  autoSave: boolean;
}

// Win Streak Types
export interface WinStreakData {
  current: number;
  best: number;
  lastUpdated: number;
}

// Context Types
export interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  resetSettings: () => void;
}

export interface WinStreakContextType {
  winStreak: WinStreakData;
  incrementStreak: () => void;
  resetStreak: () => void;
}

export interface DuelContextType {
  currentDuel: string | null;
  startDuel: (config: BattleConfig) => void;
  endDuel: () => void;
  duelHistory: DuelOutcome[];
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Re-export types from the d.ts file for backward compatibility
export * from './d';
