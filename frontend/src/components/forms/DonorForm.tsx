'use client';

import { useState, FormEvent } from 'react';
import { OrganicInput } from '../ui/OrganicInput';
import { api, Donor } from '@/lib/api';
import styles from './DonorForm.module.css';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const LOCATIONS = ['NodeA', 'NodeB', 'NodeC', 'NodeD'];

export function DonorForm() {
  const [formData, setFormData] = useState({
    name: '',
    blood_group: 'A+',
    location: 'NodeA',
    availability: true,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const donor: Donor = {
      ...formData,
      id: `D${Date.now()}`,
    };

    const response = await api.registerDonor(donor);
    
    setLoading(false);
    
    if (response.success) {
      setSuccess(true);
      setFormData({ name: '', blood_group: 'A+', location: 'NodeA', availability: true });
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(response.error || 'Failed to register donor');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h2>Register as Donor</h2>
        <p>Join our network of life-savers</p>
      </div>

      <div className={styles.fields}>
        <OrganicInput
          label="Your Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          suppressHydrationWarning
        />

        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>Blood Group</label>
          <div className={styles.bloodGroupGrid}>
            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                type="button"
                className={`${styles.bloodChip} ${formData.blood_group === group ? styles.active : ''}`}
                onClick={() => setFormData({ ...formData, blood_group: group })}
                suppressHydrationWarning
              >
                {group}
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

        <label className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            checked={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.checked })}
            suppressHydrationWarning
          />
          <span className={styles.checkbox}>
            {formData.availability && <span className={styles.checkmark}>✓</span>}
          </span>
          <span>Available for donation</span>
        </label>
      </div>

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>!</span>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.success}>
          <div className={styles.successCircle}>✓</div>
          Donor registered successfully!
        </div>
      )}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !formData.name}
      >
        {loading ? (
          <span className={styles.loadingDots}>
            <span>.</span><span>.</span><span>.</span>
          </span>
        ) : (
          'Register as Donor'
        )}
      </button>
    </form>
  );
}