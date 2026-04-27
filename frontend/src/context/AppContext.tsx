'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppState {
  activeTab: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

interface AppContextType extends AppState {
  setActiveTab: (tab: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState('donor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        loading,
        error,
        successMessage,
        setActiveTab,
        setLoading,
        setError,
        setSuccessMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}