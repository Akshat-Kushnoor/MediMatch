'use client';

import { useState } from 'react';
import { api, Hospital } from '@/lib/api';
import styles from './HospitalFinder.module.css';

const LOCATIONS = ['NodeA', 'NodeB', 'NodeC', 'NodeD'];

export function HospitalFinder() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ hospital: Hospital; distance: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFind = async (location: string) => {
    setSelectedLocation(location);
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await api.findHospital(location);
    
    setLoading(false);
    
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'No hospital found nearby');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Find Nearest Hospital</h2>
        <p>Locate the closest medical facility</p>
      </div>

      <div className={styles.mapSection}>
        <svg className={styles.map} viewBox="0 0 400 300">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-sage)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="var(--color-rust)" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          
          <path
            className={styles.connection}
            d="M 100 100 Q 150 80 200 120 T 300 150"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          <path
            className={styles.connection}
            d="M 100 100 Q 120 180 200 200 T 300 150"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          <path
            className={styles.connection}
            d="M 200 120 Q 250 170 300 150"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          <path
            className={styles.connection}
            d="M 200 120 Q 180 160 200 200"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          <path
            className={styles.connection}
            d="M 200 200 Q 250 180 300 150"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
          />
          
          <g className={`${styles.node} ${selectedLocation === 'NodeA' ? styles.selected : ''}`}>
            <circle cx="100" cy="100" r="20" fill="var(--color-rust)" />
            <text x="100" y="105" textAnchor="middle" fill="white" fontSize="12">A</text>
            <text x="100" y="140" textAnchor="middle" fill="var(--color-charcoal)" fontSize="10">NodeA</text>
          </g>
          
          <g className={`${styles.node} ${selectedLocation === 'NodeB' ? styles.selected : ''}`}>
            <circle cx="200" cy="120" r="20" fill="var(--color-sage)" />
            <text x="200" y="125" textAnchor="middle" fill="white" fontSize="12">B</text>
            <text x="200" y="160" textAnchor="middle" fill="var(--color-charcoal)" fontSize="10">NodeB</text>
          </g>
          
          <g className={`${styles.node} ${selectedLocation === 'NodeC' ? styles.selected : ''}`}>
            <circle cx="200" cy="200" r="20" fill="var(--color-rust-light)" />
            <text x="200" y="205" textAnchor="middle" fill="white" fontSize="12">C</text>
            <text x="200" y="240" textAnchor="middle" fill="var(--color-charcoal)" fontSize="10">NodeC</text>
          </g>
          
          <g className={`${styles.node} ${selectedLocation === 'NodeD' ? styles.selected : ''}`}>
            <circle cx="300" cy="150" r="20" fill="var(--color-sage-light)" />
            <text x="300" y="155" textAnchor="middle" fill="white" fontSize="12">D</text>
            <text x="300" y="190" textAnchor="middle" fill="var(--color-charcoal)" fontSize="10">NodeD</text>
          </g>
        </svg>
      </div>

      <div className={styles.locations}>
        <span className={styles.locationsLabel}>Select your location:</span>
        <div className={styles.locationButtons}>
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              className={`${styles.locationBtn} ${selectedLocation === loc ? styles.active : ''}`}
              onClick={() => handleFind(loc)}
              disabled={loading}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingPulse} />
          Finding nearest hospital...
        </div>
      )}

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {result && !loading && (
        <div className={styles.result}>
          <div className={styles.resultIcon}>🏥</div>
          <div className={styles.resultInfo}>
            <h3>{result.hospital.name}</h3>
            <p className={styles.resultLocation}>Location: {result.hospital.location}</p>
            <p className={styles.resultDistance}>
              Distance: <strong>{result.distance} km</strong>
            </p>
            <p className={styles.resultCapacity}>
              Blood Bank Capacity: {result.hospital.blood_bank_capacity} units
            </p>
          </div>
        </div>
      )}
    </div>
  );
}