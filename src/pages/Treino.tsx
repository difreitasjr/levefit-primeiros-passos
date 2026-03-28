import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '@/hooks/useDailyData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Dumbbell, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Treino() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: workout, toggleWorkout } = useWorkouts();
  
  const [workoutType, setWorkoutType] = useState('musculacao');
  const [duration, setDuration] = useState(60);
  const [level, setLevel] = useState('moderado');

  const workoutTypes = [
    { value: 'musculacao', label: '💪 Musculação' },
    { value: 'cardio', label: '🏃 Cardio' },
    { value: 'flexibilidade', label: '🧘 Flexibilidade' },
    { value: 'esportes', label: '⚽ Esportes' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Dumbbell size={20} className="text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Treino</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Treino Info */}
        {workout && (
          <div className="bg-accent/10 rounded-2xl p-6 space-y-4 border border-accent/20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">{workout.workout_type}</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  ⏱ {workout.duration_minutes}min · 📊 {workout.level}
                </p>
              </div>
              <button
                onClick={() => toggleWorkout.mutate({ id: workout.id, completed: workout.completed })}
                className={cn(
                  "px-3 py-2 rounded-lg text-xs font-medium transition-all",
                  workout.completed
                    ? "bg-accent/20 text-accent"
                    : "bg-primary/20 text-primary hover:bg-primary/30"
                )}
              >
                {workout.completed ? "✓ Completo" : "Marcar como feito"}
              </button>
            </div>

            {workout.workout_exercises && workout.workout_exercises.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-accent/20">
                <p className="text-xs font-medium text-muted-foreground">Exercícios:</p>
                {workout.workout_exercises.map((ex) => (
                  <div key={ex.id} className="text-xs text-foreground">
                    • {ex.exercise_name} {ex.sets && `- ${ex.sets}x${ex.reps}`}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Start */}
        <div className="bg-card card-elevated rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Iniciar treino rápido</h2>
          
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">
              Tipo de treino
            </Label>
            <Select value={workoutType} onValueChange={setWorkoutType}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {workoutTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration" className="text-sm font-medium">
              Duração (minutos)
            </Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="300"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm font-medium">
              Nível
            </Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderado">Moderado</SelectItem>
                <SelectItem value="intenso">Intenso</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="hero" className="w-full">
            <Plus size={16} className="mr-2" />
            Iniciar treino
          </Button>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">💡 Dica</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Realize exercícios regularmente para manter a saúde em dia. Comece aos poucos e vá aumentando a intensidade gradualmente.
          </p>
        </div>
      </div>
    </div>
  );
}
