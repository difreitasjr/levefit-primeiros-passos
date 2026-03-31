import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkouts } from '@/hooks/useDailyData';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Dumbbell, Check, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// ✅ Treinos prontos por grupo muscular
const TREINOS_PRONTOS = [
  {
    id: 'peito_triceps',
    label: '💪 Peito e Tríceps',
    tipo: 'musculacao',
    duracao: 50,
    nivel: 'moderado',
    exercicios: [
      { nome: 'Supino reto', series: '3x12' },
      { nome: 'Supino inclinado', series: '3x10' },
      { nome: 'Crucifixo', series: '3x12' },
      { nome: 'Tríceps corda', series: '3x15' },
      { nome: 'Tríceps testa', series: '3x12' },
      { nome: 'Mergulho (paralelas)', series: '3x10' },
    ],
  },
  {
    id: 'costas_biceps',
    label: '🔙 Costas e Bíceps',
    tipo: 'musculacao',
    duracao: 50,
    nivel: 'moderado',
    exercicios: [
      { nome: 'Puxada frontal', series: '3x12' },
      { nome: 'Remada curvada', series: '3x12' },
      { nome: 'Remada unilateral', series: '3x10' },
      { nome: 'Pull-down', series: '3x12' },
      { nome: 'Rosca direta', series: '3x12' },
      { nome: 'Rosca alternada', series: '3x12' },
    ],
  },
  {
    id: 'pernas_gluteos',
    label: '🦵 Pernas e Glúteos',
    tipo: 'musculacao',
    duracao: 60,
    nivel: 'moderado',
    exercicios: [
      { nome: 'Agachamento livre', series: '4x12' },
      { nome: 'Leg press', series: '4x12' },
      { nome: 'Afundo', series: '3x12' },
      { nome: 'Extensora', series: '3x15' },
      { nome: 'Flexora', series: '3x15' },
      { nome: 'Elevação pélvica', series: '4x15' },
      { nome: 'Panturrilha em pé', series: '3x20' },
    ],
  },
  {
    id: 'ombro_trapezio',
    label: '🏋️ Ombro e Trapézio',
    tipo: 'musculacao',
    duracao: 45,
    nivel: 'moderado',
    exercicios: [
      { nome: 'Desenvolvimento com halteres', series: '4x12' },
      { nome: 'Elevação lateral', series: '3x15' },
      { nome: 'Elevação frontal', series: '3x12' },
      { nome: 'Crucifixo invertido', series: '3x12' },
      { nome: 'Encolhimento de ombros', series: '3x15' },
    ],
  },
  {
    id: 'cardio',
    label: '🏃 Cardio',
    tipo: 'cardio',
    duracao: 40,
    nivel: 'moderado',
    exercicios: [
      { nome: 'Aquecimento caminhada', series: '5 min' },
      { nome: 'Corrida leve', series: '10 min' },
      { nome: 'Intervalado (1min forte / 1min leve)', series: '10x' },
      { nome: 'Polichinelos', series: '3x30' },
      { nome: 'Pular corda', series: '3x2min' },
      { nome: 'Desaceleração caminhada', series: '5 min' },
    ],
  },
  {
    id: 'flexibilidade',
    label: '🧘 Flexibilidade e Core',
    tipo: 'flexibilidade',
    duracao: 30,
    nivel: 'leve',
    exercicios: [
      { nome: 'Prancha frontal', series: '3x40s' },
      { nome: 'Prancha lateral', series: '3x30s' },
      { nome: 'Abdominal crunch', series: '3x20' },
      { nome: 'Alongamento posterior', series: '3x30s' },
      { nome: 'Alongamento quadríceps', series: '3x30s' },
      { nome: 'Alongamento ombros', series: '3x30s' },
      { nome: 'Respiração profunda', series: '2 min' },
    ],
  },
];

export default function Treino() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: workout, toggleWorkout } = useWorkouts();

  const [treinoSelecionado, setTreinoSelecionado] = useState<string | null>(null);
  const [expandido, setExpandido] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Exercício extra manual
  const [mostrarExtra, setMostrarExtra] = useState(false);
  const [extraNome, setExtraNome] = useState('');
  const [extraSeries, setExtraSeries] = useState('');
  const [exerciciosExtras, setExerciciosExtras] = useState<{ nome: string; series: string }[]>([]);

  const treino = TREINOS_PRONTOS.find((t) => t.id === treinoSelecionado);

  const adicionarExtra = () => {
    if (!extraNome.trim()) return;
    setExerciciosExtras((prev) => [
      ...prev,
      { nome: extraNome.trim(), series: extraSeries.trim() || '3x12' },
    ]);
    setExtraNome('');
    setExtraSeries('');
    setMostrarExtra(false);
  };

  const removerExtra = (index: number) => {
    setExerciciosExtras((prev) => prev.filter((_, i) => i !== index));
  };

  const salvarTreino = async () => {
    if (!treino || !user) return;
    setSalvando(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const todosExercicios = [
        ...treino.exercicios,
        ...exerciciosExtras,
      ];

      // Salva o treino
      const { data: workoutData, error: workoutError } = await supabase
        .from('daily_workouts')
        .upsert(
          {
            user_id: user.id,
            date: today,
            workout_type: treino.label,
            duration_minutes: treino.duracao,
            level: treino.nivel,
            completed: false,
          },
          { onConflict: 'user_id, date' }
        )
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Salva os exercícios
      if (workoutData?.id) {
        await supabase
          .from('workout_exercises')
          .delete()
          .eq('workout_id', workoutData.id);

        const exerciciosParaSalvar = todosExercicios.map((ex) => ({
          workout_id: workoutData.id,
          exercise_name: ex.nome,
          sets: ex.series,
        }));

        const { error: exError } = await supabase
          .from('workout_exercises')
          .insert(exerciciosParaSalvar);

        if (exError) throw exError;
      }

      toast.success('Treino salvo com sucesso! 💪');
      setTreinoSelecionado(null);
      setExerciciosExtras([]);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Erro ao salvar treino. Tente novamente.');
      console.error(err);
    } finally {
      setSalvando(false);
    }
  };

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

      <div className="px-5 py-6 space-y-6">

        {/* Treino do dia já salvo */}
        {workout && (
          <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Treino de hoje
                </p>
                <p className="text-sm font-semibold text-foreground">{workout.workout_type}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ⏱ {workout.duration_minutes}min · 📊 {workout.level}
                </p>
              </div>
              <button
                onClick={() => toggleWorkout.mutate({ id: workout.id, completed: workout.completed })}
                className={cn(
                  'px-3 py-2 rounded-lg text-xs font-medium transition-all',
                  workout.completed
                    ? 'bg-accent/20 text-accent'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
                )}
              >
                {workout.completed ? '✓ Completo' : 'Marcar como feito'}
              </button>
            </div>

            {workout.workout_exercises && workout.workout_exercises.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-accent/20">
                <p className="text-xs font-medium text-muted-foreground mb-2">Exercícios:</p>
                {workout.workout_exercises.map((ex: any) => (
                  <div key={ex.id} className="flex items-center justify-between text-xs text-foreground py-1">
                    <span>• {ex.exercise_name}</span>
                    {ex.sets && (
                      <span className="text-muted-foreground font-medium">{ex.sets}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Escolher treino */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-3">
            {workout ? 'Trocar treino do dia' : 'Escolha seu treino de hoje'}
          </p>
          <div className="space-y-2">
            {TREINOS_PRONTOS.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'bg-card card-elevated rounded-2xl overflow-hidden transition-all',
                  treinoSelecionado === t.id && 'ring-2 ring-primary'
                )}
              >
                {/* Cabeçalho do treino */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  onClick={() => {
                    setTreinoSelecionado(treinoSelecionado === t.id ? null : t.id);
                    setExpandido(expandido === t.id ? null : t.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                        treinoSelecionado === t.id
                          ? 'border-primary bg-primary'
                          : 'border-border'
                      )}
                    >
                      {treinoSelecionado === t.id && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.label}</p>
                      <p className="text-xs text-muted-foreground">
                        ⏱ {t.duracao}min · {t.exercicios.length} exercícios
                      </p>
                    </div>
                  </div>
                  {expandido === t.id ? (
                    <ChevronUp size={16} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={16} className="text-muted-foreground" />
                  )}
                </button>

                {/* Lista de exercícios expandida */}
                {expandido === t.id && (
                  <div className="px-4 pb-3 border-t border-border/50 pt-2 space-y-1">
                    {t.exercicios.map((ex, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-xs py-1"
                      >
                        <span className="text-foreground">• {ex.nome}</span>
                        <span className="text-muted-foreground font-medium">{ex.series}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Exercícios extras */}
        {treinoSelecionado && (
          <div className="bg-card card-elevated rounded-2xl p-4 space-y-3">
            <p className="text-sm font-semibold text-foreground">
              ➕ Exercícios extras <span className="text-muted-foreground font-normal">(opcional)</span>
            </p>

            {exerciciosExtras.map((ex, i) => (
              <div key={i} className="flex items-center justify-between bg-secondary/40 rounded-xl px-3 py-2">
                <div>
                  <p className="text-sm text-foreground">{ex.nome}</p>
                  <p className="text-xs text-muted-foreground">{ex.series}</p>
                </div>
                <button
                  onClick={() => removerExtra(i)}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            {mostrarExtra ? (
              <div className="space-y-2">
                <Input
                  placeholder="Nome do exercício (ex: Supino inclinado)"
                  value={extraNome}
                  onChange={(e) => setExtraNome(e.target.value)}
                  className="h-10 rounded-xl text-sm"
                  autoFocus
                />
                <Input
                  placeholder="Séries (ex: 3x12)"
                  value={extraSeries}
                  onChange={(e) => setExtraSeries(e.target.value)}
                  className="h-10 rounded-xl text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && adicionarExtra()}
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1"
                    onClick={() => setMostrarExtra(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={adicionarExtra}
                    disabled={!extraNome.trim()}
                  >
                    Adicionar
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setMostrarExtra(true)}
                className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
              >
                <Plus size={14} /> Adicionar exercício extra
              </button>
            )}
          </div>
        )}

        {/* Botão salvar */}
        {treinoSelecionado && (
          <Button
            variant="hero"
            className="w-full"
            onClick={salvarTreino}
            disabled={salvando}
          >
            {salvando ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Dumbbell size={16} className="mr-2" />
            )}
            {salvando ? 'Salvando...' : 'Salvar treino do dia 💪'}
          </Button>
        )}

        {/* Dica */}
        <div className="bg-primary/5 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">💡 Dica</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Escolha um treino, expanda para ver os exercícios e adicione extras se quiser. Após concluir, marque como feito no Dashboard!
          </p>
        </div>
      </div>
    </div>
  );
}
