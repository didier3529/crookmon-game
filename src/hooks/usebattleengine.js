import { useCallback, useEffect, useRef, useState } from 'react';

export default function useBattleEngine(config) {
  const engineRef = useRef(null);
  const hasInitialized = useRef(false);
  const [state, setState] = useState(() => {
    const engine = new BattleEngine(config);
    engineRef.current = engine;
    hasInitialized.current = true;
    return engine.getState();
  });

  // Reinitialize engine when config changes
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      return;
    }
    const oldEngine = engineRef.current;
    if (oldEngine) {
      if (typeof oldEngine.destroy === 'function') oldEngine.destroy();
      else if (typeof oldEngine.stop === 'function') oldEngine.stop();
    }
    const engine = new BattleEngine(config);
    engineRef.current = engine;
    setState(engine.getState());
  }, [config]);

  // Subscribe to engine state updates
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    let unsubscribe = () => {};
    if (typeof engine.subscribe === 'function') {
      const maybeUnsub = engine.subscribe((newState) => {
        setState(newState);
      });
      if (typeof maybeUnsub === 'function') unsubscribe = maybeUnsub;
    }
    return () => {
      unsubscribe();
    };
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      if (engine) {
        if (typeof engine.destroy === 'function') engine.destroy();
        else if (typeof engine.stop === 'function') engine.stop();
      }
    };
  }, []);

  const start = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.start === 'function') engine.start();
  }, []);

  const pause = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.pause === 'function') engine.pause();
  }, []);

  const resume = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.resume === 'function') engine.resume();
  }, []);

  const stop = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.stop === 'function') engine.stop();
  }, []);

  const reset = useCallback(
    (newConfig) => {
      const engine = engineRef.current;
      if (engine && typeof engine.reset === 'function') {
        engine.reset(newConfig || config);
        if (typeof engine.getState === 'function') {
          setState(engine.getState());
        }
      }
    },
    [config]
  );

  const triggerAction = useCallback((action) => {
    const engine = engineRef.current;
    if (engine && typeof engine.triggerAction === 'function') {
      return engine.triggerAction(action);
    }
  }, []);

  const nextTurn = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.nextTurn === 'function') {
      return engine.nextTurn();
    }
  }, []);

  return {
    state,
    start,
    pause,
    resume,
    stop,
    reset,
    triggerAction,
    nextTurn,
  };
}
