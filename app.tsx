const HomePage = React.lazy(() => import('./pages/HomePage'));
const DuelPage = React.lazy(() => import('./pages/DuelPage'));
const ShopPage = React.lazy(() => import('./pages/ShopPage'));
const StatsPage = React.lazy(() => import('./pages/StatsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function AppContent(): JSX.Element {
  const [showAd, setShowAd] = useState(false);
  const ad = useAd();
  const analytics = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
    if (ad.shouldShowInterstitial()) {
      setShowAd(true);
    }
  }, [location.pathname]);

  const handleAdClose = (): void => {
    setShowAd(false);
    ad.recordInterstitialShown();
  };

  return (
    <>
      <DeepLinkHandler />
      {showAd && <InterstitialAd onClose={handleAdClose} />}
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/duel/:opponentId?" element={<DuelPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <AnalyticsProvider>
      <AdProvider>
        <WinStreakProvider>
          <SkinProvider>
            <Router>
              <AppContent />
            </Router>
          </SkinProvider>
        </WinStreakProvider>
      </AdProvider>
    </AnalyticsProvider>
  );
}