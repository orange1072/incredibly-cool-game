import { ChangeEventHandler, InputHTMLAttributes, memo } from 'react';
import styles from './styles.module.scss';

type InputProps = {
  type: 'text' | 'email' | 'password' | 'phone';
  label?: string;
  placeholder: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  Icon?: React.ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = memo(
  ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    Icon,
    ...props
  }: InputProps) => {
    return (
      <div className={styles.inputWrapper}>
        {label && <p className={styles.label}>{label}</p>}
        <div
          className={`${styles.inputContainer} ${Icon ? styles.withIcon : ''}`}
        >
          {Icon && <span>{Icon}</span>}
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={styles.input}
            {...props}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
