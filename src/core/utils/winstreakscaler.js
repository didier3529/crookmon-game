function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

/**
 * Calculates a win streak multiplier based on the current streak.
 *
 * The multiplier starts at 1 for zero or negative streaks. For positive streaks,
 * it is computed as 1 + 0.1 * sqrt(floor(currentStreak)), and then clamped between 1 and 2.
 *
 * @param {number} currentStreak - The current number of consecutive wins.
 * @returns {number} A multiplier value between 1 (inclusive) and 2 (inclusive).
 */
export function getWinStreakMultiplier(currentStreak) {
  const streak = Number.isFinite(currentStreak) ? Math.floor(currentStreak) : 0;
  if (streak <= 0) return 1;
  const bonus = Math.sqrt(streak) * 0.1;
  return clamp(1 + bonus, 1, 2);
}