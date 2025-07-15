function validateTurn(battleState, action) {
  const errors = [];

  // Check required fields
  if (!action || typeof action !== 'object') {
    errors.push('Action must be an object');
    return errors;
  }
  const { playerId, unitId, type } = action;
  if (playerId == null) errors.push('Missing playerId');
  if (unitId == null) errors.push('Missing unitId');
  if (!type) errors.push('Missing action type');
  if (errors.length) return errors;

  // Check turn ownership
  if (battleState.currentPlayer !== playerId) {
    return [`It's not player ${playerId}'s turn`];
  }

  // Find acting unit
  const unit = battleState.units.find(u => u.id === unitId);
  if (!unit) {
    return [`Unit ${unitId} does not exist`];
  }
  if (unit.playerId !== playerId) {
    errors.push(`Unit ${unitId} does not belong to player ${playerId}`);
  }
  if (unit.hasActed) {
    errors.push(`Unit ${unitId} has already acted this turn`);
  }

  // Action-specific validations
  if (type === 'move') {
    const { targetPosition } = action;
    if (
      !targetPosition ||
      typeof targetPosition.x !== 'number' ||
      typeof targetPosition.y !== 'number'
    ) {
      errors.push('Invalid or missing targetPosition for move');
    } else {
      const dx = targetPosition.x - unit.position.x;
      const dy = targetPosition.y - unit.position.y;
      const distance = Math.hypot(dx, dy);
      if (distance > unit.movementRange) {
        errors.push(
          `Move distance ${distance.toFixed(2)} exceeds range ${unit.movementRange}`
        );
      }
      if (battleState.map) {
        const { width, height } = battleState.map;
        if (
          targetPosition.x < 0 ||
          targetPosition.x >= width ||
          targetPosition.y < 0 ||
          targetPosition.y >= height
        ) {
          errors.push('Target position out of map bounds');
        }
      }
    }
  } else if (type === 'attack') {
    const { targetId } = action;
    if (targetId == null) {
      errors.push('Missing targetId for attack');
    } else {
      const target = battleState.units.find(u => u.id === targetId);
      if (!target) {
        errors.push(`Target unit ${targetId} does not exist`);
      } else if (target.playerId === playerId) {
        errors.push('Cannot attack friendly unit');
      } else {
        const dx = target.position.x - unit.position.x;
        const dy = target.position.y - unit.position.y;
        const distance = Math.hypot(dx, dy);
        if (distance > unit.attackRange) {
          errors.push(
            `Target out of range: distance ${distance.toFixed(2)}, range ${unit.attackRange}`
          );
        }
      }
    }
  } else {
    errors.push(`Unknown action type '${type}'`);
  }

  return errors;
}

function processTurn(battleState, action) {
  const errors = validateTurn(battleState, action);
  if (errors.length) {
    throw new Error('Invalid turn: ' + errors.join('; '));
  }

  // Deep clone state using structuredClone if available, otherwise JSON
  const newState = typeof structuredClone === 'function'
    ? structuredClone(battleState)
    : JSON.parse(JSON.stringify(battleState));

  // Initialize history if needed
  newState.history = Array.isArray(newState.history) ? newState.history : [];

  // Find acting unit in new state
  const unit = newState.units.find(u => u.id === action.unitId);

  // Apply action
  if (action.type === 'move') {
    unit.position = {
      x: action.targetPosition.x,
      y: action.targetPosition.y
    };
  } else if (action.type === 'attack') {
    const target = newState.units.find(u => u.id === action.targetId);
    target.hp -= unit.attackDamage;
    if (target.hp <= 0) {
      newState.units = newState.units.filter(u => u.id !== target.id);
    }
  }

  // Mark unit has acted
  unit.hasActed = true;

  // Record action history
  newState.history.push({
    turn: (newState.turnCount || 0) + 1,
    playerId: action.playerId,
    unitId: action.unitId,
    type: action.type,
    timestamp: Date.now(),
    details: action
  });

  // Check for game end: only one or zero players remain
  const remainingPlayers = Array.from(new Set(newState.units.map(u => u.playerId)));
  if (remainingPlayers.length <= 1) {
    newState.gameOver = true;
    newState.winner = remainingPlayers[0] || null;
    return newState;
  }

  // Advance turn if all units have acted for current player
  const remainingUnits = newState.units.filter(
    u => u.playerId === newState.currentPlayer && !u.hasActed
  );
  if (remainingUnits.length === 0) {
    // Reset hasActed flags for next round
    newState.units.forEach(u => {
      if (u.playerId === newState.currentPlayer) {
        u.hasActed = false;
      }
    });
    // Switch player
    const players = remainingPlayers;
    const idx = players.indexOf(newState.currentPlayer);
    newState.currentPlayer = players[(idx + 1) % players.length];
    newState.turnCount = (newState.turnCount || 0) + 1;
  }

  return newState;
}

export { validateTurn, processTurn };
if (typeof module !== 'undefined') {
  module.exports = { validateTurn, processTurn };
}