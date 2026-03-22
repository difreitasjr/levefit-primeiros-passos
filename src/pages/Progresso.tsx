import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { progressoDetalhado, mockUser } from "@/data/mockData";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Progresso() {
  const navigate = useNavigate();
  const p = progressoDetalhado;
  const pesoTotal = mockUser.pesoInicial - mockUser.pesoAtual;

  // Simple chart — bar chart representation
  const maxPeso = Math.max(...p.pesoHistorico.map((h) => h.peso));
  const minPeso = Math.min(...p.pesoHistorico.map((h) => h.peso));
  const range = maxPeso - minPeso || 1;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
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
        {/* Weight card */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={16} className="text-accent" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Peso</span>
          </div>
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-3xl font-semibold text-foreground tabular-nums">
                {mockUser.pesoAtual}
                <span className="text-sm font-normal text-muted-foreground">kg</span>
              </p>
              <p className="text-xs text-accent font-medium mt-0.5">
                -{pesoTotal.toFixed(1)}kg desde o início
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Início</p>
              <p className="text-sm font-medium text-foreground tabular-nums">{mockUser.pesoInicial}kg</p>
            </div>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end gap-1 h-24">
            {p.pesoHistorico.map((h, i) => {
              const height = ((maxPeso - h.peso) / range) * 100;
              const isLast = i === p.pesoHistorico.length - 1;
              return (
                <div key={h.semana} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end h-20">
                    <div
                      className={cn(
                        "w-full rounded-t-sm transition-all",
                        isLast ? "bg-primary" : "bg-primary/25"
                      )}
                      style={{
                        height: `${Math.max(15, 20 + height * 0.6)}%`,
                        animation: "progress-fill 0.8s ease-out",
                      }}
                    />
                  </div>
                  {(i === 0 || isLast || i === Math.floor(p.pesoHistorico.length / 2)) && (
                    <span className="text-[8px] text-muted-foreground tabular-nums">{h.peso}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Medidas */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Ruler size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medidas</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(p.medidas).map(([key, val]) => {
              const labels: Record<string, string> = {
                cintura: "Cintura",
                quadril: "Quadril",
                braco: "Braço",
                coxa: "Coxa",
              };
              const diff = val.inicial - val.atual;
              return (
                <div key={key} className="bg-secondary/40 rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">{labels[key]}</p>
                  <p className="text-lg font-semibold text-foreground tabular-nums">
                    {val.atual}<span className="text-xs font-normal">cm</span>
                  </p>
                  <p className="text-xs text-accent font-medium">-{diff}cm</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Adesão da semana */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Adesão da semana</span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <StatMini icon={Calendar} label="Check-ins" value={`${p.semanaAtual.diasCheckIn}/${p.semanaAtual.totalDias}`} color="text-primary" />
            <StatMini icon={Droplets} label="Água média" value={`${p.semanaAtual.aguaMedia}L`} color="text-accent" />
            <StatMini icon={Moon} label="Sono médio" value={`${p.semanaAtual.sonoMedio}h`} color="text-primary" />
            <StatMini icon={Dumbbell} label="Treinos" value={`${p.semanaAtual.treinosConcluidos}/${p.semanaAtual.treinosMeta}`} color="text-terracotta" />
          </div>
        </div>

        {/* Conquistas */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Award size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conquistas</span>
          </div>
          <div className="space-y-2.5">
            {p.conquistas.map((c) => (
              <div
                key={c.titulo}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                  c.conquistado ? "border-primary/20 bg-primary/5" : "border-border opacity-50"
                )}
              >
                <span className="text-xl">{c.icone}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{c.titulo}</p>
                  <p className="text-xs text-muted-foreground">{c.descricao}</p>
                </div>
                {c.conquistado && <Star size={14} className="text-primary" fill="currentColor" />}
              </div>
            ))}
          </div>
        </div>

        {/* Vitórias não ligadas à balança */}
        <div className="bg-primary/5 rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            Vitórias além da balança 💛
          </p>
          <div className="space-y-2">
            {p.vitoriasNaoBalanca.map((v) => (
              <div key={v} className="flex items-center gap-2 text-sm text-foreground">
                <span className="text-primary">✓</span>
                {v}
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
