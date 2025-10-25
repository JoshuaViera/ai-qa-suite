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