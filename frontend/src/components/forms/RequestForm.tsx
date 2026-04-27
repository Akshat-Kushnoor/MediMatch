'use client';

import { useState, FormEvent } from 'react';
import { OrganicInput } from '../ui/OrganicInput';
import { PulseCircle } from '../ui/PulseCircle';
import { api, RecipientRequest } from '@/lib/api';
import styles from './RequestForm.module.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const LOCATIONS = ['NodeA', 'NodeB', 'NodeC', 'NodeD'];
const URGENCY_LEVELS = [
  { value: 'high', label: 'High', description: 'Immediate need' },
  { value: 'medium', label: 'Medium', description: 'Within 24 hours' },
  { value: 'low', label: 'Low', description: 'Within a week' },
] as const;

export function RequestForm() {
  const [formData, setFormData] = useState({
    required_blood_group: 'A+',
    urgency: 'medium' as 'high' | 'medium' | 'low',
    location: 'NodeA',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRequestId, setLastRequestId] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const request: RecipientRequest = {
      ...formData,
      id: `R${Date.now()}`,
    };

    const response = await api.submitRequest(request);
    
    setLoading(false);
    
    if (response.success) {
      setSuccess(true);
      setLastRequestId(request.id);
      setFormData({ required_blood_group: 'A+', urgency: 'medium', location: 'NodeA' });
      setTimeout(() => setSuccess(false), 4000);
    } else {
      setError(response.error || 'Failed to submit request');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>Submit Blood Request</h2>
        <p>Request blood for a patient in need</p>
      </div>

      <div className={styles.fields}>
        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Required Blood Group</label>
          <div className={styles.bloodGroupGrid}>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                className={`${styles.bloodChip} ${formData.required_blood_group === group ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, required_blood_group: group })}
                suppressHydrationWarning
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Urgency Level</label>
          <div className={styles.urgencyGrid}>
            {URGENCY_LEVELS.map((level) => (
              <button
                key={level.value}
                type="button"
                className={`${styles.urgencyCard} ${formData.urgency === level.value ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, urgency: level.value })}
                suppressHydrationWarning
              >
                <PulseCircle 
                  size="sm" 
                  color={level.value === 'high' ? 'rust' : level.value === 'medium' ? 'cream' : 'sage'} 
                  className={styles.pulseCircle}
                />
                <div className={styles.urgencyInfo}>
                  <span className={styles.urgencyLabel}>{level.label}</span>
                  <span className={styles.urgencyDesc}>{level.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Location</label>
          <div className={styles.locationGrid}>
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                className={`${styles.locationChip} ${formData.location === loc ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, location: loc })}
                suppressHydrationWarning
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <div className={styles.successText}>
            Request submitted successfully!
            {lastRequestId && (
              <span className={styles.requestId}>Request ID: {lastRequestId}</span>
            )}
          </div>
        </div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading}
      >
        {loading ? (
          <span className={styles.loadingDots}>
            <span>.</span><span>.</span><span>.</span>
          </span>
        ) : (
          'Submit Request'
        )}
      </button>
    </form>
  );
}