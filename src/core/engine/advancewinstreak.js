export function advanceWinStreak(player, victory) {
  if (player == null || typeof player !== 'object') {
    throw new TypeError('player must be a non-null object');
  }
  if (typeof victory !== 'boolean') {
    throw new TypeError('victory must be a boolean');
  }
  const current = Number.isFinite(player.winStreak) && player.winStreak >= 0
    ? player.winStreak
    : 0;
  const newStreak = victory ? current + 1 : 0;
  player.winStreak = newStreak;
  return newStreak;
}

/**
 * Resets a player's win streak to zero.
 *
 * @param {object} player - The player object to update.
 * @returns {number} The reset win streak (always 0).
 * @throws {TypeError} If player is not an object.
 */
export function resetWinStreak(player) {
  if (player == null || typeof player !== 'object') {
    throw new TypeError('player must be a non-null object');
  }
  player.winStreak = 0;
  return 0;
}