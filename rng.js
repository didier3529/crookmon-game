let _state = new Uint32Array(4);

function splitmix32(seed) {
  let z = seed >>> 0;
  z = (z + 0x9e3779b9) >>> 0;
  z = Math.imul(z ^ (z >>> 16), 0x85ebca6b) >>> 0;
  z = Math.imul(z ^ (z >>> 13), 0xc2b2ae35) >>> 0;
  return (z ^ (z >>> 16)) >>> 0;
}

function rotl(x, k) {
  return ((x << k) | (x >>> (32 - k))) >>> 0;
}

export function setSeed(seed) {
  let s = seed >>> 0;
  for (let i = 0; i < 4; i++) {
    s = splitmix32(s);
    _state[i] = s;
  }
}

export function getState() {
  return Array.from(_state);
}

export function setState(state) {
  if (!Array.isArray(state) || state.length !== 4) {
    throw new Error('setState: state must be an array of 4 uint32 values');
  }
  for (let i = 0; i < 4; i++) {
    const v = state[i];
    if (!Number.isInteger(v) || v < 0 || v > 0xFFFFFFFF) {
      throw new Error('setState: state[' + i + '] must be a uint32 value');
    }
    _state[i] = v >>> 0;
  }
}

export function nextUint32() {
  const s0 = _state[0],
        s1 = _state[1],
        s2 = _state[2],
        s3 = _state[3];
  const result = rotl(Math.imul(s1, 5), 7);
  const t = (s1 << 9) >>> 0;
  _state[2] = s2 ^ s0;
  _state[3] = s3 ^ s1;
  _state[1] = s1 ^ _state[2];
  _state[0] = s0 ^ _state[3];
  _state[2] ^= t;
  _state[3] = rotl(_state[3], 11);
  return result >>> 0;
}

export function random() {
  return nextUint32() / 4294967296;
}

export function randomInt(min, max) {
  if (!Number.isInteger(min) || !Number.isInteger(max)) {
    throw new Error('randomInt: min and max must be integers');
  }
  if (max < min) {
    throw new Error('randomInt: max must be >= min');
  }
  const range = max - min + 1;
  const uRange = range >>> 0;
  if (uRange === 0) {
    throw new Error('randomInt: range must be between 1 and 2^32 inclusive');
  }
  const threshold = 4294967296 - (4294967296 % uRange);
  let r;
  do {
    r = nextUint32();
  } while (r >= threshold);
  return min + (r % uRange);
}

const rng = { setSeed, random, randomInt, getState, setState };

export default rng;

if (typeof module !== 'undefined' && module.exports) {
  module.exports = rng;
}