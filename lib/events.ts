/**
 * Trigger a live update across all components listening for generation changes
 * Call this after successfully saving a generation to the database
 */
export function notifyGenerationCreated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('generation-created'));
  }
}

/**
 * Trigger a stats refresh
 */
export function notifyStatsUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('stats-updated'));
  }
}