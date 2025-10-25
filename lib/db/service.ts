import { supabase } from '@/lib/supabase/client';
import { getSessionId } from '@/lib/session';

// Types
export interface Generation {
  id: string;
  session_id: string;
  feature_type: 'test-generator' | 'error-explainer' | 'bug-formatter';
  input_code: string;
  output_result: string;
  testing_mode?: string;
  test_framework?: string;
  component_framework?: string;
  backend_language?: string;
  input_length: number;
  output_length: number;
  generation_time_ms: number;
  created_at: string;
}

export interface UserPreferences {
  session_id: string;
  default_test_framework: string;
  default_component_framework: string;
  default_backend_language: string;
  default_testing_mode: string;
  theme: string;
}

// Initialize session
export async function initSession() {
  const sessionId = getSessionId();
  
  const { error } = await supabase
    .from('sessions')
    .upsert(
      { session_id: sessionId, last_active: new Date().toISOString() },
      { onConflict: 'session_id' }
    );
  
  if (error) console.error('Error initializing session:', error);
  return sessionId;
}

// User Preferences
export async function getUserPreferences(): Promise<UserPreferences | null> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('session_id', sessionId)
    .single();
  
  if (error) {
    console.error('Error fetching preferences:', error);
    return null;
  }
  
  return data;
}

export async function saveUserPreferences(preferences: Partial<UserPreferences>) {
  const sessionId = getSessionId();
  
  const { error } = await supabase
    .from('user_preferences')
    .upsert(
      { session_id: sessionId, ...preferences, updated_at: new Date().toISOString() },
      { onConflict: 'session_id' }
    );
  
  if (error) {
    console.error('Error saving preferences:', error);
    throw error;
  }
}

// Generations
export async function saveGeneration(generation: Omit<Generation, 'id' | 'session_id' | 'created_at'>) {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('generations')
    .insert({
      session_id: sessionId,
      ...generation,
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error saving generation:', error);
    throw error;
  }
  
  return data;
}

export async function getGenerations(limit = 10): Promise<Generation[]> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching generations:', error);
    return [];
  }
  
  return data || [];
}

export async function deleteGeneration(id: string) {
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting generation:', error);
    throw error;
  }
}
// ... (all your existing functions)

/**
 * Delete all generations for current user
 */
export async function deleteAllGenerations(): Promise<void> {
  const sessionId = getSessionId();
  
  const { error } = await supabase
    .from('generations')
    .delete()
    .eq('session_id', sessionId);
  
  if (error) {
    console.error('Error deleting all generations:', error);
    throw error;
  }
}

/**
 * Get statistics for current user
 */
export async function getGenerationStats(): Promise<{
  total: number;
  byType: Record<string, number>;
  totalInputLength: number;
  totalOutputLength: number;
  avgGenerationTime: number;
}> {
  const sessionId = getSessionId();
  
  const { data, error } = await supabase
    .from('generations')
    .select('feature_type, input_length, output_length, generation_time_ms')
    .eq('session_id', sessionId);
  
  if (error || !data) {
    console.error('Error fetching stats:', error);
    return {
      total: 0,
      byType: {},
      totalInputLength: 0,
      totalOutputLength: 0,
      avgGenerationTime: 0,
    };
  }
  
  const byType: Record<string, number> = {};
  let totalInputLength = 0;
  let totalOutputLength = 0;
  let totalTime = 0;
  
  data.forEach(gen => {
    byType[gen.feature_type] = (byType[gen.feature_type] || 0) + 1;
    totalInputLength += gen.input_length || 0;
    totalOutputLength += gen.output_length || 0;
    totalTime += gen.generation_time_ms || 0;
  });
  
  return {
    total: data.length,
    byType,
    totalInputLength,
    totalOutputLength,
    avgGenerationTime: data.length > 0 ? totalTime / data.length : 0,
  };
}