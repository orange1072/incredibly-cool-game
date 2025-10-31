import {
  ComponentType,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Expand, Shrink } from 'lucide-react';
import styles from './styles.module.scss';

type WithFullscreenOptions = {
  buttonLabelEnter?: ReactNode;
  buttonLabelExit?: ReactNode;
};

export function withFullscreen<P extends object>(
  Wrapped: ComponentType<P>,
  options?: WithFullscreenOptions
) {
  const { buttonLabelEnter = <Expand />, buttonLabelExit = <Shrink /> } =
    options || {};

  return function WithFullscreenComponent(props: P) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const onFsChange = useCallback(() => {
      const isFs = Boolean(
        document.fullscreenElement ||
          (document as any).webkitFullscreenElement ||
          (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    }, []);

    useEffect(() => {
      document.addEventListener('fullscreenchange', onFsChange);
      return () => {
        document.removeEventListener('fullscreenchange', onFsChange);
      };
    }, [onFsChange]);

    const requestFs = useCallback(() => {
      const el = containerRef.current as any;
      if (!el) return;
      if (typeof el.requestFullscreen === 'function') {
        el.requestFullscreen();
        return;
      }
      if (typeof el.webkitRequestFullscreen === 'function') {
        el.webkitRequestFullscreen();
        return;
      }
      if (typeof el.msRequestFullscreen === 'function') {
        el.msRequestFullscreen();
      }
    }, []);

    const exitFs = useCallback(() => {
      const doc = document as any;
      if (typeof document.exitFullscreen === 'function') {
        document.exitFullscreen();
        return;
      }
      if (typeof doc.webkitExitFullscreen === 'function') {
        doc.webkitExitFullscreen();
        return;
      }
      if (typeof doc.msExitFullscreen === 'function') {
        doc.msExitFullscreen();
      }
    }, []);

    const toggleFs = useCallback(() => {
      if (isFullscreen) exitFs();
      else requestFs();
    }, [isFullscreen, exitFs, requestFs]);

    const buttonTitle = useMemo(
      () => (isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'),
      [isFullscreen]
    );

    return (
      <div ref={containerRef} className={styles.fullscreenContainer}>
        <Wrapped {...(props as P)} />
        <button
          type="button"
          onClick={toggleFs}
          aria-label={buttonTitle}
          title={buttonTitle}
          className={styles.fullscreenButton}
        >
          {isFullscreen ? buttonLabelExit : buttonLabelEnter}
        </button>
      </div>
    );
  };
}

export default withFullscreen;
