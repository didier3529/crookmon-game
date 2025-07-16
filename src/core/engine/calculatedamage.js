import { getTypeEffectiveness } from '../data/types.js';

export function getDamageModifiers(attacker, defender, move) {
  const critical = move.isCritical ? 2 : 1;
  // random percentage between 85 and 100 inclusive
  const randomPercent = Math.floor(Math.random() * 16) + 85;
  const randomMultiplier = randomPercent / 100;
  const stab =
    Array.isArray(attacker.types) && attacker.types.includes(move.type)
      ? 1.5
      : 1;
  const type = getTypeEffectiveness(
    move.type,
    Array.isArray(defender.types) ? defender.types : []
  );
  const other = 1;
  return {
    critical,
    random: randomMultiplier,
    stab,
    type,
    other,
  };
}

export function calculateDamage(attacker, defender, move) {
  const level =
    typeof attacker.level === 'number' && attacker.level > 0
      ? attacker.level
      : 1;
  const power =
    typeof move.power === 'number' && move.power >= 0 ? move.power : 0;
  const isPhysical = move.category === 'physical';
  const attackStat = isPhysical
    ? attacker.stats.attack
    : attacker.stats.spAttack;
  let defenseStat = isPhysical
    ? defender.stats.defense
    : defender.stats.spDefense;
  // guard against zero or negative defense
  defenseStat =
    typeof defenseStat === 'number' && defenseStat > 0 ? defenseStat : 1;
  const modifiers = getDamageModifiers(attacker, defender, move);
  const totalModifier = Object.values(modifiers).reduce(
    (acc, val) => acc * val,
    1
  );
  const base =
    (((2 * level) / 5 + 2) * power * (attackStat / defenseStat)) / 50 + 2;
  return Math.floor(base * totalModifier);
}
