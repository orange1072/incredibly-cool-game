import { ReactNode } from 'react'
import styles from './PixelButton.module.scss'

interface PixelButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'danger' | 'success' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  className?: string
  disabled?: boolean
}

export function PixelButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
}: PixelButtonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return styles.primary
      case 'danger':
        return styles.danger
      case 'success':
        return styles.success
      case 'secondary':
        return styles.secondary
      default:
        return styles.primary
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return styles.small
      case 'md':
        return styles.medium
      case 'lg':
        return styles.large
      default:
        return styles.medium
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${
        styles.button
      } ${getVariantClass()} ${getSizeClass()} ${className}`}
    >
      {/* Scanline effect */}
      <div className={styles.scanline} />

      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.content}>{children}</span>

      {/* Hover glow line */}
      <div className={styles.hoverGlow} />
    </button>
  )
}
