import classNames from 'classnames';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactAdapter } from '../../engine/adapters/ReactAdapter';
import { createGameEngine } from '../../engine/setup/createGameEngine';
import ReduxAdapter from '../../engine/adapters/ReduxAdapter';
import GameEngine from '../../engine/core/GameEngine';
import Logger from '../../engine/infrastructure/Logger';
import { LevelRewardsOverlay } from '../LevelRewardsOverlay/LevelRewardsOverlay';
import styles from './GameCanvas.module.scss';
import { type RootState, useDispatch, useStore } from '@/store/store';
import { closeLevelRewards, getLevelRewards } from '@/store/slices/game';
import type { PassiveBonusKind } from '@/types/component.types';
import { GameOverPopup } from '../GameOverPopup/GameOverPopup';

export const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const adapterRef = useRef<ReactAdapter | null>(null);
  const reduxAdapterRef = useRef<ReduxAdapter | null>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const store = useStore();
  const dispatch = useDispatch();
  const levelRewards = useSelector(getLevelRewards);
  const [gameKey, setGameKey] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const logger = useMemo(() => new Logger('GameCanvas', 'info'), []);

  const handlePlayerKilled = useCallback(() => {
    logger.info('Player killed - handling game over');
    engineRef.current?.pause();
    dispatch(closeLevelRewards());
    setIsGameOver(true);
  }, [dispatch, logger]);

  const handleCleanupEngine = useCallback(() => {
    const engine = engineRef.current;
    if (engine) {
      engine.eventBus.off('playerKilled', handlePlayerKilled);
    }
    adapterRef.current?.destroy();
    adapterRef.current = null;
    reduxAdapterRef.current?.destroy();
    reduxAdapterRef.current = null;
    engineRef.current = null;
    dispatch(closeLevelRewards());
    setIsGameOver(false);
  }, [dispatch, handlePlayerKilled]);

  const handleGameStart = useCallback(() => {
    logger.info('Starting game engine');
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (engineRef.current || adapterRef.current || reduxAdapterRef.current) {
      return;
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    try {
      const engine = createGameEngine(canvas, { store });
      engineRef.current = engine;
      const adapter = new ReactAdapter({ canvasRef, engine });
      const reduxAdapter = new ReduxAdapter<RootState>({ engine, store });

      adapterRef.current = adapter;
      reduxAdapterRef.current = reduxAdapter;

      engine.eventBus.on('playerKilled', () => {
        logger.debug('Event bus: playerKilled event received');
        handlePlayerKilled();
      });

      reduxAdapter.connect();
      adapter.start();
    } catch (error) {
      logger.error('Failed to start game engine', error);
      handleCleanupEngine();
    }
  }, [handleCleanupEngine, handlePlayerKilled, logger, store]);

  useEffect(() => {
    handleGameStart();

    return () => {
      handleCleanupEngine();
    };
  }, [handleGameStart, handleCleanupEngine, gameKey]);

  const canvasClassName = classNames('game-canvas', styles.canvas);

  const handleBonusPick = useCallback(
    (bonus: PassiveBonusKind) => {
      const eventBus = engineRef.current?.eventBus;
      if (!eventBus || !levelRewards.entityId) return;
      eventBus.emit('passiveBonusSelected', {
        id: levelRewards.entityId,
        bonus,
      });
    },
    [levelRewards.entityId]
  );

  const handleCloseOverlay = useCallback(() => {
    if (levelRewards.pending > 0) {
      return;
    }
    dispatch(closeLevelRewards());
    if (!isGameOver) {
      engineRef.current?.resume();
    }
  }, [dispatch, levelRewards.pending, isGameOver]);

  const handleRestart = useCallback(() => {
    setIsGameOver(false);
    dispatch(closeLevelRewards());
    handleCleanupEngine();
    setGameKey((prev) => prev + 1);
  }, [handleCleanupEngine, dispatch]);

  useEffect(() => {
    logger.info(
      'Level rewards overlay changed, pausing/resuming game engine as needed'
    );
    if (levelRewards.visible) {
      engineRef.current?.pause();
      return;
    }
    if (!isGameOver) {
      engineRef.current?.resume();
    }
  }, [levelRewards.visible, isGameOver]);

  const shouldShowRewards =
    levelRewards.visible && levelRewards.options.length > 0;

  return (
    <div className={styles.wrapper}>
      <canvas ref={canvasRef} className={canvasClassName} />

      {shouldShowRewards && (
        <LevelRewardsOverlay
          levelRewards={levelRewards}
          onBonusPick={handleBonusPick}
          onClose={handleCloseOverlay}
        />
      )}

      {isGameOver && <GameOverPopup onRestart={handleRestart} />}
    </div>
  );
};
