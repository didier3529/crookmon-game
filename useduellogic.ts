export function useDuelLogic(
  initialPlayerDeck: Card[],
  initialOpponentDeck: Card[]
): {
  startDuel(): void
  playTurn(): DuelTurnResult
  resetDuel(): void
  outcome: DuelOutcome
} {
  const originalPlayerDeck = useRef<Card[]>([])
  const originalOpponentDeck = useRef<Card[]>([])
  const playerDeckRef = useRef<Card[]>([])
  const opponentDeckRef = useRef<Card[]>([])
  const outcomeRef = useRef<DuelOutcome>(DuelOutcome.ongoing)

  const [playerDeck, setPlayerDeck] = useState<Card[]>([])
  const [opponentDeck, setOpponentDeck] = useState<Card[]>([])
  const [outcome, setOutcome] = useState<DuelOutcome>(DuelOutcome.ongoing)

  useEffect(() => {
    playerDeckRef.current = playerDeck
  }, [playerDeck])

  useEffect(() => {
    opponentDeckRef.current = opponentDeck
  }, [opponentDeck])

  useEffect(() => {
    outcomeRef.current = outcome
  }, [outcome])

  const cloneDeck = useCallback((deck: Card[]): Card[] => {
    return deck.map(card => ({ ...card }))
  }, [])

  const startDuel = useCallback(() => {
    const pClone = cloneDeck(initialPlayerDeck)
    const oClone = cloneDeck(initialOpponentDeck)
    originalPlayerDeck.current = cloneDeck(initialPlayerDeck)
    originalOpponentDeck.current = cloneDeck(initialOpponentDeck)
    setPlayerDeck(pClone)
    setOpponentDeck(oClone)
    setOutcome(DuelOutcome.ongoing)
  }, [initialPlayerDeck, initialOpponentDeck, cloneDeck])

  const resetDuel = useCallback(() => {
    const pClone = cloneDeck(originalPlayerDeck.current)
    const oClone = cloneDeck(originalOpponentDeck.current)
    setPlayerDeck(pClone)
    setOpponentDeck(oClone)
    setOutcome(DuelOutcome.ongoing)
  }, [cloneDeck])

  const playTurn = useCallback((): DuelTurnResult => {
    const currentOutcome = outcomeRef.current
    const currentPlayerDeck = playerDeckRef.current
    const currentOpponentDeck = opponentDeckRef.current

    if (currentOutcome !== DuelOutcome.ongoing) {
      return {
        playerCard: null,
        opponentCard: null,
        playerDamage: 0,
        opponentDamage: 0,
        turnWinner: null,
        outcome: currentOutcome,
        remainingPlayerDeck: currentPlayerDeck,
        remainingOpponentDeck: currentOpponentDeck,
      }
    }

    if (currentPlayerDeck.length === 0 && currentOpponentDeck.length === 0) {
      setOutcome(DuelOutcome.draw)
      return {
        playerCard: null,
        opponentCard: null,
        playerDamage: 0,
        opponentDamage: 0,
        turnWinner: null,
        outcome: DuelOutcome.draw,
        remainingPlayerDeck: [],
        remainingOpponentDeck: [],
      }
    }

    if (currentPlayerDeck.length === 0) {
      setOutcome(DuelOutcome.opponentWon)
      return {
        playerCard: null,
        opponentCard: null,
        playerDamage: 0,
        opponentDamage: 0,
        turnWinner: null,
        outcome: DuelOutcome.opponentWon,
        remainingPlayerDeck: [],
        remainingOpponentDeck: currentOpponentDeck,
      }
    }

    if (currentOpponentDeck.length === 0) {
      setOutcome(DuelOutcome.playerWon)
      return {
        playerCard: null,
        opponentCard: null,
        playerDamage: 0,
        opponentDamage: 0,
        turnWinner: null,
        outcome: DuelOutcome.playerWon,
        remainingPlayerDeck: currentPlayerDeck,
        remainingOpponentDeck: [],
      }
    }

    const [playerHead, ...restPlayerRaw] = currentPlayerDeck
    const [opponentHead, ...restOpponentRaw] = currentOpponentDeck
    const playerCard = { ...playerHead }
    const opponentCard = { ...opponentHead }

    const playerDamage = Math.max(0, opponentCard.attack - playerCard.defense)
    const opponentDamage = Math.max(0, playerCard.attack - opponentCard.defense)
    playerCard.hp -= playerDamage
    opponentCard.hp -= opponentDamage

    let turnWinner: 'player' | 'opponent' | 'draw'
    if (playerCard.hp > 0 && opponentCard.hp <= 0) turnWinner = 'player'
    else if (opponentCard.hp > 0 && playerCard.hp <= 0) turnWinner = 'opponent'
    else turnWinner = 'draw'

    const newPlayerDeck: Card[] = [...restPlayerRaw]
    const newOpponentDeck: Card[] = [...restOpponentRaw]
    if (playerCard.hp > 0) newPlayerDeck.push(playerCard)
    if (opponentCard.hp > 0) newOpponentDeck.push(opponentCard)

    let newOutcome = DuelOutcome.ongoing
    if (newPlayerDeck.length === 0 && newOpponentDeck.length === 0) newOutcome = DuelOutcome.draw
    else if (newOpponentDeck.length === 0) newOutcome = DuelOutcome.playerWon
    else if (newPlayerDeck.length === 0) newOutcome = DuelOutcome.opponentWon

    setPlayerDeck(() => newPlayerDeck)
    setOpponentDeck(() => newOpponentDeck)
    setOutcome(() => newOutcome)

    return {
      playerCard,
      opponentCard,
      playerDamage,
      opponentDamage,
      turnWinner,
      outcome: newOutcome,
      remainingPlayerDeck: newPlayerDeck,
      remainingOpponentDeck: newOpponentDeck,
    }
  }, [cloneDeck])

  return { startDuel, playTurn, resetDuel, outcome }
}