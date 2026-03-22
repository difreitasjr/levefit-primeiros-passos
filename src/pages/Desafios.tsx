import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { desafios } from "@/data/mockData";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ChevronLeft,
  Flame,
  Trophy,
  Target,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Desafios() {
  const navigate = useNavigate();
  const d = desafios;

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
            <h1 className="text-xl font-semibold text-foreground">Desafios</h1>
            <p className="text-xs text-muted-foreground">Conquiste, celebre, continue</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Streak */}
        <div className="bg-card card-elevated rounded-2xl p-5 text-center animate-fade-up">
          <span className="text-4xl">{d.streak.emoji}</span>
          <p className="text-3xl font-semibold text-foreground mt-2 tabular-nums">{d.streak.atual}</p>
          <p className="text-xs text-muted-foreground font-medium">dias seguidos</p>
          <p className="text-xs text-muted-foreground mt-1">
            Melhor sequência: {d.streak.melhor} dias
          </p>
        </div>

        {/* Desafio semanal */}
        <div className="bg-primary/5 rounded-2xl p-4 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Target size={16} className="text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Desafio da semana</span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{d.desafioSemanal.titulo}</h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{d.desafioSemanal.descricao}</p>
          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-foreground font-medium">{d.desafioSemanal.progresso}/{d.desafioSemanal.total} dias</span>
              <span className="text-muted-foreground tabular-nums">
                {Math.round((d.desafioSemanal.progresso / d.desafioSemanal.total) * 100)}%
              </span>
            </div>
            <ProgressBar value={d.desafioSemanal.progresso} max={d.desafioSemanal.total} variant="primary" />
          </div>
          <p className="text-xs text-primary font-medium mt-2">🏅 {d.desafioSemanal.recompensa}</p>
        </div>

        {/* Missões de constância */}
        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-terracotta" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Missões de constância</span>
          </div>
          <div className="space-y-2.5">
            {d.missoesConstancia.map((m) => (
              <div
                key={m.titulo}
                className={cn(
                  "bg-card card-elevated rounded-2xl p-4",
                  m.completa && "opacity-75"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{m.icone}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className={cn("text-sm font-semibold text-foreground", m.completa && "line-through")}>
                        {m.titulo}
                      </p>
                      {m.completa && (
                        <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <Check size={12} className="text-accent-foreground" />
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.descricao}</p>
                    {!m.completa && (
                      <div className="mt-2 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground tabular-nums">{m.progresso}/{m.total}</span>
                        </div>
                        <ProgressBar
                          value={m.progresso}
                          max={m.total}
                          variant={m.progresso / m.total >= 0.7 ? "accent" : "primary"}
                          size="sm"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medalhas */}
        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <div className="flex items-center gap-2 mb-3">
            <Trophy size={16} className="text-primary" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medalhas</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {d.medalhas.map((m) => (
              <div
                key={m.nome}
                className={cn(
                  "bg-card card-elevated rounded-2xl p-3 text-center transition-all",
                  !m.conquistada && "opacity-40 grayscale"
                )}
              >
                <span className="text-2xl block mb-1">{m.icone}</span>
                <p className="text-[10px] font-semibold text-foreground leading-tight">{m.nome}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5 leading-tight">{m.descricao}</p>
                {m.conquistada && m.data && (
                  <p className="text-[9px] text-primary font-medium mt-1">{m.data}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active={4} />
    </div>
  );
}
