import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from './MobileInputProvider.module.scss';
import { useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';

const KEY_CODES: Record<string, string> = {
  w: 'KeyW',
  a: 'KeyA',
  s: 'KeyS',
  d: 'KeyD',
  Enter: 'Enter',
};

type DirectionKey = 'w' | 'a' | 's' | 'd';

export const MobileInputProvider = ({ children }: PropsWithChildren) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const route = useLocation();

  console.log('Маршрут (мобильный ввод):', route.pathname);

  const isInGame = route.pathname === ROUTE_PATHS.gamePlay;

  console.log('В игре (мобильный ввод):', isInGame, route.pathname);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 768px)');

    const handleChange = () => setIsMobile(media.matches);
    handleChange();

    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
      return () => media.removeEventListener('change', handleChange);
    }

    const legacyMedia = media as MediaQueryList & {
      addListener?: (listener: (ev: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (ev: MediaQueryListEvent) => void) => void;
    };
    legacyMedia.addListener?.(handleChange);
    return () => legacyMedia.removeListener?.(handleChange);
  }, []);

  const dispatchKeyEvent = useCallback(
    (type: 'keydown' | 'keyup', key: string) => {
      if (typeof window === 'undefined') return;
      const code = KEY_CODES[key] ?? key;
      window.dispatchEvent(
        new KeyboardEvent(type, {
          key,
          code,
          bubbles: true,
        })
      );
    },
    []
  );

  useEffect(() => {
    if (!isMobile) {
      ['w', 'a', 's', 'd'].forEach((key) => dispatchKeyEvent('keyup', key));
    }
    return () => {
      ['w', 'a', 's', 'd'].forEach((key) => dispatchKeyEvent('keyup', key));
    };
  }, [dispatchKeyEvent, isMobile]);

  const handlePress = useCallback(
    (key: DirectionKey) => {
      dispatchKeyEvent('keydown', key);
    },
    [dispatchKeyEvent]
  );

  const handleRelease = useCallback(
    (key: DirectionKey) => {
      dispatchKeyEvent('keyup', key);
    },
    [dispatchKeyEvent]
  );

  const handlePause = useCallback(() => {
    setIsPaused(!isPaused);

    console.log('Пауза (мобильный ввод)', isPaused);
    dispatchKeyEvent('keydown', 'Enter');
    dispatchKeyEvent('keyup', 'Enter');
  }, [dispatchKeyEvent, isPaused, setIsPaused]);

  const joystickBaseRef = useRef<HTMLDivElement | null>(null);
  const [stickPosition, setStickPosition] = useState({ x: 0, y: 0 });
  const activeKeysRef = useRef<Set<DirectionKey>>(new Set());
  const isDraggingRef = useRef(false);
  const centerRef = useRef({ x: 0, y: 0 });
  const maxDistanceRef = useRef(0);

  const setActiveKeys = useCallback(
    (nextKeys: DirectionKey[]) => {
      const current = activeKeysRef.current;
      const nextSet = new Set(nextKeys);
      current.forEach((key) => {
        if (!nextSet.has(key)) {
          handleRelease(key);
        }
      });
      nextSet.forEach((key) => {
        if (!current.has(key)) {
          handlePress(key);
        }
      });
      activeKeysRef.current = nextSet;
    },
    [handlePress, handleRelease]
  );

  const resolveDirection = useCallback((dx: number, dy: number) => {
    const distance = Math.hypot(dx, dy);
    if (distance < 12) return null;
    const angle = Math.atan2(dy, dx);
    const deg = (angle * 180) / Math.PI;
    if (deg >= -22.5 && deg <= 22.5) return ['d'] as DirectionKey[];
    if (deg > 22.5 && deg <= 67.5) return ['d', 's'] as DirectionKey[];
    if (deg > 67.5 && deg <= 112.5) return ['s'] as DirectionKey[];
    if (deg > 112.5 && deg <= 157.5) return ['a', 's'] as DirectionKey[];
    if (deg > 157.5 || deg <= -157.5) return ['a'] as DirectionKey[];
    if (deg > -157.5 && deg <= -112.5) return ['a', 'w'] as DirectionKey[];
    if (deg > -112.5 && deg <= -67.5) return ['w'] as DirectionKey[];
    return ['d', 'w'] as DirectionKey[];
  }, []);

  const updateFromPoint = useCallback(
    (clientX: number, clientY: number) => {
      const dx = clientX - centerRef.current.x;
      const dy = clientY - centerRef.current.y;
      const distance = Math.hypot(dx, dy);
      const maxDistance = maxDistanceRef.current;
      const scale = distance > maxDistance ? maxDistance / distance : 1;
      const clampedX = dx * scale;
      const clampedY = dy * scale;
      setStickPosition({ x: clampedX, y: clampedY });
      const keys = resolveDirection(dx, dy);
      setActiveKeys(keys ?? []);
    },
    [resolveDirection, setActiveKeys]
  );

  const handleStickPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      const base = joystickBaseRef.current;
      if (!base) return;
      const rect = base.getBoundingClientRect();
      const radius = rect.width / 2;
      const knobRadius = radius * 0.45;
      centerRef.current = { x: rect.left + radius, y: rect.top + radius };
      maxDistanceRef.current = Math.max(radius - knobRadius, 0);
      isDraggingRef.current = true;
      base.setPointerCapture(event.pointerId);
      updateFromPoint(event.clientX, event.clientY);
    },
    [updateFromPoint]
  );

  const handleStickPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      updateFromPoint(event.clientX, event.clientY);
    },
    [updateFromPoint]
  );

  const handleStickPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      isDraggingRef.current = false;
      setStickPosition({ x: 0, y: 0 });
      setActiveKeys([]);
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    [setActiveKeys]
  );

  return (
    <>
      {children}
      {isMobile && isInGame && (
        <div className={styles.mobileControls}>
          <div className={styles.topBar}>
            <button
              type="button"
              className={styles.pauseButton}
              onClick={handlePause}
            >
              Пауза
            </button>
          </div>

          <div className={styles.bottomRight}>
            {!isPaused && (
              <div className={styles.joystick}>
                <div
                  ref={joystickBaseRef}
                  className={styles.joystickBase}
                  role="button"
                  aria-label="Джойстик движения"
                  onPointerDown={handleStickPointerDown}
                  onPointerMove={handleStickPointerMove}
                  onPointerUp={handleStickPointerUp}
                  onPointerCancel={handleStickPointerUp}
                >
                  <div
                    className={styles.joystickKnob}
                    style={{
                      transform: `translate(${stickPosition.x}px, ${stickPosition.y}px)`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
