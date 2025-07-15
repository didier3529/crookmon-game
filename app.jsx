const Home = React.lazy(() => import('./pages/Home'))
const Duel = React.lazy(() => import('./pages/Duel'))
const Results = React.lazy(() => import('./pages/Results'))
const Shop = React.lazy(() => import('./pages/Shop'))

function RouteChangeTracker({ onRouteChange }) {
  const location = useLocation()
  useEffect(() => {
    onRouteChange(location.pathname + location.search)
  }, [location, onRouteChange])
  return null
}

export default function App() {
  const [winStreak, setWinStreak] = useState(0)
  const [skin, setSkin] = useState('default')
  const [showAd, setShowAd] = useState(false)

  useEffect(() => {
    const storedStreak = parseInt(localStorage.getItem('winStreak')) || 0
    setWinStreak(storedStreak)
    const storedSkin = localStorage.getItem('selectedSkin') || 'default'
    setSkin(storedSkin)
    loadAnalytics()
  }, [])

  useEffect(() => {
    localStorage.setItem('winStreak', winStreak)
  }, [winStreak])

  useEffect(() => {
    localStorage.setItem('selectedSkin', skin)
  }, [skin])

  const incrementWinStreak = () => setWinStreak(prev => prev + 1)
  const resetWinStreak = () => setWinStreak(0)
  const handleAdClose = () => setShowAd(false)

  const handleRouteChange = path => {
    trackPageView(path)
    if (path.startsWith('/duel')) setShowAd(true)
  }

  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      <Router>
        <Header winStreak={winStreak} />
        <RouteChangeTracker onRouteChange={handleRouteChange} />
        {showAd && <InterstitialAd onClose={handleAdClose} />}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/duel/:opponentId" element={<Duel onWin={incrementWinStreak} onLose={resetWinStreak} />} />
            <Route path="/results" element={<Results winStreak={winStreak} />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />
      </Router>
    </SkinContext.Provider>
  )
}