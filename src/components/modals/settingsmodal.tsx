const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [volume, setVolumeLevel] = useState<number>(50)

  useEffect(() => {
    const storedThemeRaw = localStorage.getItem('theme')
    const validatedTheme = storedThemeRaw === 'dark' ? 'dark' : 'light'
    setTheme(validatedTheme)
    document.documentElement.dataset.theme = validatedTheme
  }, [])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    document.documentElement.dataset.theme = theme
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }))
  }, [theme])

  useEffect(() => {
    const raw = localStorage.getItem('volume') || ''
    const parsed = parseInt(raw, 10)
    const validatedVolume =
      isNaN(parsed) || parsed < 0 || parsed > 100 ? 50 : parsed
    setVolumeLevel(validatedVolume)
    window.dispatchEvent(
      new CustomEvent('volumeChange', { detail: { level: validatedVolume } })
    )
  }, [])

  const toggleTheme = (): void => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const setVolume = (level: number): void => {
    setVolumeLevel(level)
    localStorage.setItem('volume', level.toString())
    window.dispatchEvent(new CustomEvent('volumeChange', { detail: { level } }))
  }

  const handleVolumeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setVolume(parseInt(e.target.value, 10))
  }

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div
        className="settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={e => e.stopPropagation()}
      >
        <header className="settings-modal-header">
          <h2 id="settings-modal-title">Settings</h2>
          <button
            className="settings-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            ?
          </button>
        </header>
        <div className="settings-modal-body">
          <div className="settings-modal-section">
            <label htmlFor="theme-toggle">Theme</label>
            <button
              id="theme-toggle"
              className="theme-toggle-button"
              onClick={toggleTheme}
            >
              {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
            </button>
          </div>
          <div className="settings-modal-section">
            <label htmlFor="volume-slider">Volume: {volume}%</label>
            <input
              id="volume-slider"
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={handleVolumeChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal