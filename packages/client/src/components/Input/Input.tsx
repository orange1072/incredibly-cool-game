import { ChangeEventHandler, InputHTMLAttributes, memo } from 'react';
import styles from './styles.module.scss';

type InputProps = {
  type: 'text' | 'email' | 'password' | 'phone';
  label?: string;
  placeholder: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  Icon?: React.ReactNode;
  autocomplete?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = memo(
  ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    Icon,
    error,
    ...props
  }: InputProps) => {
    return (
      <div className={styles.inputWrapper}>
        {label && <p className={styles.label}>{label}</p>}
        <div
          className={`${styles.inputContainer} ${error ? styles.hasError : ''}`}
        >
          {Icon && (
            <div className={styles.inputIcon} aria-hidden>
              {Icon}
            </div>
          )}

          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            autoComplete="new-password"
            className={`${styles.input}  ${Icon ? styles.withIcon : ''}`}
            {...props}
          />
        </div>

        {error && (
          <div className={styles.errorWrapper} role="alert">
            <span className={styles.errorIcon}>⚠</span>
            <span className={styles.errorText}>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
