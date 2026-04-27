'use client';

import styles from './BlobBackground.module.css';

interface BlobBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function BlobBackground({ children, className = '' }: BlobBackgroundProps) {
  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.blob1} />
      <div className={styles.blob2} />
      <div className={styles.blob3} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}