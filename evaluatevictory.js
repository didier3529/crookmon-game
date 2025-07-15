function getSides(battleState) {
  if (battleState.sides) return Array.isArray(battleState.sides) ? battleState.sides : Object.values(battleState.sides);
  if (battleState.teams) return Array.isArray(battleState.teams) ? battleState.teams : Object.values(battleState.teams);
  if (battleState.players) return Array.isArray(battleState.players) ? battleState.players : Object.values(battleState.players);
  throw new Error('evaluateVictory: unable to locate sides in battleState');
}

function countAliveUnits(side) {
  if (typeof side.getAliveCount === 'function') {
    return side.getAliveCount();
  }
  if (typeof side.getRemainingUnits === 'function') {
    return side.getRemainingUnits().length;
  }
  if (Array.isArray(side.units)) {
    return side.units.reduce((sum, unit) => sum + ((unit.hp != null ? unit.hp : unit.health) > 0 ? 1 : 0), 0);
  }
  if (typeof side.aliveCount === 'number') {
    return side.aliveCount;
  }
  throw new Error('evaluateVictory: unable to count alive units for side');
}

export function hasDraw(battleState) {
  const sides = getSides(battleState);
  if (sides.length !== 2) return false;
  const aliveCounts = sides.map(countAliveUnits);
  return aliveCounts[0] === 0 && aliveCounts[1] === 0;
}

export function hasVictory(battleState) {
  const sides = getSides(battleState);
  if (sides.length !== 2) return null;
  const [sideA, sideB] = sides;
  const aliveA = countAliveUnits(sideA);
  const aliveB = countAliveUnits(sideB);
  if (aliveA > 0 && aliveB === 0) return sideA.id != null ? sideA.id : 0;
  if (aliveB > 0 && aliveA === 0) return sideB.id != null ? sideB.id : 1;
  return null;
}

export default function evaluateVictory(battleState) {
  if (hasDraw(battleState)) {
    return { ended: true, isDraw: true, winner: null };
  }
  const winner = hasVictory(battleState);
  if (winner != null) {
    return { ended: true, isDraw: false, winner };
  }
  return { ended: false, isDraw: false, winner: null };
}