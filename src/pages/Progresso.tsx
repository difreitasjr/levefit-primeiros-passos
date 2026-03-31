import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { BottomNav } from "@/components/BottomNav";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ChevronLeft,
  TrendingDown,
  Ruler,
  Droplets,
  Moon,
  Dumbbell,
  Calendar,
  Award,
  Star,
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Progresso() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [checkinCount, setCheckinCount] = useState(0);
  const [workoutCount, setWorkoutCount] = useState(0);
  const [aguaMedia, setAguaMedia] = useState(0);
  const [sonoMedio, setSonoMedio] = useState(0);
  const [progressLogs, setProgressLogs] = useState<any[]>([]);
  const [conquistasData, setConquistasData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekStartStr = weekStart.toISOString().split("T")[0];

      const [profileRes, checkinsRes, workoutsRes, progressRes, waterRes, sleepRes] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle(),
          supabase
            .from("daily_checkins")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .gte("date", weekStartStr),
          supabase
            .from("daily_workouts")
            .select("id", { count: "exact" })
            .eq("user_id", user.id)
            .eq("completed", true)
            .gte("date", weekStartStr),
          supabase
            .from("progress_logs")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: true }),
          supabase
            .from("daily_water")
            .select("liters_consumed")
            .eq("user_id", user.id)
            .gte("date", weekStartStr),
          supabase
            .from("daily_sleep")
            .select("hours_slept")
            .eq("user_id", user.id)
            .gte("date", weekStartStr),
        ]);

      if (profileRes.data) setProfile(profileRes.data);
      setCheckinCount(checkinsRes.count || 0);
      setWorkoutCount(workoutsRes.count || 0);
      if (progressRes.data) setProgressLogs(progressRes.data);

      // Calcula médias reais da semana
      if (waterRes.data && waterRes.data.length > 0) {
        const total = waterRes.data.reduce((sum, d) => sum + (d.liters_consumed || 0), 0);
        setAguaMedia(parseFloat((total / waterRes.data.length).toFixed(1)));
      }
      if (sleepRes.data && sleepRes.data.length > 0) {
        const total = sleepRes.data.reduce((sum, d) => sum + (d.hours_slept || 0), 0);
        setSonoMedio(parseFloat((total / sleepRes.data.length).toFixed(1)));
      }

      setLoading(false);
    };
    load();
  }, [user]);

  // Peso
  const pesoAtual = profile?.peso_atual ?? null;
  const pesoInicial = profile?.peso_inicial ?? null;
  const pesoTotal =
    pesoInicial != null && pesoAtual != null
      ? parseFloat((pesoInicial - pesoAtual).toFixed(1))
      : null;

  // Gráfico de peso: usa progress_logs reais
  const pesoHistorico =
    progressLogs.length >= 2
      ? progressLogs
          .filter((l) => l.peso)
          .map((l, i) => ({ semana: `Sem ${i + 1}`, peso: l.peso }))
      : [];

  const maxPeso = pesoHistorico.length
    ? Math.max(...pesoHistorico.map((h) => h.peso))
    : 0;
  const minPeso = pesoHistorico.length
    ? Math.min(...pesoHistorico.map((h) => h.peso))
    : 0;
  const range = maxPeso - minPeso || 1;

  // Medidas reais
  const lastProgress =
    progressLogs.length > 0 ? progressLogs[progressLogs.length - 1] : null;
  const firstProgress = progressLogs.length > 0 ? progressLogs[0] : null;

  const medidas =
    lastProgress && firstProgress
      ? {
          cintura: {
            atual: lastProgress.cintura,
            inicial: firstProgress.cintura,
          },
          quadril: {
            atual: lastProgress.quadril,
            inicial: firstProgress.quadril,
          },
          braco: {
            atual: lastProgress.braco,
            inicial: firstProgress.braco,
          },
          coxa: {
            atual: lastProgress.coxa,
            inicial: firstProgress.coxa,
          },
        }
      : null;

  // Conquistas baseadas em dados reais
  const conquistas = [
    {
      titulo: "Primeira semana",
      descricao: "Completou sua primeira semana no LeveFit",
      icone: "⭐",
      conquistado: checkinCount >= 1,
    },
    {
      titulo: "7 check-ins",
      descricao: "Fez check-in por 7 dias esta semana",
      icone: "🔥",
      conquistado: checkinCount >= 7,
    },
    {
      titulo: "Hidratação em dia",
      descricao: "Registrou água por 5 dias esta semana",
      icone: "💧",
      conquistado: aguaMedia >= 1.5,
    },
    {
      titulo: "3 treinos na semana",
      descricao: "Completou 3 treinos esta semana",
      icone: "💪",
      conquistado: workoutCount >= 3,
    },
    {
      titulo: "Sono reparador",
      descricao: "Média de sono acima de 7h esta semana",
      icone: "🌙",
      conquistado: sonoMedio >= 7,
    },
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
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Progresso</h1>
            <p className="text-xs text-muted-foreground">Sua jornada até aqui</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">

        {/* Peso */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-accent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Peso
            </span>
          </div>

          {pesoAtual != null ? (
            <>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-3xl font-semibold text-foreground tabular-nums">
                    {pesoAtual}
                    <span className="text-sm font-normal text-muted-foreground">kg</span>
                  </p>
                  {pesoTotal != null && (
                    <p className="text-xs text-accent font-medium mt-0.5">
                      {pesoTotal > 0
                        ? `-${pesoTotal}kg desde o início`
                        : pesoTotal < 0
                        ? `+${Math.abs(pesoTotal)}kg desde o início`
                        : "Mesmo peso do início"}
                    </p>
                  )}
                </div>
                {pesoInicial != null && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Início</p>
                    <p className="text-sm font-medium text-foreground tabular-nums">
                      {pesoInicial}kg
                    </p>
                  </div>
                )}
              </div>

              {pesoHistorico.length >= 2 ? (
                <div className="flex items-end gap-1 h-24">
                  {pesoHistorico.map((h, i) => {
                    const height = ((maxPeso - h.peso) / range) * 100;
                    const isLast = i === pesoHistorico.length - 1;
                    return (
                      <div
                        key={h.semana}
                        className="flex-1 flex flex-col items-center gap-1"
                      >
                        <div className="w-full flex flex-col justify-end h-20">
                          <div
                            className={cn(
                              "w-full rounded-t-sm transition-all",
                              isLast ? "bg-primary" : "bg-primary/25"
                            )}
                            style={{
                              height: `${Math.max(15, 20 + height * 0.6)}%`,
                            }}
                          />
                        </div>
                        {(i === 0 ||
                          isLast ||
                          i === Math.floor(pesoHistorico.length / 2)) && (
                          <span className="text-[8px] text-muted-foreground tabular-nums">
                            {h.peso}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Registre seu peso periodicamente para ver a evolução no gráfico
                </p>
              )}
            </>
          ) : (
            <div className="py-4 text-center space-y-1">
              <Scale size={28} className="text-muted-foreground/40 mx-auto" />
              <p className="text-sm text-muted-foreground">
                Peso não cadastrado ainda
              </p>
              <button
                onClick={() => navigate("/perfil")}
                className="text-xs text-primary font-medium hover:underline"
              >
                Adicionar no perfil →
              </button>
            </div>
          )}
        </div>

        {/* Medidas */}
        {medidas ? (
          <div
            className="bg-card card-elevated rounded-2xl p-4 animate-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Ruler size={16} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Medidas
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(medidas).map(([key, val]) => {
                const labels: Record<string, string> = {
                  cintura: "Cintura",
                  quadril: "Quadril",
                  braco: "Braço",
                  coxa: "Coxa",
                };
                if (!val.atual) return null;
                const diff =
                  val.inicial && val.atual ? val.inicial - val.atual : 0;
                return (
                  <div key={key} className="bg-secondary/40 rounded-xl p-3">
                    <p className="text-xs text-muted-foreground">{labels[key]}</p>
                    <p className="text-lg font-semibold text-foreground tabular-nums">
                      {val.atual}
                      <span className="text-xs font-normal">cm</span>
                    </p>
                    {diff !== 0 && (
                      <p
                        className={cn(
                          "text-xs font-medium",
                          diff > 0 ? "text-accent" : "text-muted-foreground"
                        )}
                      >
                        {diff > 0 ? `-${diff}cm` : `+${Math.abs(diff)}cm`}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            className="bg-card card-elevated rounded-2xl p-4 animate-fade-up text-center py-6"
            style={{ animationDelay: "80ms" }}
          >
            <Ruler size={28} className="text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Nenhuma medida registrada ainda
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Em breve você poderá registrar suas medidas aqui
            </p>
          </div>
        )}

        {/* Adesão da semana */}
        <div
          className="bg-card card-elevated rounded-2xl p-4 animate-fade-up"
          style={{ animationDelay: "160ms" }}
        >
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Adesão da semana
          </span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatMini
              icon={Calendar}
              label="Check-ins"
              value={`${checkinCount}/7`}
              color="text-primary"
            />
            <StatMini
              icon={Droplets}
              label="Água média"
              value={aguaMedia > 0 ? `${aguaMedia}L` : "—"}
              color="text-accent"
            />
            <StatMini
              icon={Moon}
              label="Sono médio"
              value={sonoMedio > 0 ? `${sonoMedio}h` : "—"}
              color="text-primary"
            />
            <StatMini
              icon={Dumbbell}
              label="Treinos"
              value={`${workoutCount}/3`}
              color="text-terracotta"
            />
          </div>
        </div>

        {/* Conquistas */}
        <div
          className="bg-card card-elevated rounded-2xl p-4 animate-fade-up"
          style={{ animationDelay: "240ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Conquistas
            </span>
          </div>
          <div className="space-y-2.5">
            {conquistas.map((c) => (
              <div
                key={c.titulo}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  c.conquistado
                    ? "border-primary/20 bg-primary/5"
                    : "border-border opacity-50"
                )}
              >
                <span className="text-xl">{c.icone}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground">{c.descricao}</p>
                </div>
                {c.conquistado && (
                  <Star size={14} className="text-primary" fill="currentColor" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active={3} />
    </div>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-secondary/40 rounded-xl p-3 flex items-center gap-3">
      <Icon size={16} className={color} />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold text-foreground tabular-nums">{value}</p>
      </div>
    </div>
  );
}
