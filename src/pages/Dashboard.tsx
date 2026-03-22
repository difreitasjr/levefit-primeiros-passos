import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import {
  mockUser,
  fraseDoDia,
  refeicoesDoDia,
  aguaDoDia,
  sonoDoDia,
  treinoDoDia,
  progressoSemanal,
  checkInRapido,
} from "@/data/mockData";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const frase = fraseDoDia[Math.floor(Date.now() / 86400000) % fraseDoDia.length];

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";

  const atalhos = [
    { icon: Utensils, label: "Alimentação", color: "bg-primary/10 text-primary", path: "/alimentacao" },
    { icon: Dumbbell, label: "Treino", color: "bg-accent/10 text-accent", path: "/treino" },
    { icon: TrendingUp, label: "Progresso", color: "bg-terracotta/10 text-terracotta", path: "/progresso" },
    { icon: Sparkles, label: "Desafios", color: "bg-primary/10 text-primary", path: "/desafios" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 space-y-4">
        <div className="animate-fade-up">
          <p className="text-sm text-muted-foreground font-medium">{saudacao},</p>
          <h1 className="text-2xl font-semibold text-foreground">{mockUser.nome} 💛</h1>
        </div>
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <p className="text-sm text-foreground leading-relaxed italic font-display">
            "{frase}"
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 space-y-4">
        {/* Meta do dia */}
        <DashCard title="Meta do dia" icon={Target} delay={120}>
          <p className="text-sm font-medium text-foreground">{mockUser.meta}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Sequência: {progressoSemanal.sequencia} dias 🔥
          </p>
        </DashCard>

        {/* Refeições */}
        <DashCard title="Refeições" icon={Utensils} delay={160} badge={`${refeicoesDoDia.filter(r => r.feito).length}/${refeicoesDoDia.length}`}>
          <div className="space-y-2.5">
            {refeicoesDoDia.map((r) => (
              <div key={r.tipo} className="flex items-start gap-3">
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors",
                  r.feito ? "border-accent bg-accent" : "border-border"
                )}>
                  {r.feito && <Check size={12} className="text-accent-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-medium", r.feito && "text-muted-foreground")}>{r.tipo}</p>
                    <span className="text-xs text-muted-foreground">{r.horario}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </DashCard>

        {/* Água e Sono side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <Droplets size={16} className="text-accent" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Água</span>
            </div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {(aguaDoDia.consumido / 1000).toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground">/{(aguaDoDia.meta / 1000).toFixed(1)}L</span>
            </p>
            <ProgressBar value={aguaDoDia.consumido} max={aguaDoDia.meta} variant="accent" size="sm" className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1.5">{aguaDoDia.copos}/{aguaDoDia.metaCopos} copos</p>
          </div>

          <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <Moon size={16} className="text-primary" />
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sono</span>
            </div>
            <p className="text-2xl font-semibold text-foreground tabular-nums">
              {sonoDoDia.horasDormidas}
              <span className="text-sm font-normal text-muted-foreground">/{sonoDoDia.metaHoras}h</span>
            </p>
            <ProgressBar value={sonoDoDia.horasDormidas} max={sonoDoDia.metaHoras} variant="primary" size="sm" className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1.5">{sonoDoDia.qualidade}</p>
          </div>
        </div>

        {/* Treino */}
        <DashCard title="Treino de hoje" icon={Dumbbell} delay={280}>
          <p className="text-sm font-medium text-foreground">{treinoDoDia.tipo}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-xs text-muted-foreground">⏱ {treinoDoDia.duracao}</span>
            <span className="text-xs text-muted-foreground">📊 {treinoDoDia.nivel}</span>
          </div>
          <div className="mt-3 space-y-2">
            {treinoDoDia.exercicios.slice(0, 3).map((e) => (
              <div key={e.nome} className="flex items-center justify-between text-xs">
                <span className="text-foreground">{e.nome}</span>
                <span className="text-muted-foreground">{e.series}</span>
              </div>
            ))}
            {treinoDoDia.exercicios.length > 3 && (
              <p className="text-xs text-primary font-medium">+{treinoDoDia.exercicios.length - 3} exercícios</p>
            )}
          </div>
        </DashCard>

        {/* Check-in */}
        <DashCard title="Como você está hoje?" icon={Sparkles} delay={320}>
          <div className="flex justify-between">
            {checkInRapido.opcoes.map((o) => (
              <button
                key={o.label}
                onClick={() => setSelectedMood(o.label)}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all active:scale-95",
                  selectedMood === o.label ? "bg-primary/10" : "hover:bg-secondary"
                )}
              >
                <span className="text-xl">{o.emoji}</span>
                <span className="text-[10px] text-muted-foreground font-medium">{o.label}</span>
              </button>
            ))}
          </div>
        </DashCard>

        {/* Progresso semanal */}
        <DashCard title="Progresso da semana" icon={Flame} delay={360}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-foreground">
              <span className="font-semibold">{progressoSemanal.diasCompletos}</span>
              <span className="text-muted-foreground">/{progressoSemanal.totalDias} dias</span>
            </p>
            <span className="text-xs text-accent font-semibold">
              {progressoSemanal.pesoInicio > progressoSemanal.pesoAtual ? "-" : "+"}
              {Math.abs(progressoSemanal.pesoInicio - progressoSemanal.pesoAtual).toFixed(1)}kg
            </span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(progressoSemanal.tarefas).map(([key, val]) => {
              const labels: Record<string, string> = {
                alimentacao: "Alimentação",
                agua: "Água",
                treino: "Treino",
                sono: "Sono",
              };
              return (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-foreground font-medium">{labels[key]}</span>
                    <span className="text-muted-foreground tabular-nums">{val}%</span>
                  </div>
                  <ProgressBar value={val} variant={val >= 80 ? "accent" : val >= 60 ? "primary" : "terracotta"} size="sm" />
                </div>
              );
            })}
          </div>
        </DashCard>

        {/* Atalhos */}
        <div className="grid grid-cols-4 gap-2 animate-fade-up" style={{ animationDelay: "400ms" }}>
          {atalhos.map((a) => (
            <button
              key={a.label}
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

// Reusable dashboard card
function DashCard({
  title,
  icon: Icon,
  badge,
  delay = 0,
  children,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  delay?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-card card-elevated rounded-2xl p-4 animate-fade-up"
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
