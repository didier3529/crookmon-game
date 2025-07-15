const ResultsOverlay: React.FC<ResultsOverlayProps> = ({ outcome, onClose }) => {
  const [visible, setVisible] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const continueButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const descId = useId()

  const triggerClose = useCallback(() => {
    setVisible(false)
    setTimeout(onClose, 300)
  }, [onClose])

  useEffect(() => {
    setVisible(true)
  }, [])

  useEffect(() => {
    if (visible && continueButtonRef.current) {
      continueButtonRef.current.focus()
    }
  }, [visible])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!overlayRef.current || !overlayRef.current.contains(document.activeElement)) {
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        triggerClose()
      }
      if (e.key === 'Tab') {
        const focusableSelectors = [
          'a[href]',
          'button:not([disabled])',
          'textarea:not([disabled])',
          'input:not([disabled])',
          'select:not([disabled])',
          '[tabindex]:not([tabindex="-1"])',
        ]
        const nodes = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(focusableSelectors.join(','))
        ).filter((el) => el.offsetParent !== null)
        if (nodes.length === 0) {
          return
        }
        const first = nodes[0]
        const last = nodes[nodes.length - 1]
        const active = document.activeElement as HTMLElement
        if (e.shiftKey) {
          if (active === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (active === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [triggerClose])

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      triggerClose()
    }
  }

  const renderTitle = () => {
    if (outcome.winner === 'player') return 'Victory!'
    if (outcome.winner === 'opponent') return 'Defeat'
    return 'Draw'
  }

  const portalRoot = useMemo(
    () => (typeof document !== 'undefined' ? document.getElementById('overlay-root') : null),
    []
  )
  if (!portalRoot) {
    return null
  }

  return ReactDOM.createPortal(
    <div
      className={`results-overlay ${visible ? 'visible' : ''}`}
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descId}
    >
      <div className={`results-dialog ${visible ? 'enter' : 'exit'}`}>
        <h2 id={titleId} className={`results-title ${outcome.winner}`}>
          {renderTitle()}
        </h2>
        <div id={descId} className="results-cards">
          <div className="cards-group">
            <h3>Your Cards</h3>
            <div className="cards-list">
              {outcome.playerCards.map((card) => (
                <CardThumbnail key={card.id} card={card} />
              ))}
            </div>
          </div>
          <div className="cards-group">
            <h3>Opponent Cards</h3>
            <div className="cards-list">
              {outcome.opponentCards.map((card) => (
                <CardThumbnail key={card.id} card={card} />
              ))}
            </div>
          </div>
        </div>
        {outcome.rewards && (
          <div className="results-rewards">
            {outcome.rewards.gold > 0 && <span>+{outcome.rewards.gold} Gold</span>}
            {outcome.rewards.xp > 0 && <span>+{outcome.rewards.xp} XP</span>}
          </div>
        )}
        <button
          ref={continueButtonRef}
          className="results-close-button"
          onClick={triggerClose}
        >
          Continue
        </button>
      </div>
    </div>,
    portalRoot
  )
}

export default ResultsOverlay