const CardTile = React.lazy(() => import('./cardtile'))

interface Card {
  id: string
  name: string
  imageUrl: string
  [key: string]: any
}

interface CardPickerGridProps {
  cards: Card[]
  onCardSelect: (card: Card) => void
  initialSelectedCardId?: string
}

const CardPickerGrid: FC<CardPickerGridProps> = ({
  cards,
  onCardSelect,
  initialSelectedCardId,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(
    initialSelectedCardId,
  )

  useEffect(() => {
    if (initialSelectedCardId !== undefined) {
      setSelectedCardId(initialSelectedCardId)
    }
  }, [initialSelectedCardId])

  const handleSelect = useCallback(
    (card: Card) => {
      if (card.id === selectedCardId) return
      setSelectedCardId(card.id)
      onCardSelect(card)
      AnalyticsService.logEvent('card_picker_select', {
        cardId: card.id,
        cardName: card.name,
      })
    },
    [onCardSelect, selectedCardId],
  )

  return (
    <div className="card-picker-grid" role="radiogroup" aria-label="Select a card">
      <Suspense fallback={<LoadingSpinner />}>
        {cards.map(card => (
          <button
            key={card.id}
            type="button"
            role="radio"
            aria-checked={card.id === selectedCardId}
            className={
              card.id === selectedCardId
                ? 'card-picker-grid__item card-picker-grid__item--selected'
                : 'card-picker-grid__item'
            }
            onClick={() => handleSelect(card)}
          >
            <CardTile card={card} isSelected={card.id === selectedCardId} />
          </button>
        ))}
      </Suspense>
    </div>
  )
}

export default memo(CardPickerGrid)