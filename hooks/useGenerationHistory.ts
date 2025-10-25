'use client';

import { useState, useEffect } from 'react';
import { getGenerations, deleteGeneration, Generation } from '@/lib/db/service';

export function useGenerationHistory() {
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const history = await getGenerations();
      setGenerations(history);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }

  async function removeGeneration(id: string) {
    try {
      await deleteGeneration(id);
      setGenerations(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Failed to delete generation:', error);
      throw error;
    }
  }

  function refresh() {
    loadHistory();
  }

  return { generations, loading, removeGeneration, refresh };
}