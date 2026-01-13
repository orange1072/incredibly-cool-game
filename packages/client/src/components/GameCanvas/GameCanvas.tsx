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
import { GamePauseOverlay } from '../GamePauseOverlay/GamePauseOverlay';

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
  const [showPauseInfo, setShowPauseInfo] = useState(false);
  const logger = useMemo(() => new Logger('GameCanvas', 'info'), []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const { innerWidth, innerHeight } = window;
    if (canvas.width !== innerWidth) {
      canvas.width = innerWidth;
    }
    if (canvas.height !== innerHeight) {
      canvas.height = innerHeight;
    }
  }, []);

  const handlePlayerKilled = useCallback(() => {
    logger.info('Player killed - handling game over');
    engineRef.current?.pause();
    dispatch(closeLevelRewards());
    setIsGameOver(true);
  }, [dispatch, logger]);

  const playerKilledHandlerRef = useRef<(() => void) | null>(null);

  const handleCleanupEngine = useCallback(() => {
    const engine = engineRef.current;
    if (engine && playerKilledHandlerRef.current) {
      engine.eventBus.off('playerKilled', playerKilledHandlerRef.current);
      playerKilledHandlerRef.current = null;
    }
    adapterRef.current?.destroy();
    adapterRef.current = null;
    reduxAdapterRef.current?.destroy();
    reduxAdapterRef.current = null;
    engineRef.current = null;
    dispatch(closeLevelRewards());
    setIsGameOver(false);
    setShowPauseInfo(false);
  }, [dispatch]);

  const handleGameStart = useCallback(() => {
    logger.info('Starting game engine');
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (engineRef.current || adapterRef.current || reduxAdapterRef.current) {
      return;
    }

    resizeCanvas();

    try {
      const engine = createGameEngine(canvas, { store });
      engineRef.current = engine;
      const adapter = new ReactAdapter({ canvasRef, engine });
      const reduxAdapter = new ReduxAdapter<RootState>({ engine, store });

      adapterRef.current = adapter;
      reduxAdapterRef.current = reduxAdapter;

      // Создаем обработчик и сохраняем ссылку для последующего удаления
      const playerKilledHandler = () => {
        logger.debug('Event bus: playerKilled event received');
        handlePlayerKilled();
      };
      playerKilledHandlerRef.current = playerKilledHandler;
      engine.eventBus.on('playerKilled', playerKilledHandler);

      reduxAdapter.connect();
      adapter.start();
    } catch (error) {
      logger.error('Failed to start game engine', error);
      handleCleanupEngine();
    }
  }, [handleCleanupEngine, handlePlayerKilled, logger, resizeCanvas, store]);

  useEffect(() => {
    handleGameStart();

    return () => {
      handleCleanupEngine();
    };
  }, [handleGameStart, handleCleanupEngine, gameKey]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

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
      setShowPauseInfo(false);
      return;
    }
    if (!isGameOver) {
      engineRef.current?.resume();
    }
  }, [levelRewards.visible, isGameOver]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') return;
      if (levelRewards.visible || isGameOver) return;
      setShowPauseInfo((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [levelRewards.visible, isGameOver]);

  useEffect(() => {
    if (isGameOver || levelRewards.visible) {
      setShowPauseInfo(false);
    }
  }, [isGameOver, levelRewards.visible]);

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

      <GamePauseOverlay visible={showPauseInfo} />

      {isGameOver && <GameOverPopup onRestart={handleRestart} />}
    </div>
  );
};
