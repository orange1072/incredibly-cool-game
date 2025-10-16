import { memo } from 'react'
import { Radiation } from 'lucide-react'
import styles from './Logo.module.scss'

export type LogoSize = 'sm' | 'md' | 'lg' | 'xl'

interface LogoProps {
  size?: LogoSize
  className?: string
  showGlow?: boolean
  animated?: boolean
}

const sizeMap: Record<LogoSize, { icon: string; container: string }> = {
  sm: { icon: styles.logoIconSm, container: styles.logoContainerSm },
  md: { icon: styles.logoIconMd, container: styles.logoContainerMd },
  lg: { icon: styles.logoIconLg, container: styles.logoContainerLg },
  xl: { icon: styles.logoIconXl, container: styles.logoContainerXl },
}

export const Logo = memo<LogoProps>(
  ({ size = 'lg', className = '', showGlow = true, animated = false }) => {
    const sizeClasses = sizeMap[size]

    return (
      <div
        className={`${styles.logoContainer} ${sizeClasses.container} ${className}`}
      >
        <div className={styles.logoWrapper}>
          {showGlow && <div className={styles.logoGlow} />}
          <Radiation
            className={`${styles.logoIcon} ${sizeClasses.icon} ${
              animated ? styles.animated : ''
            }`}
          />
        </div>
      </div>
    )
  }
)

Logo.displayName = 'Logo'
