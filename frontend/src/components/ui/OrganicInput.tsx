'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import styles from './OrganicInput.module.css';

interface OrganicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const OrganicInput = forwardRef<HTMLInputElement, OrganicInputProps>(
  ({ label, error, className, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value && String(props.value).length > 0;

    return (
      <div className={`${styles.field} ${className || ''}`}>
        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={`${styles.input} ${error ? styles.hasError : ''}`}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...props}
          />
          <label
            className={`${styles.label} ${(focused || hasValue) ? styles.active : ''}`}
          >
            {label}
          </label>
          <span className={styles.underline} />
        </div>
        {error && <span className={styles.errorText}>{error}</span>}
      </div>
    );
  }
);

OrganicInput.displayName = 'OrganicInput';