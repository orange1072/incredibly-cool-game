import { ReactNode } from 'react';
import styles from './AnimatedPanel.module.scss';

interface AnimatedPanelProps {
  children: ReactNode;
  variant?: 'danger' | 'cyan';
  className?: string;
}

export function AnimatedPanel({
  children,
  variant = 'danger',
  className,
}: AnimatedPanelProps) {
  return (
    <div className={`${styles.panel} ${className || ''}`}>
      <div className={styles.scanlineOverlay} />
      <div
        className={
          variant === 'danger' ? styles.panelTopLine : styles.panelTopLineCyan
        }
      />
      {children}
      <div className={styles.panelBottomLine} />
    </div>
  );
}
