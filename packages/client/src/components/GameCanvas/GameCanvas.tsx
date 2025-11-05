import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactAdapter } from '../../engine/adapters/ReactAdapter';
import { createGameEngine } from '../../engine/setup/createGameEngine';
import ReduxAdapter from '../../engine/adapters/ReduxAdapter';
import GameEngine from '../../engine/core/GameEngine';
import styles from './GameCanvas.module.scss';
import { type RootState, useStore } from '@/store/store';

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const adapterRef = useRef<ReactAdapter | null>(null);
  const reduxAdapterRef = useRef<ReduxAdapter | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const store = useStore();
  const navigate = useNavigate();
  const [gameKey, setGameKey] = useState(0);

  const handlePlayerKilled = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    navigate('/game-over');
  }, [navigate]);

  const cleanupEngine = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || adapterRef.current) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const engine = createGameEngine(canvas, { store });
    engineRef.current = engine;
    const adapter = new ReactAdapter({ canvasRef, engine });
    const reduxAdapter = new ReduxAdapter<RootState>({ engine, store });

    adapterRef.current = adapter;
    reduxAdapterRef.current = reduxAdapter;

    const eventBus = engine.eventBus;
    eventBus.on('playerKilled', handlePlayerKilled);

    reduxAdapter.connect();
    adapter.start();

    const cleanup = () => {
      eventBus.off('playerKilled', handlePlayerKilled);
      adapterRef.current?.destroy();
      adapterRef.current = null;
      reduxAdapterRef.current?.destroy();
      reduxAdapterRef.current = null;
      engineRef.current = null;
      cleanupRef.current = null;
    };

    cleanupRef.current = cleanup;

    return () => {
      cleanup();
    };
  }, [store, handlePlayerKilled, gameKey]);

  useEffect(() => {
    return () => {
      cleanupEngine();
    };
  }, [cleanupEngine]);

  const canvasClassName = classNames('game-canvas', styles.canvas);

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={canvasClassName} />
    </div>
  );
};
