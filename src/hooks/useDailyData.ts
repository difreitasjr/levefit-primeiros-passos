import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const today = new Date().toISOString().split('T')[0];

// ===== MEALS =====
export function useMeals() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['meals', user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_meals')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user?.id,
  });

  const addMeal = useMutation({
    mutationFn: async (meal: { meal_type: string; description: string }) => {
      const { data, error } = await supabase
        .from('daily_meals')
        .insert([{
          user_id: user?.id,
          date: today,
          ...meal,
          completed: false,
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  const toggleMeal = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('daily_meals')
        .update({ completed: !completed })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meals'] });
    },
  });

  return { ...query, addMeal, toggleMeal };
}

// ===== WATER =====
export function useWater() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['water', user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_water')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      return data || { cups_consumed: 0, liters_consumed: 0 };
    },
    enabled: !!user?.id,
  });

  const addWater = useMutation({
    mutationFn: async (cups: number) => {
      const liters = parseFloat((cups * 0.25).toFixed(2));

      // Tenta buscar registro existente
      const { data: existing } = await supabase
        .from('daily_water')
        .select('id')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();

      if (existing?.id) {
        // Atualiza se já existe
        const { error } = await supabase
          .from('daily_water')
          .update({ cups_consumed: cups, liters_consumed: liters })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Insere se não existe
        const { error } = await supabase
          .from('daily_water')
          .insert({
            user_id: user?.id,
            date: today,
            cups_consumed: cups,
            liters_consumed: liters,
          });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['water'] });
    },
  });

  return { ...query, addWater };
}


// ===== SLEEP =====
export function useSleep() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['sleep', user?.id, today],
    queryFn: async () => {
      let { data, error } = await supabase
        .from('daily_sleep')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data || { hours_slept: 0, quality: 'regular' };
    },
    enabled: !!user?.id,
  });

  const updateSleep = useMutation({
    mutationFn: async ({ hours, quality }: { hours: number; quality: string }) => {
      const { error } = await supabase
        .from('daily_sleep')
        .upsert({
          user_id: user?.id,
          date: today,
          hours_slept: hours,
          quality,
        }, { onConflict: 'user_id, date' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sleep'] });
    },
  });

  return { ...query, updateSleep };
}

// ===== WORKOUTS =====
export function useWorkouts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['workouts', user?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_workouts')
        .select(`
          *,
          workout_exercises(*)
        `)
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    },
    enabled: !!user?.id,
  });

  const toggleWorkout = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from('daily_workouts')
        .update({ completed: !completed })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workouts'] });
    },
  });

  return { ...query, toggleWorkout };
}

// ===== CHECK-IN =====
export function useCheckIn() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['checkin', user?.id, today],
    queryFn: async () => {
      let { data, error } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .eq('date', today)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return data;
    },
    enabled: !!user?.id,
  });

  const saveCheckIn = useMutation({
    mutationFn: async ({ mood, energy_level, notes }: { mood: string; energy_level: number; notes?: string }) => {
      const { error } = await supabase
        .from('daily_checkins')
        .upsert({
          user_id: user?.id,
          date: today,
          mood,
          energy_level,
          notes,
        }, { onConflict: 'user_id, date' });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['checkin'] });
    },
  });

  return { ...query, saveCheckIn };
}
