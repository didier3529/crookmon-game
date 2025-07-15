export function processTurn(battleState, action) {
  const state = deepClone(battleState);
  validateAction(state, action);
  const player = state.players.find(p => p.id === action.playerId);
  const opponents = state.players.filter(p => p.id !== action.playerId);
  if (opponents.length !== 1) throw new Error(`Unsupported number of opponents: expected exactly one opponent, found ${opponents.length}`);
  const opponent = opponents[0];
  switch (action.type) {
    case 'attack':
      processAttack(state, player, opponent, action);
      break;
    case 'switch':
      processSwitch(state, player, action);
      break;
    case 'item':
      processItem(state, player, action);
      break;
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
  processEndOfTurn(state);
  state.turn = (state.turn || 0) + 1;
  state.currentPlayerId = opponent.id;
  return state;
}

export function validateAction(state, action) {
  if (!state.players || !Array.isArray(state.players)) throw new Error('Invalid battle state: missing players');
  const player = state.players.find(p => p.id === action.playerId);
  if (!player) throw new Error('Invalid action: player not found');
  if (state.currentPlayerId && state.currentPlayerId !== action.playerId) throw new Error('Not player turn');
  const opponents = state.players.filter(p => p.id !== action.playerId);
  if (opponents.length !== 1) throw new Error(`Unsupported number of opponents: expected exactly one opponent, found ${opponents.length}`);
  switch (action.type) {
    case 'attack': {
      const move = player.active.moves.find(m => m.id === action.moveId);
      if (!move) throw new Error('Invalid move');
      if (move.pp <= 0) throw new Error('Move has no PP');
      const targetPlayer = opponents[0];
      if (!targetPlayer.active || targetPlayer.active.hp <= 0) throw new Error('No valid target');
      break;
    }
    case 'switch': {
      if (player.active.hp <= 0) throw new Error('Active is fainted');
      const idx = action.switchInIndex;
      if (typeof idx !== 'number' || !Number.isInteger(idx) || idx < 0 || idx >= player.bench.length) throw new Error('Invalid switch index');
      if (!player.bench[idx]) throw new Error('Invalid switch index');
      if (player.bench[idx].hp <= 0) throw new Error('Cannot switch to fainted Pok?mon');
      break;
    }
    case 'item': {
      const itemIndex = player.items.findIndex(i => i.id === action.itemId);
      if (itemIndex < 0) throw new Error('Item not found');
      if (action.target === 'bench') {
        const bi = action.benchIndex;
        if (typeof bi !== 'number' || !Number.isInteger(bi) || bi < 0 || bi >= player.bench.length) {
          throw new Error('Invalid benchIndex for item target');
        }
      }
      const target = action.target === 'active'
        ? player.active
        : player.bench[action.benchIndex];
      if (!target) throw new Error('Invalid item target');
      break;
    }
    default:
      throw new Error('Invalid action type');
  }
}

function processAttack(state, player, opponent, action) {
  const attacker = player.active;
  const defender = opponent.active;
  const move = attacker.moves.find(m => m.id === action.moveId);
  move.pp--;
  const damage = calculateDamage(attacker, defender, move);
  defender.hp = Math.max(0, defender.hp - damage);
  if (defender.hp === 0) defender.status = 'fainted';
  if (opponent.active.hp === 0 && opponent.bench.every(p => p.hp === 0)) {
    state.winner = player.id;
  }
}

function processSwitch(state, player, action) {
  const oldActive = player.active;
  const newActive = player.bench[action.switchInIndex];
  player.active = newActive;
  player.bench[action.switchInIndex] = oldActive;
}

function processItem(state, player, action) {
  const itemIndex = player.items.findIndex(i => i.id === action.itemId);
  const item = player.items[itemIndex];
  const target = action.target === 'active'
    ? player.active
    : player.bench[action.benchIndex];
  if (item.effect.heal) {
    target.hp = Math.min(target.maxHp, target.hp + item.effect.heal);
  }
  if (item.effect.cureStatus && target.status === item.effect.cureStatus) {
    target.status = null;
  }
  if (item.effect.boost) {
    Object.keys(item.effect.boost).forEach(stat => {
      target.stats[stat] = (target.stats[stat] || 0) + item.effect.boost[stat];
    });
  }
  player.items.splice(itemIndex, 1);
}

function processEndOfTurn(state) {
  state.players.forEach(player => {
    [player.active, ...player.bench].forEach(pokemon => {
      if (pokemon.status) applyStatusEffects(pokemon);
    });
  });
}

function calculateDamage(attacker, defender, move) {
  const level = attacker.level || 50;
  const power = move.power || 0;
  const attack = attacker.stats.attack || 1;
  const defense = defender.stats.defense || 1;
  const base = Math.floor(((2 * level / 5 + 2) * power * attack / defense) / 50) + 2;
  const modifier = (Math.random() * (1 - 0.85) + 0.85);
  return Math.max(1, Math.floor(base * modifier));
}

function applyStatusEffects(pokemon) {
  switch (pokemon.status) {
    case 'poison':
      pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 8));
      break;
    case 'burn':
      pokemon.hp = Math.max(0, pokemon.hp - Math.floor(pokemon.maxHp / 16));
      break;
  }
  if (pokemon.hp === 0) pokemon.status = 'fainted';
}

function deepClone(obj) {
  if (typeof structuredClone === 'function') {
    return structuredClone(obj);
  }
  return JSON.parse(JSON.stringify(obj));
}