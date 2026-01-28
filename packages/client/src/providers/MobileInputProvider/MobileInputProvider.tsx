import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from './MobileInputProvider.module.scss';

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
    dispatchKeyEvent('keydown', 'Enter');
    dispatchKeyEvent('keyup', 'Enter');
  }, [dispatchKeyEvent]);

  const movementButtons = useMemo(
    () => [
      {
        key: 'w' as DirectionKey,
        label: '▲',
        className: styles.up,
        aria: 'Вверх',
      },
      {
        key: 'a' as DirectionKey,
        label: '◀',
        className: styles.left,
        aria: 'Влево',
      },
      {
        key: 's' as DirectionKey,
        label: '▼',
        className: styles.down,
        aria: 'Вниз',
      },
      {
        key: 'd' as DirectionKey,
        label: '▶',
        className: styles.right,
        aria: 'Вправо',
      },
    ],
    []
  );

  const renderMovementButton = (item: {
    key: DirectionKey;
    label: string;
    className: string;
    aria: string;
  }) => {
    const buttonClassName = `${styles.dpadButton} ${item.className}`;

    return (
      <button
        key={item.key}
        type="button"
        className={buttonClassName}
        aria-label={`Двигаться: ${item.aria}`}
        onPointerDown={(event) => {
          event.preventDefault();
          event.currentTarget.setPointerCapture(event.pointerId);
          handlePress(item.key);
        }}
        onPointerUp={(event) => {
          event.preventDefault();
          handleRelease(item.key);
        }}
        onPointerCancel={() => handleRelease(item.key)}
        onPointerLeave={() => handleRelease(item.key)}
      >
        {item.label}
      </button>
    );
  };

  return (
    <>
      {children}
      {isMobile && (
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
            <div className={styles.dpad}>
              <div className={styles.center} />
              {movementButtons.map(renderMovementButton)}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
