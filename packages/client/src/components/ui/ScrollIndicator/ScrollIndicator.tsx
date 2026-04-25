import { memo } from 'react'
import { ChevronDown } from 'lucide-react'
import styles from './ScrollIndicator.module.scss'

export const ScrollIndicator = memo(() => {
  return (
    <div className={styles.scrollIndicator}>
      <ChevronDown className={styles.scrollIcon} />
    </div>
  )
})

ScrollIndicator.displayName = 'ScrollIndicator'
