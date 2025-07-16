import { useCallback, useEffect, useRef, useState } from 'react';
import initializeBattle from '../core/engine/initializebattle.js';

export default function useBattleEngine(config) {
  const engineRef = useRef(null);
  const hasInitialized = useRef(false);
  const [state, setState] = useState(() => {
    const engine = initializeBattle(config);
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
    if (oldEngine && typeof oldEngine.stop === 'function') {
      oldEngine.stop();
    }
    const engine = initializeBattle(config);
    engineRef.current = engine;
    setState(engine.getState());
  }, [config]);

  // Subscribe to engine state updates
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    const update = () => setState(engine.getState());
    const events = [
      'roundStart',
      'roundEnd',
      'action',
      'start',
      'end',
      'stop',
      'reset',
    ];

    for (const evt of events) {
      engine.on(evt, update);
    }

    return () => {
      for (const evt of events) {
        engine.off(evt, update);
      }
    };
  }, [config]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      if (engine && typeof engine.stop === 'function') {
        engine.stop();
      }
    };
  }, []);

  const start = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.start === 'function') engine.start();
  }, []);

  const stop = useCallback(() => {
    const engine = engineRef.current;
    if (engine && typeof engine.stop === 'function') engine.stop();
  }, []);

  const reset = useCallback(
    (newConfig) => {
      const engine = engineRef.current;
      if (!engine) return;

      if (newConfig) {
        const newEngine = initializeBattle(newConfig);
        engineRef.current = newEngine;
        setState(newEngine.getState());
      } else if (typeof engine.reset === 'function') {
        engine.reset();
        setState(engine.getState());
      }
    },
    [config]
  );

  const subscribe = useCallback((event, listener) => {
    const engine = engineRef.current;
    if (engine && typeof engine.on === 'function') {
      engine.on(event, listener);
      return () => engine.off(event, listener);
    }
    return () => {};
  }, []);

  return {
    state,
    start,
    stop,
    reset,
    subscribe,
  };
}
