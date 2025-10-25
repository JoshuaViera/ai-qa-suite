'use client';

import { useEffect, useState } from 'react';
import { initSession } from '@/lib/db/service';

export function SessionInitializer() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await initSession();
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize session:', error);
      }
    }
    
    init();
  }, []);

  // This component doesn't render anything
  // It just initializes the session in the background
  return null;
}