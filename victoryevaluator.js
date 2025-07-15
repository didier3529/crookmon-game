const ALLOWED_STATUSES = new Set(['ongoing', 'win', 'draw']);

export function checkVictoryConditions(battleState) {
  const players = Array.isArray(battleState.players) ? battleState.players : [];
  if (players.length === 0) {
    return { status: 'draw', winnerId: null };
  }

  // Custom victory handler
  if (battleState.options && typeof battleState.options.customVictory === 'function') {
    const customResult = battleState.options.customVictory(battleState);
    if (customResult && typeof customResult.status === 'string') {
      if (!ALLOWED_STATUSES.has(customResult.status)) {
        throw new Error(`Invalid custom victory status: ${customResult.status}`);
      }
      return {
        status: customResult.status,
        winnerId: customResult.winnerId != null ? customResult.winnerId : null
      };
    }
  }

  // Identify players with surviving units
  const activePlayers = players.filter(player => {
    const units = Array.isArray(player.units) ? player.units : [];
    return units.some(unit => unit.hp > 0);
  });

  // If no players have surviving units, it's a draw
  if (activePlayers.length === 0) {
    return { status: 'draw', winnerId: null };
  }

  // If only one player has surviving units, they win
  if (activePlayers.length === 1) {
    return { status: 'win', winnerId: activePlayers[0].id };
  }

  // Check round limit tie-breaker (trigger only when currentRound exceeds maxRounds)
  const maxRounds = typeof battleState.maxRounds === 'number' ? battleState.maxRounds : null;
  const currentRound = typeof battleState.currentRound === 'number' ? battleState.currentRound : null;
  if (maxRounds !== null && currentRound !== null && currentRound > maxRounds) {
    const counts = players.map(player => {
      const units = Array.isArray(player.units) ? player.units : [];
      const aliveCount = units.reduce((sum, u) => sum + (u.hp > 0 ? 1 : 0), 0);
      return { id: player.id, count: aliveCount };
    });
    counts.sort((a, b) => b.count - a.count);
    if (counts.length >= 2 && counts[0].count === counts[1].count) {
      return { status: 'draw', winnerId: null };
    }
    return { status: 'win', winnerId: counts[0].id };
  }

  // Battle continues
  return { status: 'ongoing', winnerId: null };
}

export function evaluateVictory(battleState) {
  return checkVictoryConditions(battleState);
}

export default evaluateVictory;