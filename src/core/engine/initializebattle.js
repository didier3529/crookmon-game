import EventEmitter from '../utils/eventemitter.js';
import { createRNG } from '../utils/rng.js';

function deepClone(obj) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}

const DEFAULT_CONFIG = {
  participants: [],
  scenario: {},
  seed: Date.now(),
  maxRounds: 1000,
  logging: false,
};

export function initializeBattle(userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  if (!Array.isArray(config.participants)) {
    throw new Error('initializeBattle: participants must be an array');
  }
  const seed = config.seed != null ? Number(config.seed) : Date.now();
  const rng = createRNG(seed);

  const initialState = {
    rounds: 0,
    running: false,
    participants: config.participants.map((p) => ({
      ...deepClone(p),
      alive: true,
    })),
    scenario: deepClone(config.scenario),
  };

  let state = deepClone(initialState);
  const emitter = new EventEmitter();

  function getState() {
    return deepClone(state);
  }

  function reset() {
    state = deepClone(initialState);
    emitter.emit('reset', getState());
    return getState();
  }

  function isBattleOver() {
    const aliveCount = state.participants.filter((p) => p.alive).length;
    return aliveCount <= 1 || state.rounds >= config.maxRounds;
  }

  function advanceRound() {
    state.rounds += 1;
    emitter.emit('roundStart', getState());
    const actors = state.participants.filter((p) => p.alive);
    for (const actor of actors) {
      const targets = actors.filter((t) => t.id !== actor.id && t.alive);
      if (targets.length === 0) break;
      const target = targets[Math.floor(rng() * targets.length)];
      const damage = Math.ceil((actor.attack || 1) * rng());
      target.hp = Math.max(0, (target.hp || 0) - damage);
      if (target.hp === 0) target.alive = false;
      emitter.emit('action', {
        actor: deepClone(actor),
        target: deepClone(target),
        damage,
      });
    }
    emitter.emit('roundEnd', getState());
  }

  function start() {
    if (state.running) return getState();
    state.running = true;
    emitter.emit('start', getState());
    while (!isBattleOver() && state.running) {
      advanceRound();
    }
    state.running = false;
    emitter.emit('end', getState());
    return getState();
  }

  function stop() {
    if (!state.running) return getState();
    state.running = false;
    emitter.emit('stop', getState());
    return getState();
  }

  return {
    config: deepClone(config),
    getState,
    reset,
    start,
    stop,
    on: emitter.on.bind(emitter),
    off: emitter.off.bind(emitter),
  };
}

export default initializeBattle;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = initializeBattle;
}
