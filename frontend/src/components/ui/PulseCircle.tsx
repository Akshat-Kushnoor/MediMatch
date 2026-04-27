'use client';

import styles from './PulseCircle.module.css';

interface PulseCircleProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'rust' | 'sage' | 'cream';
  className?: string;
}

export function PulseCircle({ size = 'md', color = 'rust', className = '' }: PulseCircleProps) {
  return (
    <div
      className={`${styles.circle} ${styles[size]} ${styles[color]} ${className}`}
    >
      <div className={styles.ring} />
      <div className={styles.ring} />
      <div className={styles.core} />
    </div>
  );
}