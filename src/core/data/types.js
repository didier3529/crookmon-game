// Type effectiveness chart based on Pokemon mechanics
// Values: 2.0 = super effective, 0.5 = not very effective, 0.0 = no effect, 1.0 = normal (default)
export const TYPE_CHART = {
  normal: {
    rock: 0.5,
    ghost: 0.0,
    steel: 0.5,
  },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2.0,
    ice: 2.0,
    bug: 2.0,
    rock: 0.5,
    dragon: 0.5,
    steel: 2.0,
  },
  water: {
    fire: 2.0,
    water: 0.5,
    grass: 0.5,
    ground: 2.0,
    rock: 2.0,
    dragon: 0.5,
  },
  electric: {
    water: 2.0,
    electric: 0.5,
    grass: 0.5,
    ground: 0.0,
    flying: 2.0,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2.0,
    grass: 0.5,
    poison: 0.5,
    ground: 2.0,
    flying: 0.5,
    bug: 0.5,
    rock: 2.0,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2.0,
    ice: 0.5,
    ground: 2.0,
    flying: 2.0,
    dragon: 2.0,
    steel: 0.5,
  },
  fighting: {
    normal: 2.0,
    ice: 2.0,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2.0,
    ghost: 0.0,
    dark: 2.0,
    steel: 2.0,
    fairy: 0.5,
  },
  poison: {
    grass: 2.0,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0.0,
    fairy: 2.0,
  },
  ground: {
    fire: 2.0,
    electric: 2.0,
    grass: 0.5,
    poison: 2.0,
    flying: 0.0,
    bug: 0.5,
    rock: 2.0,
    steel: 2.0,
  },
  flying: {
    electric: 0.5,
    grass: 2.0,
    fighting: 2.0,
    bug: 2.0,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: {
    fighting: 2.0,
    poison: 2.0,
    psychic: 0.5,
    dark: 0.0,
    steel: 0.5,
  },
  bug: {
    fire: 0.5,
    grass: 2.0,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2.0,
    ghost: 0.5,
    dark: 2.0,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2.0,
    ice: 2.0,
    fighting: 0.5,
    ground: 0.5,
    flying: 2.0,
    bug: 2.0,
    steel: 0.5,
  },
  ghost: {
    normal: 0.0,
    fighting: 0.0,
    psychic: 2.0,
    ghost: 2.0,
    dark: 0.5,
  },
  dragon: {
    dragon: 2.0,
    steel: 0.5,
    fairy: 0.0,
  },
  dark: {
    fighting: 0.5,
    psychic: 2.0,
    ghost: 2.0,
    dark: 0.5,
    fairy: 0.5,
  },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2.0,
    rock: 2.0,
    steel: 0.5,
    fairy: 2.0,
  },
  fairy: {
    fire: 0.5,
    fighting: 2.0,
    poison: 0.5,
    dragon: 2.0,
    dark: 2.0,
    steel: 0.5,
  },
};

/**
 * Calculate type effectiveness multiplier for an attack
 * @param {string} attackType - The type of the attacking move
 * @param {string|string[]} defenderTypes - The type(s) of the defending Pokemon
 * @returns {number} - Effectiveness multiplier (0.0, 0.5, 1.0, 2.0, or 4.0)
 */
export function getTypeEffectiveness(attackType, defenderTypes = []) {
  if (!attackType) return 1.0;

  // Normalize inputs
  const normalizedAttackType = attackType.toLowerCase();
  const defTypes = Array.isArray(defenderTypes)
    ? defenderTypes.map((t) => t.toLowerCase())
    : [defenderTypes.toLowerCase()];

  let effectiveness = 1.0;
  const attackChart = TYPE_CHART[normalizedAttackType] || {};

  // Calculate effectiveness against each defender type
  for (const defType of defTypes) {
    const multiplier = attackChart[defType];
    if (multiplier !== undefined) {
      effectiveness *= multiplier;
    }
  }

  return effectiveness;
}

/**
 * Get all super effective types against a given defender type
 * @param {string|string[]} defenderTypes - The type(s) to check against
 * @returns {string[]} - Array of types that are super effective
 */
export function getSuperEffectiveTypes(defenderTypes) {
  const defTypes = Array.isArray(defenderTypes)
    ? defenderTypes.map((t) => t.toLowerCase())
    : [defenderTypes.toLowerCase()];

  const superEffective = [];

  for (const [attackType, chart] of Object.entries(TYPE_CHART)) {
    let effectiveness = 1.0;
    for (const defType of defTypes) {
      const multiplier = chart[defType];
      if (multiplier !== undefined) {
        effectiveness *= multiplier;
      }
    }
    if (effectiveness > 1.0) {
      superEffective.push(attackType);
    }
  }

  return superEffective;
}

/**
 * Get all types that resist a given attack type
 * @param {string} attackType - The attacking type
 * @returns {string[]} - Array of types that resist the attack
 */
export function getResistingTypes(attackType) {
  if (!attackType) return [];

  const normalizedAttackType = attackType.toLowerCase();
  const chart = TYPE_CHART[normalizedAttackType] || {};

  return Object.entries(chart)
    .filter(([_, multiplier]) => multiplier < 1.0)
    .map(([type, _]) => type);
}

/**
 * Check if a type combination has any weaknesses
 * @param {string|string[]} types - The type(s) to check
 * @returns {object} - Object with weakness information
 */
export function getTypeWeaknesses(types) {
  const typeList = Array.isArray(types) ? types : [types];
  const weaknesses = {};

  for (const [attackType, chart] of Object.entries(TYPE_CHART)) {
    const effectiveness = getTypeEffectiveness(attackType, typeList);
    if (effectiveness > 1.0) {
      weaknesses[attackType] = effectiveness;
    }
  }

  return weaknesses;
}

export default {
  TYPE_CHART,
  getTypeEffectiveness,
  getSuperEffectiveTypes,
  getResistingTypes,
  getTypeWeaknesses,
};
