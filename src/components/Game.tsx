import { useCallback, useState } from 'react';

// Sample game data
const SAMPLE_CARDS = [
  {
    id: '1',
    name: 'Fire Dragon',
    attack: 8,
    defense: 6,
    cost: 5,
    imageUrl: '🐉',
  },
  {
    id: '2',
    name: 'Water Elemental',
    attack: 6,
    defense: 8,
    cost: 4,
    imageUrl: '🌊',
  },
  {
    id: '3',
    name: 'Lightning Wolf',
    attack: 7,
    defense: 5,
    cost: 4,
    imageUrl: '⚡',
  },
  {
    id: '4',
    name: 'Earth Golem',
    attack: 5,
    defense: 9,
    cost: 5,
    imageUrl: '🗿',
  },
  {
    id: '5',
    name: 'Wind Spirit',
    attack: 9,
    defense: 4,
    cost: 5,
    imageUrl: '💨',
  },
  {
    id: '6',
    name: 'Shadow Assassin',
    attack: 10,
    defense: 3,
    cost: 6,
    imageUrl: '🥷',
  },
];

interface Card {
  id: string;
  name: string;
  attack: number;
  defense: number;
  cost: number;
  imageUrl: string;
}

interface Player {
  name: string;
  health: number;
  selectedCard: Card | null;
}

export default function Game() {
  const [gameState, setGameState] = useState<
    'cardSelect' | 'battle' | 'result'
  >('cardSelect');
  const [player, setPlayer] = useState<Player>({
    name: 'Player',
    health: 20,
    selectedCard: null,
  });
  const [opponent, setOpponent] = useState<Player>({
    name: 'AI Opponent',
    health: 20,
    selectedCard: null,
  });
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);

  const selectCard = useCallback((card: Card) => {
    setPlayer((prev) => ({ ...prev, selectedCard: card }));

    // AI selects a random card
    const aiCard =
      SAMPLE_CARDS[Math.floor(Math.random() * SAMPLE_CARDS.length)];
    setOpponent((prev) => ({ ...prev, selectedCard: aiCard }));

    setGameState('battle');
  }, []);

  const battle = useCallback(() => {
    if (!player.selectedCard || !opponent.selectedCard) return;

    const playerDamage = Math.max(
      1,
      player.selectedCard.attack - opponent.selectedCard.defense
    );
    const opponentDamage = Math.max(
      1,
      opponent.selectedCard.attack - player.selectedCard.defense
    );

    const newPlayerHealth = player.health - opponentDamage;
    const newOpponentHealth = opponent.health - playerDamage;

    setPlayer((prev) => ({ ...prev, health: Math.max(0, newPlayerHealth) }));
    setOpponent((prev) => ({
      ...prev,
      health: Math.max(0, newOpponentHealth),
    }));

    setBattleLog((prev) => [
      ...prev,
      `${player.selectedCard!.name} attacks for ${playerDamage} damage!`,
      `${opponent.selectedCard!.name} attacks for ${opponentDamage} damage!`,
    ]);

    if (newPlayerHealth <= 0) {
      setWinner('AI Opponent');
      setGameState('result');
    } else if (newOpponentHealth <= 0) {
      setWinner('Player');
      setGameState('result');
    } else {
      setGameState('cardSelect');
    }
  }, [player, opponent]);

  const resetGame = useCallback(() => {
    setPlayer({ name: 'Player', health: 20, selectedCard: null });
    setOpponent({ name: 'AI Opponent', health: 20, selectedCard: null });
    setBattleLog([]);
    setWinner(null);
    setGameState('cardSelect');
  }, []);

  const renderCard = (card: Card, onClick?: () => void) => (
    <div
      key={card.id}
      className="game-card"
      onClick={onClick}
      style={{
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '15px',
        margin: '5px',
        background: 'white',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: onClick
          ? '0 4px 8px rgba(0,0,0,0.2)'
          : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.2s',
        minWidth: '120px',
        textAlign: 'center' as const,
      }}
    >
      <div style={{ fontSize: '40px', marginBottom: '10px' }}>
        {card.imageUrl}
      </div>
      <h4 style={{ margin: '5px 0', fontSize: '14px' }}>{card.name}</h4>
      <div style={{ fontSize: '12px', color: '#666' }}>
        <div>⚔️ Attack: {card.attack}</div>
        <div>🛡️ Defense: {card.defense}</div>
        <div>💎 Cost: {card.cost}</div>
      </div>
    </div>
  );

  if (gameState === 'cardSelect') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' as const }}>
        <h2>🎮 Crookmon Card Battle</h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '30px',
          }}
        >
          <div>
            <h3>Player Health: ❤️ {player.health}</h3>
          </div>
          <div>
            <h3>AI Health: ❤️ {opponent.health}</h3>
          </div>
        </div>

        <h3>Choose Your Card:</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap' as const,
            justifyContent: 'center',
            gap: '10px',
            margin: '20px 0',
          }}
        >
          {SAMPLE_CARDS.map((card) => renderCard(card, () => selectCard(card)))}
        </div>

        {battleLog.length > 0 && (
          <div
            style={{
              background: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              margin: '20px 0',
              maxHeight: '150px',
              overflowY: 'auto' as const,
            }}
          >
            <h4>Battle Log:</h4>
            {battleLog.map((log, index) => (
              <div key={index} style={{ margin: '5px 0', fontSize: '14px' }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (gameState === 'battle') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' as const }}>
        <h2>⚔️ Battle Phase</h2>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            margin: '30px 0',
          }}
        >
          <div>
            <h3>Your Card:</h3>
            {player.selectedCard && renderCard(player.selectedCard)}
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', fontSize: '30px' }}
          >
            VS
          </div>
          <div>
            <h3>AI Card:</h3>
            {opponent.selectedCard && renderCard(opponent.selectedCard)}
          </div>
        </div>

        <button
          className="btn"
          onClick={battle}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            background: '#dc3545',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
          }}
        >
          ⚔️ BATTLE!
        </button>
      </div>
    );
  }

  if (gameState === 'result') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' as const }}>
        <h2>🏆 Game Over!</h2>
        <h3
          style={{
            color: winner === 'Player' ? '#28a745' : '#dc3545',
            fontSize: '24px',
            margin: '30px 0',
          }}
        >
          {winner === 'Player' ? '🎉 You Win!' : '💀 You Lose!'}
        </h3>

        <div style={{ margin: '20px 0' }}>
          <div>Final Health - Player: ❤️ {player.health}</div>
          <div>Final Health - AI: ❤️ {opponent.health}</div>
        </div>

        <button
          className="btn"
          onClick={resetGame}
          style={{
            padding: '15px 30px',
            fontSize: '18px',
            margin: '20px 0',
          }}
        >
          🔄 Play Again
        </button>

        {battleLog.length > 0 && (
          <div
            style={{
              background: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '15px',
              margin: '20px 0',
              maxHeight: '200px',
              overflowY: 'auto' as const,
            }}
          >
            <h4>Complete Battle Log:</h4>
            {battleLog.map((log, index) => (
              <div key={index} style={{ margin: '5px 0', fontSize: '14px' }}>
                {log}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
}
