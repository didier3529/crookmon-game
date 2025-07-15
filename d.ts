export function initializeBattle(config: BattleConfig): BattleState;
export function processTurn(state: BattleState, action: BattleAction): BattleState;
export function generateAIMove(state: BattleState, options?: AIMoveOptions): BattleAction;
export function calculateDamage(attacker: Character, defender: Character, move: Move): number;
export function evaluateVictory(state: BattleState): VictoryResult;
export function advanceWinStreak(playerId: string, victory: VictoryResult): number;
export function subscribe(event: string, listener: EventListener): UnsubscribeFunction;

export interface BattleEngineHook {
  state: BattleState;
  initialize: (config: BattleConfig) => void;
  processTurn: (action: BattleAction) => void;
  generateAIMove: (options?: AIMoveOptions) => BattleAction;
  subscribe: (event: string, listener: EventListener) => UnsubscribeFunction;
}

export function useBattleEngine(config: BattleConfig): BattleEngineHook;