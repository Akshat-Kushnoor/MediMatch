'use client';

import { useState } from 'react';
import { AppProvider } from '@/context/AppContext';
import { BlobBackground } from '@/components/ui/BlobBackground';
import { DonorForm } from '@/components/forms/DonorForm';
import { RequestForm } from '@/components/forms/RequestForm';
import { HospitalFinder } from '@/components/forms/HospitalFinder';
import { MatchResults } from '@/components/display/MatchResults';
import styles from './page.module.css';

const TABS = [
  { id: 'donor', label: 'Register Donor', icon: '💉' },
  { id: 'request', label: 'Blood Request', icon: '🩸' },
  { id: 'hospital', label: 'Find Hospital', icon: '🏥' },
  { id: 'match', label: 'Find Match', icon: '🔗' },
];

function Dashboard() {
  const [activeTab, setActiveTab] = useState('donor');

  return (
    <div className={styles.page}>
      <BlobBackground>
        <header className={styles.header}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>❤️</span>
            <div className={styles.logoText}>
              <h1>MediMatch</h1>
              <span>Blood Donation Network</span>
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.hero}>
            <h2>Connect Lives, Save Futures</h2>
            <p>
              Our intelligent matching system connects donors with recipients 
              efficiently, ensuring life-saving blood reaches those in need.
            </p>
          </div>

          <nav className={styles.nav}>
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                className={`${styles.navBtn} ${activeTab === tab.id ? styles.active : ''} ${styles[`delay${index}`]}`}
                onClick={() => setActiveTab(tab.id)}
                suppressHydrationWarning
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
          </nav>

          <div className={styles.content}>
            <div className={`${styles.panel} animate-reveal`}>
              {activeTab === 'donor' && <DonorForm />}
              {activeTab === 'request' && <RequestForm />}
              {activeTab === 'hospital' && <HospitalFinder />}
              {activeTab === 'match' && <MatchResults />}
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <p>Powered by Dijkstra's Algorithm + Greedy Matching</p>
        </footer>
      </BlobBackground>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}