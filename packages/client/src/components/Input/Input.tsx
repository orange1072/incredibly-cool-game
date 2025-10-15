import React, { ReactNode, InputHTMLAttributes } from 'react'
import styles from './Input.module.scss'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string
  className?: string
}

export function Input({
  label,
  icon,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className={styles['terminal-input']}>
      {label && <label className={styles['ti-label']}>{label}</label>}

      <div
        className={`${styles['ti-input-wrap']} ${
          error ? styles['has-error'] : ''
        }`}
      >
        {icon && (
          <div className={styles['ti-icon']} aria-hidden>
            {icon}
          </div>
        )}

        <input
          {...props}
          className={`${styles['ti-field']} ${
            icon ? styles['with-icon'] : ''
          } ${className}`}
        />

        <div className={styles['ti-scanline']} />
        <div className={styles['ti-top-glow']} />
      </div>

      {error && (
        <div className={styles['ti-error-row']} role="alert">
          <span className={styles['ti-error-icon']}>⚠</span>
          <span className={styles['ti-error-text']}>{error}</span>
        </div>
      )}
    </div>
  )
}
