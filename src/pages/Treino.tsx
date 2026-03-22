import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { treinoCompleto } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import {
  ChevronLeft,
  Check,
  Flame,
  Timer,
  Gauge,
  Footprints,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Treino() {
  const navigate = useNavigate();
  const [treino, setTreino] = useState(treinoCompleto);
  const [showComplete, setShowComplete] = useState(false);
  const [showCantToday, setShowCantToday] = useState(false);

  const allExercicios = [
    ...treino.aquecimento.map((e) => ({ ...e, secao: "aquecimento" })),
    ...treino.principal.map((e) => ({ ...e, secao: "principal" })),
    ...treino.finalizacao.map((e) => ({ ...e, secao: "finalizacao" })),
  ];
  const totalFeitos = allExercicios.filter((e) => e.feito).length;
  const totalExercicios = allExercicios.length;

  const toggleExercicio = (secao: string, index: number) => {
    setTreino((prev) => {
      const key = secao as "aquecimento" | "principal" | "finalizacao";
      const updated = [...prev[key]];
      updated[index] = { ...updated[index], feito: !updated[index].feito };
      return { ...prev, [key]: updated };
    });
  };

  const handleComplete = () => setShowComplete(true);
  const handleCantToday = () => setShowCantToday(true);

  if (showComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <div className="text-center space-y-4 animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-accent/15 flex items-center justify-center mx-auto">
            <Sparkles className="text-accent" size={36} strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-display font-semibold text-foreground">
            Treino concluído! 🎉
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mx-auto">
            Você completou seu treino de hoje. Cada sessão te deixa mais forte e mais perto do seu objetivo.
          </p>
          <Button variant="hero" className="w-full max-w-xs" onClick={() => navigate("/dashboard")}>
            Voltar para Hoje
          </Button>
        </div>
        <BottomNav active={2} />
      </div>
    );
  }

  if (showCantToday) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setShowCantToday(false)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
            >
              <ChevronLeft size={22} />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Movimento alternativo</h1>
          </div>
        </div>
        <div className="px-5 animate-fade-up">
          <div className="bg-card card-elevated rounded-2xl p-5 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
              <Footprints className="text-accent" size={26} />
            </div>
            <h2 className="text-lg font-semibold text-foreground">{treino.alternativa.tipo}</h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Timer size={13} /> {treino.alternativa.duracao}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {treino.alternativa.descricao}
            </p>
            <Button variant="accent" className="w-full" onClick={() => navigate("/dashboard")}>
              Feito! Voltei da caminhada 🚶‍♀️
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4 italic">
            Tudo bem não treinar hoje. Movimento é movimento, do seu jeito.
          </p>
        </div>
        <BottomNav active={2} />
      </div>
    );
  }

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
            <h1 className="text-xl font-semibold text-foreground">Treino</h1>
            <p className="text-xs text-muted-foreground">{treino.tipo}</p>
          </div>
        </div>

        {/* Overview */}
        <div className="bg-card card-elevated rounded-2xl p-4 animate-fade-up">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Timer size={14} /> {treino.duracao}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Gauge size={14} /> {treino.nivel}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Flame size={14} /> {totalFeitos}/{totalExercicios}
            </div>
          </div>
          <ProgressBar value={totalFeitos} max={totalExercicios} variant="accent" size="sm" />
        </div>
      </div>

      {/* Sections */}
      <div className="px-5 space-y-5">
        {/* Aquecimento */}
        <Section title="🔥 Aquecimento" delay={80}>
          {treino.aquecimento.map((e, i) => (
            <ExercicioRow
              key={e.nome}
              nome={e.nome}
              detalhe={e.duracao}
              feito={e.feito}
              onToggle={() => toggleExercicio("aquecimento", i)}
            />
          ))}
        </Section>

        {/* Principal */}
        <Section title="💪 Treino principal" delay={160}>
          {treino.principal.map((e, i) => (
            <ExercicioRow
              key={e.nome}
              nome={e.nome}
              detalhe={`${e.series} · ${e.descanso} descanso`}
              feito={e.feito}
              onToggle={() => toggleExercicio("principal", i)}
            />
          ))}
        </Section>

        {/* Finalização */}
        <Section title="🧘‍♀️ Finalização" delay={240}>
          {treino.finalizacao.map((e, i) => (
            <ExercicioRow
              key={e.nome}
              nome={e.nome}
              detalhe={e.duracao}
              feito={e.feito}
              onToggle={() => toggleExercicio("finalizacao", i)}
            />
          ))}
        </Section>

        {/* Actions */}
        <div className="space-y-2 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <Button variant="hero" className="w-full" onClick={handleComplete}>
            Treino concluído ✅
          </Button>
          <div className="flex gap-2">
            <Button variant="hero-outline" className="flex-1 h-12 text-sm" onClick={handleCantToday}>
              Não consegui hoje
            </Button>
            <Button variant="soft" className="flex-1 h-12 text-sm">
              Adaptar treino
            </Button>
          </div>
        </div>
      </div>

      <BottomNav active={2} />
    </div>
  );
}

function Section({ title, delay, children }: { title: string; delay: number; children: React.ReactNode }) {
  return (
    <div className="animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ExercicioRow({
  nome,
  detalhe,
  feito,
  onToggle,
}: {
  nome: string;
  detalhe: string;
  feito: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl bg-card card-elevated text-left transition-all active:scale-[0.98]",
        feito && "opacity-70"
      )}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          feito ? "border-accent bg-accent" : "border-border"
        )}
      >
        {feito && <Check size={12} className="text-accent-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium", feito && "line-through text-muted-foreground")}>
          {nome}
        </p>
        <p className="text-xs text-muted-foreground">{detalhe}</p>
      </div>
    </button>
  );
}
