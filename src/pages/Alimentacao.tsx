import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
import { toast } from "sonner";

interface Refeicao {
  tipo: string;
  horario: string;
  descricao: string;
  calorias: number;
  proteina: number;
  carbs: number;
  gordura: number;
  feito: boolean;
  substituicoes: string[];
  observacao: string;
  favorita: boolean;
}

export default function Alimentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [refeicoes, setRefeicoes] = useState<Refeicao[]>(refeicoesDoDia);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const dicaIndex = Math.floor(Date.now() / 86400000) % dicasAlimentacao.length;
  const today = new Date().toISOString().split("T")[0];

  // Load saved meal states from DB
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data } = await supabase
        .from("meal_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("date", today);

      if (data && data.length > 0) {
        // Merge DB state into mock meals
        setRefeicoes((prev) =>
          prev.map((r) => {
            const saved = data.find((d) => d.tipo_refeicao === r.tipo);
            if (saved) {
              return { ...r, feito: saved.concluida, favorita: saved.favorita };
            }
            return r;
          })
        );
      }
      setLoading(false);
    };
    load();
  }, [user, today]);

  const saveMealState = async (refeicao: Refeicao) => {
    if (!user) return;
    await supabase.from("meal_logs").upsert(
      {
        user_id: user.id,
        date: today,
        tipo_refeicao: refeicao.tipo,
        concluida: refeicao.feito,
        favorita: refeicao.favorita,
        descricao: refeicao.descricao,
        calorias: refeicao.calorias,
        proteina: refeicao.proteina,
        carbs: refeicao.carbs,
        gordura: refeicao.gordura,
      },
      { onConflict: "user_id,date,tipo_refeicao" }
    );
  };

  const toggleFeito = async (index: number) => {
    const updated = refeicoes.map((r, i) =>
      i === index ? { ...r, feito: !r.feito } : r
    );
    setRefeicoes(updated);
    await saveMealState(updated[index]);
    toast.success(updated[index].feito ? "Refeição concluída! ✅" : "Refeição desmarcada");
  };

  const toggleFavorita = async (index: number) => {
    const updated = refeicoes.map((r, i) =>
      i === index ? { ...r, favorita: !r.favorita } : r
    );
    setRefeicoes(updated);
    await saveMealState(updated[index]);
    toast.success(updated[index].favorita ? "Salva como favorita 💛" : "Removida dos favoritos");
  };

  const totalCal = refeicoes.reduce((sum, r) => sum + r.calorias, 0);
  const feitasCal = refeicoes.filter((r) => r.feito).reduce((sum, r) => sum + r.calorias, 0);

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
            <h1 className="text-xl font-semibold text-foreground">Alimentação</h1>
            <p className="text-xs text-muted-foreground">Seu plano de hoje</p>
          </div>
        </div>

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

      <div className="px-5 space-y-3">
        {refeicoes.map((r, i) => {
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={r.tipo}
              className="bg-card card-elevated rounded-2xl overflow-hidden animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
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

              {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in">
                  <div className="bg-secondary/50 rounded-xl p-3">
                    <p className="text-sm text-foreground leading-relaxed">{r.descricao}</p>
                    <p className="text-xs text-muted-foreground mt-2">{r.calorias} kcal</p>
                  </div>

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

                  {r.observacao && (
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      💡 {r.observacao}
                    </p>
                  )}

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
                      className={cn("shrink-0", r.favorita && "text-primary")}
                      onClick={() => toggleFavorita(i)}
                    >
                      <Heart size={16} fill={r.favorita ? "currentColor" : "none"} />
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
