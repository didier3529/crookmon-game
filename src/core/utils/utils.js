function deepClone(value, seen = new WeakMap()) {
  if (value === null || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value.getTime());
  if (value instanceof RegExp) return new RegExp(value.source, value.flags);
  if (value instanceof Map) {
    const result = new Map();
    seen.set(value, result);
    for (const [k, v] of value) {
      result.set(deepClone(k, seen), deepClone(v, seen));
    }
    return result;
  }
  if (value instanceof Set) {
    const result = new Set();
    seen.set(value, result);
    for (const v of value) {
      result.add(deepClone(v, seen));
    }
    return result;
  }
  if (Array.isArray(value)) {
    const result = [];
    seen.set(value, result);
    for (let i = 0; i < value.length; i++) {
      result[i] = deepClone(value[i], seen);
    }
    return result;
  }
  const proto = Object.getPrototypeOf(value);
  const result = Object.create(proto);
  seen.set(value, result);
  const keys = Object.getOwnPropertyNames(value);
  const symbols = Object.getOwnPropertySymbols(value);
  for (const key of [...keys, ...symbols]) {
    const desc = Object.getOwnPropertyDescriptor(value, key);
    if ('value' in desc) {
      desc.value = deepClone(desc.value, seen);
    }
    Object.defineProperty(result, key, desc);
  }
  return result;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function merge(...configs) {
  const result = {};
  for (const config of configs) {
    if (!isObject(config)) continue;
    const keys = Object.getOwnPropertyNames(config);
    const symbols = Object.getOwnPropertySymbols(config);
    for (const key of [...keys, ...symbols]) {
      const val = config[key];
      if (Array.isArray(val) && Array.isArray(result[key])) {
        const clonedNew = deepClone(val);
        result[key] = result[key].concat(clonedNew);
      } else if (isObject(val)) {
        if (isObject(result[key])) {
          result[key] = merge(result[key], val);
        } else {
          result[key] = deepClone(val);
        }
      } else {
        result[key] = deepClone(val);
      }
    }
  }
  return result;
}

function randomChoice(array) {
  if (!Array.isArray(array) || array.length === 0) return undefined;
  const index = Math.floor(Math.random() * array.length);
  return array[index];
}

export { deepClone, isObject, merge, randomChoice };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { deepClone, isObject, merge, randomChoice };
}