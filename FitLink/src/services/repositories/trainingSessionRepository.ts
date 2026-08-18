import { supabase } from '../supabase';

export async function getTrainingSessionsByUserId(userId: number) {
  const { data, error } = await supabase
    .from('training_sessions')
    .select(`
      training_session_id,
      routine_id,
      duration,
      date,
      time,
      routines (
        name,
        routine_exercises (
          exercise_id
        )
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  return { sessions: data, error };
}
