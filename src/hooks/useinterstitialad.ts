import { useCallback, useEffect, useState } from 'react';

const isBrowser = typeof window !== 'undefined';

export function useInterstitialAd(adUnitId: string, frequencyInput: number) {
  const frequency =
    Number.isInteger(frequencyInput) && frequencyInput > 0 ? frequencyInput : 1;
  if (frequency !== frequencyInput) {
    console.warn(
      `[useInterstitialAd] frequency must be a positive integer. Defaulting to ${frequency}.`
    );
  }
  const storageKey = `interstitial-ad-counter-${adUnitId}`;

  const [counter, setCounter] = useState<number>(() => {
    if (!isBrowser) return 0;
    const stored = window.localStorage.getItem(storageKey);
    const num = Number(stored);
    return stored !== null && !isNaN(num) ? num : 0;
  });

  const loadAd = useCallback(() => {
    if (!isBrowser) return;
    const sdk = (window as any).AdSDK;
    if (sdk && typeof sdk.loadInterstitial === 'function') {
      sdk.loadInterstitial(adUnitId).catch(() => {});
    }
  }, [adUnitId]);

  const showAd = useCallback(() => {
    if (!isBrowser) return;
    const sdk = (window as any).AdSDK;
    if (sdk && typeof sdk.showInterstitial === 'function') {
      sdk.showInterstitial(adUnitId).catch(() => {});
    }
  }, [adUnitId]);

  const resetCounter = useCallback(() => {
    setCounter(0);
    if (isBrowser) {
      window.localStorage.setItem(storageKey, '0');
    }
    loadAd();
  }, [storageKey, loadAd]);

  const triggerAd = useCallback(() => {
    setCounter((prev) => {
      const next = prev + 1;
      if (isBrowser) {
        window.localStorage.setItem(storageKey, next.toString());
      }
      return next;
    });
  }, [storageKey]);

  useEffect(() => {
    loadAd();
  }, [loadAd]);

  useEffect(() => {
    if (counter >= frequency) {
      showAd();
      resetCounter();
    }
  }, [counter, frequency, showAd, resetCounter]);

  return { triggerAd, resetCounter };
}
