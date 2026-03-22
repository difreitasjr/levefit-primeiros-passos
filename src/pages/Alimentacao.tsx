import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { refeicoesDoDia, dicasAlimentacao } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Check,
  RefreshCw,
  Heart,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Alimentacao() {
  const navigate = useNavigate();
  const [refeicoes, setRefeicoes] = useState(refeicoesDoDia);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [favoritas, setFavoritas] = useState<Record<number, boolean>>({});
  const dicaIndex = Math.floor(Date.now() / 86400000) % dicasAlimentacao.length;

  const toggleFeito = (index: number) => {
    setRefeicoes((prev) =>
      prev.map((r, i) => (i === index ? { ...r, feito: !r.feito } : r))
    );
  };

  const toggleFavorita = (index: number) => {
    setFavoritas((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const totalCal = refeicoes.reduce((sum, r) => sum + r.calorias, 0);
  const feitasCal = refeicoes.filter((r) => r.feito).reduce((sum, r) => sum + r.calorias, 0);

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
            <h1 className="text-xl font-semibold text-foreground">Alimentação</h1>
            <p className="text-xs text-muted-foreground">Seu plano de hoje</p>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Calorias estimadas
              </p>
              <p className="text-2xl font-semibold text-foreground tabular-nums mt-1">
                {feitasCal}
                <span className="text-sm font-normal text-muted-foreground">
                  /{totalCal} kcal
                </span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">Concluídas</p>
              <p className="text-lg font-semibold text-primary tabular-nums">
                {refeicoes.filter((r) => r.feito).length}/{refeicoes.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meals */}
      <div className="px-5 space-y-3">
        {refeicoes.map((r, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={r.tipo}
              className="bg-card card-elevated rounded-2xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Header */}
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : i)}
                className="w-full flex items-center gap-3 p-4 text-left active:scale-[0.99] transition-transform"
              >
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    r.feito ? "border-accent bg-accent" : "border-border"
                  )}
                >
                  {r.feito && <Check size={12} className="text-accent-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={cn("text-sm font-semibold", r.feito && "text-muted-foreground")}>
                      {r.tipo}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{r.horario}</span>
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-muted-foreground" />
                      ) : (
                        <ChevronDown size={16} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{r.descricao}</p>
                </div>
              </button>

              {/* Expanded content */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in">
                  {/* Full description */}
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <p className="text-sm text-foreground leading-relaxed">{r.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-2">{r.calorias} kcal</p>
                  </div>

                  {/* Macros */}
                  <div className="flex gap-3">
                    {[
                      { label: "Proteína", val: `${r.proteina}g`, color: "text-accent" },
                      { label: "Carbs", val: `${r.carbs}g`, color: "text-primary" },
                      { label: "Gordura", val: `${r.gordura}g`, color: "text-terracotta" },
                    ].map((m) => (
                      <div key={m.label} className="flex-1 bg-secondary/40 rounded-xl p-2.5 text-center">
                        <p className={cn("text-sm font-semibold tabular-nums", m.color)}>{m.val}</p>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Observação */}
                  {r.observacao && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      💡 {r.observacao}
                    </p>
                  )}

                  {/* Substituições */}
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                      Substituições
                    </p>
                    <div className="space-y-1.5">
                      {r.substituicoes.map((sub) => (
                        <div
                          key={sub}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/40 text-xs text-foreground"
                        >
                          <RefreshCw size={12} className="text-muted-foreground shrink-0" />
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant={r.feito ? "soft" : "default"}
                      size="sm"
                      className="flex-1"
                      onClick={() => toggleFeito(i)}
                    >
                      <Check size={14} />
                      {r.feito ? "Concluída" : "Marcar concluída"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("shrink-0", favoritas[i] && "text-primary")}
                      onClick={() => toggleFavorita(i)}
                    >
                      <Heart size={16} fill={favoritas[i] ? "currentColor" : "none"} />
                    </Button>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <RefreshCw size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Dica do dia */}
        <div className="bg-primary/5 rounded-2xl p-4 flex gap-3 animate-fade-up" style={{ animationDelay: "400ms" }}>
          <Lightbulb size={18} className="text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary mb-1">Dica do dia</p>
            <p className="text-xs text-foreground leading-relaxed">
              {dicasAlimentacao[dicaIndex]}
            </p>
          </div>
        </div>
      </div>

      <BottomNav active={1} />
    </div>
  );
}
