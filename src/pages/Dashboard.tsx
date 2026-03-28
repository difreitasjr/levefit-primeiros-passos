import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useMeals, useWater, useSleep, useWorkouts, useCheckIn } from "@/hooks/useDailyData";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import {
  Droplets,
  Moon,
  Dumbbell,
  Utensils,
  TrendingUp,
  Sparkles,
  Check,
  ChevronRight,
  Flame,
  Target,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Profile {
  nome: string | null;
  objetivo: string | null;
  meta: string | null;
  peso_atual: number | null;
  onboarding_completed: boolean;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Dados reais do banco
  const mealsQuery = useMeals();
  const waterQuery = useWater();
  const sleepQuery = useSleep();
  const workoutsQuery = useWorkouts();
  const checkinQuery = useCheckIn();

  const fraseDoDia = [
    "Cuide perversamente parece corta. Você nega precisei ser direção, os precisos nem consultoria.",
    "A consistência é a chave para o sucesso!",
    "Você é mais forte do que pensa.",
    "Cada dia é uma nova oportunidade.",
  ];
  const frase = fraseDoDia[Math.floor(Date.now() / 86400000) % fraseDoDia.length];
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const [profileRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        if (!profileRes.data.onboarding_completed) {
          navigate("/onboarding");
          return;
        }
      }
      setLoading(false);
    };

    loadData();
  }, [user, navigate]);

  const displayName = profile?.nome || "você";
  const displayMeta = profile?.meta || "Definir sua meta";

  // Calcular dados das refeições
  const meals = mealsQuery.data || [];
  const mealsDone = meals.filter((m) => m.completed).length;
  const mealsTotal = meals.length || 4;

  // Calcular dados da água
  const waterData = waterQuery.data || {};
  const waterPercentage = Math.min(100, ((waterData.cups_consumed || 0) / 8) * 100);

  // Calcular dados do sono
  const sleepData = sleepQuery.data || {};
  const sleepPercentage = Math.min(100, ((sleepData.hours_slept || 0) / 8) * 100);

  // Dados do treino
  const workout = workoutsQuery.data;

  // Dados do check-in
  const checkin = checkinQuery.data;

  const atalhos = [
    { icon: Utensils, label: "Alimentação", color: "bg-primary/10 text-primary", path: "/alimentacao" },
    { icon: Dumbbell, label: "Treino", color: "bg-accent/10 text-accent", path: "/treino" },
    { icon: TrendingUp, label: "Progresso", color: "bg-terracotta/10 text-terracotta", path: "/progresso" },
    { icon: Sparkles, label: "Desafios", color: "bg-primary/10 text-primary", path: "/desafios" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between animate-fade-up">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{saudacao},</p>
            <h1 className="text-2xl font-semibold text-foreground">{displayName} 💛</h1>
          </div>
          <button
            onClick={() => navigate("/perfil")}
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/15 transition-colors active:scale-95"
          >
            <span className="text-sm font-semibold">{displayName.charAt(0).toUpperCase()}</span>
          </button>
        </div>
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
          <p className="text-sm text-foreground leading-relaxed italic font-display">
            "{frase}"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-4">
        {/* Meta do dia */}
        <DashCard title="Meta do dia" icon={Target} delay={120}>
          <p className="text-sm font-medium text-foreground">{displayMeta}</p>
        </DashCard>

        {/* Refeições */}
        <DashCard 
          title="Refeições" 
          icon={Utensils} 
          delay={160}
          badge={`${mealsDone}/${mealsTotal}`}
          onAction={() => navigate("/alimentacao")}
        >
          <div className="space-y-2.5">
            {meals.length > 0 ? (
              meals.map((meal) => (
                <div key={meal.id} className="flex items-start gap-3">
                  <button
                    onClick={() => mealsQuery.toggleMeal.mutate({ id: meal.id, completed: meal.completed })}
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                      meal.completed ? "border-accent bg-accent" : "border-border"
                    )}
                  >
                    {meal.completed && <Check size={12} className="text-accent-foreground" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", meal.completed && "text-muted-foreground")}>
                      {meal.meal_type}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{meal.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma refeição registrada</p>
            )}
            <button
              onClick={() => navigate("/alimentacao")}
              className="text-xs text-primary font-medium mt-2 flex items-center gap-1"
            >
              <Plus size={14} /> Adicionar refeição
            </button>
          </div>
        </DashCard>

        {/* Água e Sono */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={16} className="text-accent" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Água</span>
            </div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {waterData.cups_consumed || 0}
              <span className="text-sm font-normal text-muted-foreground">/8 copos</span>
            </p>
            <ProgressBar value={waterPercentage} variant="accent" size="sm" className="mt-2" />
            <button
              onClick={() => {
                const newCups = (waterData.cups_consumed || 0) + 1;
                waterQuery.addWater.mutate(newCups);
              }}
              className="text-xs text-primary font-medium mt-2 flex items-center gap-1"
            >
              <Plus size={12} /> Adicionar
            </button>
          </div>

          <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <Moon size={16} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sono</span>
            </div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {sleepData.hours_slept || 0}
              <span className="text-sm font-normal text-muted-foreground">/8h</span>
            </p>
            <ProgressBar value={sleepPercentage} variant="primary" size="sm" className="mt-2" />
            <button
              onClick={() => navigate("/treino")}
              className="text-xs text-primary font-medium mt-2 flex items-center gap-1"
            >
              <Plus size={12} /> Registrar
            </button>
          </div>
        </div>

        {/* Treino */}
        {workout && (
          <DashCard title="Treino de hoje" icon={Dumbbell} delay={280}>
            <p className="text-sm font-medium text-foreground">{workout.workout_type}</p>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-muted-foreground">⏱ {workout.duration_minutes || 0}min</span>
              <span className="text-xs text-muted-foreground">📊 {workout.level || "Não definido"}</span>
            </div>
            <button
              onClick={() => workoutsQuery.toggleWorkout.mutate({ id: workout.id, completed: workout.completed })}
              className={cn(
                "mt-3 w-full py-2 rounded-lg text-sm font-medium transition-colors",
                workout.completed
                  ? "bg-accent/20 text-accent"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              )}
            >
              {workout.completed ? "✓ Treino completo" : "Marcar como feito"}
            </button>
          </DashCard>
        )}

        {/* Check-in */}
        <button onClick={() => navigate("/checkin")} className="w-full text-left">
          <DashCard title={checkin ? "Check-in feito ✅" : "Como você está hoje?"} icon={Sparkles} delay={320}>
            {checkin ? (
              <p className="text-sm text-muted-foreground">
                Humor: {checkin.mood || "—"} · Energia: {checkin.energy_level || "—"}/5
              </p>
            ) : (
              <p className="text-xs text-primary font-medium">Fazer check-in →</p>
            )}
          </DashCard>
        </button>

        {/* Atalhos */}
        <div className="grid grid-cols-4 gap-2 animate-fade-up">
          {atalhos.map((a) => (
            <button
              key={a.label}
              onClick={() => navigate(a.path)}
              className="flex flex-col items-center gap-1.5 py-3 rounded-2xl bg-card card-elevated transition-all active:scale-95"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", a.color)}>
                <a.icon size={18} strokeWidth={1.8} />
              </div>
              <span className="text-[10px] font-medium text-muted-foreground">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active={0} />
    </div>
  );
}

function DashCard({
  title,
  icon: Icon,
  badge,
  delay = 0,
  onAction,
  children,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  delay?: number;
  onAction?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-card card-elevated rounded-2xl p-4 animate-fade-up cursor-pointer hover:shadow-md transition-shadow"
      onClick={onAction}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-primary" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
        </div>
        {badge && (
          <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{badge}</span>
        )}
        <ChevronRight size={16} className="text-muted-foreground/50" />
      </div>
      {children}
    </div>
  );
}
