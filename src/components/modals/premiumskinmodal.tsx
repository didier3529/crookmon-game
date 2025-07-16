const PremiumSkinModal: React.FC<PremiumSkinModalProps> = ({ skins, onPurchase, onClose }) => {
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null)
  const prevFocusedElement = useRef<Element | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const overflowRef = useRef<string>('')

  useEffect(() => {
    if (typeof document !== 'undefined') {
      setModalRoot(document.getElementById('modal-root'))
    }
  }, [])

  useEffect(() => {
    if (!modalRoot) return
    prevFocusedElement.current = document.activeElement
    overflowRef.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflowRef.current
      if (prevFocusedElement.current instanceof HTMLElement) {
        (prevFocusedElement.current as HTMLElement).focus()
      }
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [modalRoot, onClose])

  const handleOverlayClick = useCallback(() => {
    onClose()
  }, [onClose])

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
  }, [])

  const handlePurchaseClick = useCallback(
    (skinId: string) => {
      onPurchase(skinId)
    },
    [onPurchase]
  )

  if (!modalRoot) return null

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={handleOverlayClick} role="presentation">
      <FocusTrap>
        <div
          className={styles.modalContent}
          role="dialog"
          aria-modal="true"
          aria-labelledby="premium-skin-modal-title"
          onClick={stopPropagation}
        >
          <header className={styles.header}>
            <h2 id="premium-skin-modal-title" className={styles.title}>
              Premium Skins
            </h2>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close"
              onClick={onClose}
              ref={closeButtonRef}
            >
              ?
            </button>
          </header>
          <div className={styles.body}>
            {skins.length === 0 ? (
              <p className={styles.emptyMessage}>No premium skins available.</p>
            ) : (
              <div className={styles.skinsGrid}>
                {skins.map((skin) => (
                  <div key={skin.id} className={styles.skinCard}>
                    <img src={skin.imageUrl} alt={skin.name} className={styles.skinImage} />
                    <div className={styles.skinInfo}>
                      <p className={styles.skinName}>{skin.name}</p>
                      <p className={styles.skinPrice}>
                        {skin.price.toLocaleString(undefined, {
                          style: 'currency',
                          currency: skin.currency || 'USD',
                        })}
                      </p>
                      <button
                        type="button"
                        className={styles.purchaseButton}
                        onClick={() => handlePurchaseClick(skin.id)}
                      >
                        Purchase
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>,
    modalRoot
  )
}

export default PremiumSkinModal