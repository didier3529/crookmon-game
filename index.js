const on = emitter.on.bind(emitter);
const off = emitter.off.bind(emitter);
const once = emitter.once.bind(emitter);

export {
  initializeBattle,
  processTurn,
  generateAIMove,
  calculateDamage,
  evaluateVictory,
  advanceWinStreak,
  on,
  off,
  once,
  useBattleEngine
};

export default {
  initializeBattle,
  processTurn,
  generateAIMove,
  calculateDamage,
  evaluateVictory,
  advanceWinStreak,
  on,
  off,
  once,
  useBattleEngine
};