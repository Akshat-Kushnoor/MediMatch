'use client';

import { useState } from 'react';
import { api, MatchResult } from '@/lib/api';
import { PulseCircle } from '../ui/PulseCircle';
import styles from './MatchResults.module.css';

export function MatchResults() {
  const [requestId, setRequestId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFindMatch = async () => {
    if (!requestId.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await api.findMatch(requestId);
    
    setLoading(false);
    
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'No match found for this request');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Find Match</h2>
        <p>Match a donor with a blood request</p>
      </div>

      <div className={styles.inputSection}>
        <label className={styles.label}>Enter Request ID</label>
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g., R1745432100000"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFindMatch()}
          />
          <button
            className={styles.searchBtn}
            onClick={handleFindMatch}
            disabled={loading || !requestId.trim()}
          >
            {loading ? <PulseCircle size="sm" color="cream" /> : 'Find Match'}
          </button>
        </div>
      </div>

      {loading && (
        <div className={styles.loading}>
          <PulseCircle size="lg" color="rust" />
          <span>Searching for compatible donor...</span>
        </div>
      )}

      {error && !loading && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      {result && !loading && (
        <div className={`${styles.resultCard} ${result.donorId ? styles.found : styles.notFound}`}>
          {result.donorId ? (
            <>
              <div className={styles.matchBadge}>
                <PulseCircle size="md" color="sage" />
                <span>Match Found!</span>
              </div>
              <div className={styles.matchDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Donor ID</span>
                  <span className={styles.detailValue}>{result.donorId}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Blood Group</span>
                  <span className={styles.detailValue}>{result.bloodGroup}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Distance</span>
                  <span className={styles.detailValue}>
                    {result.distanceScore === Infinity ? 'N/A' : `${result.distanceScore} km`}
                  </span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${styles[result.status]}`}>
                    {result.status}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={styles.noMatchBadge}>
                <span className={styles.noMatchIcon}>✕</span>
                <span>No Compatible Donor Found</span>
              </div>
              <p className={styles.noMatchText}>
                No matching donor is available for this request at this time.
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}