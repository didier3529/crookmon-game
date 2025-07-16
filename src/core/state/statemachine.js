const machines = new WeakMap();
function deepFreeze(obj) {
  if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) return obj;
  Object.freeze(obj);
  for (const key of Object.getOwnPropertyNames(obj)) {
    deepFreeze(obj[key]);
  }
  return obj;
}
function createStateMachine(config) {
  if (!config || typeof config !== 'object') throw new Error("Invalid config");
  const { initial, states } = config;
  if (typeof initial !== 'string') throw new Error("Config must have an initial state string");
  if (!states || typeof states !== 'object') throw new Error("Config must have a states object");
  if (!Object.prototype.hasOwnProperty.call(states, initial)) throw new Error(`Initial state '${initial}' is not defined in states`);
  deepFreeze(config);
  const internals = { config, state: initial, listeners: [] };
  const machine = {};
  machines.set(machine, internals);
  Object.freeze(machine);
  return machine;
}
function transition(machine, event) {
  const internals = machines.get(machine);
  if (!internals) throw new Error("Invalid state machine");
  if (typeof event !== 'string') throw new Error(`Event must be a string, got ${typeof event}`);
  const { config, listeners } = internals;
  const current = internals.state;
  const stateDef = config.states[current];
  if (!stateDef) throw new Error(`State '${current}' is not defined`);
  const { on = {} } = stateDef;
  if (!Object.prototype.hasOwnProperty.call(on, event)) throw new Error(`No transition defined for event '${event}' in state '${current}'`);
  const target = on[event];
  if (typeof target !== 'string') throw new Error(`Transition target must be a string, got ${typeof target}`);
  if (!Object.prototype.hasOwnProperty.call(config.states, target)) throw new Error(`Target state '${target}' is not defined`);
  const previous = current;
  internals.state = target;
  for (const listener of listeners.slice()) {
    try { listener({ event, from: previous, to: target }); } catch (_) {}
  }
  return target;
}
function getCurrentState(machine) {
  const internals = machines.get(machine);
  if (!internals) throw new Error("Invalid state machine");
  return internals.state;
}
function subscribe(machine, listener) {
  const internals = machines.get(machine);
  if (!internals) throw new Error("Invalid state machine");
  if (typeof listener !== 'function') throw new Error("Listener must be a function");
  const { listeners } = internals;
  listeners.push(listener);
  let active = true;
  return function unsubscribe() {
    if (!active) return;
    active = false;
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}
export { createStateMachine, transition, getCurrentState, subscribe };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createStateMachine, transition, getCurrentState, subscribe };
}