'use client';

import { useState, useEffect } from 'react';
import { getUserPreferences, saveUserPreferences, UserPreferences } from '@/lib/db/service';

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  async function loadPreferences() {
    try {
      const prefs = await getUserPreferences();
      setPreferences(prefs);
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePreferences(updates: Partial<UserPreferences>) {
    try {
      await saveUserPreferences(updates);
      setPreferences(prev => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }

  return { preferences, loading, updatePreferences };
}