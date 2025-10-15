import { memo } from 'react'
import { AlertTriangle } from 'lucide-react'
import styles from './WarningBadge.module.scss'

interface WarningBadgeProps {
  text: string
  className?: string
}

export const WarningBadge = memo<WarningBadgeProps>(({ text, className }) => {
  return (
    <div className={`${styles.warningBadge} ${className || ''}`}>
      <AlertTriangle className={styles.warningIcon} />
      <span className={styles.warningText}>{text}</span>
      <AlertTriangle className={styles.warningIcon} />
    </div>
  )
})

WarningBadge.displayName = 'WarningBadge'
