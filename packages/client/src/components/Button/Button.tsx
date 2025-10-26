import classNames from 'classnames'
import { ButtonHTMLAttributes, memo } from 'react'
import styles from './styles.module.scss'

type TProps = {
  children: React.ReactNode
  styleType?: 'primary' | 'danger'
  Icon?: React.ReactNode
  size?: 'sm' | 'md'
} & ButtonHTMLAttributes<HTMLButtonElement>

const cx = classNames.bind(styles)

export const Button = memo(
  ({
    children,
    styleType = 'primary',
    Icon,
    size = 'md',
    ...props
  }: TProps) => {
    return (
      <button
        {...props}
        className={cx(
          styles.button,
          props.className,
          styles[styleType],
          styles[size]
        )}
      >
        {Icon && <span className={styles.icon}>{Icon}</span>}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
