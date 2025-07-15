function initApp() {
  if (process.env.REACT_APP_ANALYTICS_ID) {
    Analytics.init(process.env.REACT_APP_ANALYTICS_ID);
  }
  if (process.env.REACT_APP_ADS_PUBLIC_KEY) {
    AdsManager.init({
      publicKey: process.env.REACT_APP_ADS_PUBLIC_KEY,
      interstitialAdUnit: process.env.REACT_APP_ADS_INTERSTITIAL_ID
    });
  }
  WinStreakStore.load();
}

function renderApp() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

initApp();
renderApp();