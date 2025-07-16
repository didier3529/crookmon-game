// Core engine imports
import generateAIMove from './src/core/ai/generateaimove.js';
import advanceWinStreak from './src/core/engine/advancewinstreak.js';
import calculateDamage from './src/core/engine/calculatedamage.js';
import evaluateVictory from './src/core/engine/evaluatevictory.js';
import initializeBattle from './src/core/engine/initializebattle.js';
import processTurn from './src/core/engine/processturn.js';

// Core utilities
import StateMachine from './src/core/state/statemachine.js';
import EventEmitter from './src/core/utils/eventemitter.js';
import RNG from './src/core/utils/rng.js';

// React integration
import useBattleEngine from './src/hooks/usebattleengine.js';

// Create global emitter instance for the library
const emitter = new EventEmitter();

// Bind emitter methods for easy access
const on = emitter.on.bind(emitter);
const off = emitter.off.bind(emitter);
const once = emitter.once.bind(emitter);
const emit = emitter.emit.bind(emitter);

// Named exports for ES modules
export {
  // Event system
  EventEmitter,
  RNG,
  // Core utilities
  StateMachine,
  advanceWinStreak,
  calculateDamage,
  emit,
  emitter,
  evaluateVictory,
  generateAIMove,
  // Core battle engine
  initializeBattle,
  off,
  on,
  once,
  processTurn,
  // React integration
  useBattleEngine,
};

// Default export for CommonJS compatibility
export default {
  // Core battle engine
  initializeBattle,
  processTurn,
  generateAIMove,
  calculateDamage,
  evaluateVictory,
  advanceWinStreak,

  // Event system
  EventEmitter,
  emitter,
  on,
  off,
  once,
  emit,

  // Core utilities
  StateMachine,
  RNG,

  // React integration
  useBattleEngine,
};
