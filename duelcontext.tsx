const DuelContext = createContext<DuelContextType | undefined>(undefined)

export const DuelProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [duelId, setDuelId] = useState<string | null>(null)
  const [inProgress, setInProgress] = useState(false)
  const [winStreak, setWinStreak] = useState(0)

  const startDuel = useCallback((id: string) => {
    setDuelId(id)
    setInProgress(true)
    Analytics.trackEvent('duel_start', { duelId: id })
  }, [])

  const endDuel = useCallback((won: boolean) => {
    setInProgress(false)
    if (duelId) {
      Analytics.trackEvent('duel_end', { duelId, won })
    }
    if (won) {
      setWinStreak(prev => prev + 1)
    } else {
      setWinStreak(0)
    }
    // show interstitial ad if needed
  }, [duelId])

  const resetStreak = useCallback(() => {
    setWinStreak(0)
    Analytics.trackEvent('streak_reset')
  }, [])

  const shareDuel = useCallback(async () => {
    if (!duelId) return
    const url = `${window.location.origin}${window.location.pathname}?duel=${duelId}`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.setAttribute('readonly', '')
        textarea.style.position = 'absolute'
        textarea.style.left = '-9999px'
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      Analytics.trackEvent('duel_share', { duelId })
    } catch (error) {
      console.error('Failed to copy duel link to clipboard', error)
      alert(`Failed to copy link. Please copy it manually: ${url}`)
    }
  }, [duelId])

  useEffect(() => {
    const saved = localStorage.getItem('winStreak')
    if (saved && !isNaN(parseInt(saved, 10))) {
      setWinStreak(parseInt(saved, 10))
    }
    const params = new URLSearchParams(window.location.search)
    const id = params.get('duel')
    if (id) {
      startDuel(id)
    }
  }, [startDuel])

  useEffect(() => {
    localStorage.setItem('winStreak', winStreak.toString())
  }, [winStreak])

  const value = useMemo(
    () => ({
      duelId,
      inProgress,
      winStreak,
      startDuel,
      endDuel,
      resetStreak,
      shareDuel,
    }),
    [duelId, inProgress, winStreak, startDuel, endDuel, resetStreak, shareDuel]
  )

  return <DuelContext.Provider value={value}>{children}</DuelContext.Provider>
}

export const useDuel = (): DuelContextType => {
  const context = useContext(DuelContext)
  if (!context) {
    throw new Error('useDuel must be used within a DuelProvider')
  }
  return context
}