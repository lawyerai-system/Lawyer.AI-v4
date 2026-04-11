import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch on mount
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/api/admin/settings');
      if (res.data.success) {
        setSettings(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load platform settings", err);
    } finally {
      setLoading(false);
    }
  };

  const isMaintenanceMode = settings?.isMaintenanceMode || false;

  const isFeatureEnabled = (featureName) => {
    if (!settings) return true;
    return settings.general?.features?.[featureName] !== false;
  };

  return (
    <SettingsContext.Provider value={{ settings, isMaintenanceMode, loading, isFeatureEnabled, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
