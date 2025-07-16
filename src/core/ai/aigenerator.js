export function generateAIMove(battleState, options = {}) {
  return selectBestAIMove(battleState, options);
}

export function selectBestAIMove(battleState, { randomize = false } = {}) {
  const moves = typeof battleState.getAvailableMoves === 'function'
    ? battleState.getAvailableMoves()
    : [];
  if (!moves || moves.length === 0) return null;

  let bestMoves = [];
  let bestScore = -Infinity;

  for (const move of moves) {
    const simulated = typeof battleState.simulateMove === 'function'
      ? battleState.simulateMove(move)
      : battleState;
    const score = evaluateBattleState(simulated);
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }

  if (bestMoves.length === 0) return null;
  if (randomize) {
    const idx = Math.floor(Math.random() * bestMoves.length);
    return bestMoves[idx];
  }
  return bestMoves[0];
}

function evaluateBattleState(state) {
  if (typeof state.isTerminal === 'function' && state.isTerminal()) {
    const winner = typeof state.getWinner === 'function' ? state.getWinner() : null;
    if (winner === state.aiPlayerId || winner === state.aiId || winner === 'ai') return Infinity;
    if (winner === state.humanPlayerId || winner === state.humanId || winner === 'human') return -Infinity;
    return 0;
  }

  const players = Array.isArray(state.players) ? state.players : [];
  const aiId = state.aiPlayerId || state.aiId;
  const humanId = state.humanPlayerId || state.humanId;

  const aiTeam = players.find(p => p.id === aiId) || {};
  const oppTeam = players.find(p => p.id === humanId)
    || players.find(p => p.type === 'human')
    || players.find(p => p.id !== aiId)
    || {};

  const sumHp = team => {
    if (!Array.isArray(team.pokemon)) return 0;
    return team.pokemon.reduce((sum, p) => sum + (p.currentHp || 0), 0);
  };
  const hpDiff = sumHp(aiTeam) - sumHp(oppTeam);

  const statusWeights = {
    paralyzed: -10,
    asleep: -15,
    frozen: -10,
    poison: -5,
    burned: -5,
    stunned: -8
  };
  const statusScore = team => {
    if (!Array.isArray(team.pokemon)) return 0;
    return team.pokemon.reduce((sum, p) => {
      if (p.status && statusWeights[p.status]) {
        return sum + statusWeights[p.status];
      }
      return sum;
    }, 0);
  };
  const statusDiff = statusScore(aiTeam) - statusScore(oppTeam);

  const cooldownScore = team => {
    if (!Array.isArray(team.pokemon)) return 0;
    return team.pokemon.reduce((sum, p) => {
      if (Array.isArray(p.moveCooldowns)) {
        const totalCd = p.moveCooldowns.reduce((c, cd) => c + (cd || 0), 0);
        return sum - totalCd;
      }
      return sum;
    }, 0);
  };
  const cooldownDiff = cooldownScore(aiTeam) - cooldownScore(oppTeam);

  // Additional factors (type advantages, buffs, debuffs) can be added here when available
  return hpDiff + statusDiff + cooldownDiff;
}