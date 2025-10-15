import { memo } from 'react'
import styles from './SectionTitle.module.scss'

interface SectionTitleProps {
  title: string
  className?: string
}

export const SectionTitle = memo<SectionTitleProps>(({ title, className }) => {
  return (
    <div className={`${styles.sectionTitle} ${className || ''}`}>
      <h2 className={styles.sectionTitleText}>{title}</h2>
      <div className={styles.sectionDivider} />
    </div>
  )
})

SectionTitle.displayName = 'SectionTitle'
