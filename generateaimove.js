function cloneState(state) {
  if (typeof state.clone === 'function') {
    return state.clone();
  }
  throw new Error('State object must implement clone() method for AI move generation');
}

function getLegalMoves(state, player) {
  if (typeof state.getLegalMoves === 'function') {
    return state.getLegalMoves(player) || [];
  }
  if (state.legalMoves && state.legalMoves[player]) {
    return state.legalMoves[player];
  }
  throw new Error('Unable to retrieve legal moves for player ' + player);
}

function isTerminal(state) {
  if (typeof state.isOver === 'function') {
    return state.isOver();
  }
  if (typeof state.getWinner === 'function') {
    return state.getWinner() != null;
  }
  if (state.winner != null) {
    return true;
  }
  return false;
}

function getStateHash(state) {
  if (typeof state.hash === 'function') {
    return state.hash();
  }
  try {
    return JSON.stringify(state);
  } catch (_) {
    return String(state);
  }
}

function generateAIMove(battleState, options = {}) {
  const maxDepth = typeof options.maxDepth === 'number' && options.maxDepth > 0 ? options.maxDepth : 1;
  const random = typeof options.random === 'function' ? options.random : Math.random;
  const aiPlayer = options.player != null ? options.player : battleState.activePlayer;
  const moves = getLegalMoves(battleState, aiPlayer);
  if (moves.length === 0) return null;

  // Shuffle moves for improved pruning diversity
  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [moves[i], moves[j]] = [moves[j], moves[i]];
  }

  const cache = new Map();

  function evaluateState(state) {
    if (isTerminal(state)) {
      const winner = typeof state.getWinner === 'function' ? state.getWinner() : state.winner;
      if (winner === aiPlayer) return Infinity;
      if (winner != null && winner !== aiPlayer) return -Infinity;
      return 0;
    }
    let aiSum = 0;
    let oppSum = 0;
    const players = state.players || {};
    for (const id of Object.keys(players)) {
      const p = players[id];
      if (!p.pokemon) continue;
      const hp = (p.pokemon.hp || 0) / (p.pokemon.maxHp || 1);
      if (id === aiPlayer) aiSum += hp;
      else oppSum += hp;
    }
    return aiSum - oppSum;
  }

  function minimax(state, depth, alpha, beta) {
    const key = getStateHash(state) + '|' + depth;
    if (cache.has(key)) {
      return cache.get(key);
    }
    let result;
    if (depth <= 0 || isTerminal(state)) {
      result = evaluateState(state);
    } else {
      const current = state.activePlayer;
      const legal = getLegalMoves(state, current);
      if (legal.length === 0) {
        result = evaluateState(state);
      } else if (current === aiPlayer) {
        let maxEval = -Infinity;
        for (const move of legal) {
          const next = cloneState(state);
          if (typeof next.applyMove === 'function') {
            next.applyMove(move);
          } else {
            throw new Error('State missing applyMove method');
          }
          const val = minimax(next, depth - 1, alpha, beta);
          if (val > maxEval) maxEval = val;
          if (val > alpha) alpha = val;
          if (beta <= alpha) break;
        }
        result = maxEval;
      } else {
        let minEval = Infinity;
        for (const move of legal) {
          const next = cloneState(state);
          if (typeof next.applyMove === 'function') {
            next.applyMove(move);
          } else {
            throw new Error('State missing applyMove method');
          }
          const val = minimax(next, depth - 1, alpha, beta);
          if (val < minEval) minEval = val;
          if (val < beta) beta = val;
          if (beta <= alpha) break;
        }
        result = minEval;
      }
    }
    cache.set(key, result);
    return result;
  }

  let bestValue = -Infinity;
  let bestMoves = [];
  for (const move of moves) {
    const stateCopy = cloneState(battleState);
    if (typeof stateCopy.applyMove === 'function') {
      stateCopy.applyMove(move);
    } else {
      throw new Error('State missing applyMove method');
    }
    const value = minimax(stateCopy, maxDepth - 1, -Infinity, Infinity);
    if (value > bestValue) {
      bestValue = value;
      bestMoves = [move];
    } else if (value === bestValue) {
      bestMoves.push(move);
    }
  }
  return bestMoves[Math.floor(random() * bestMoves.length)];
}

export { generateAIMove };
export default generateAIMove;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = generateAIMove;
}