import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ProgressBar";
import { onboardingSteps } from "@/data/mockData";
import { ChevronLeft, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [showComplete, setShowComplete] = useState(false);

  const current = onboardingSteps[step];
  const total = onboardingSteps.length;

  const handleNext = () => {
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setShowComplete(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigate("/");
  };

  const setValue = (campo: string, value: any) => {
    setAnswers({ ...answers, [campo]: value });
  };

  const toggleMulti = (campo: string, value: string) => {
    const current = answers[campo] || [];
    if (current.includes(value)) {
      setValue(campo, current.filter((v: string) => v !== value));
    } else {
      setValue(campo, [...current, value]);
    }
  };

  if (showComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
        <div className="w-full max-w-sm text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 rounded-3xl bg-accent/15 flex items-center justify-center mx-auto">
            <Sparkles className="text-accent" size={36} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-display font-semibold text-foreground">
              Seu plano inicial está pronto
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Preparamos tudo com base nas suas respostas.
              <br />
              Vamos começar sua jornada!
            </p>
          </div>

          <div className="bg-card card-elevated rounded-2xl p-5 text-left space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resumo</p>
            <div className="space-y-2 text-sm">
              {answers.nome && <p><span className="text-muted-foreground">Nome:</span> <span className="font-medium">{answers.nome}</span></p>}
              {answers.objetivo && <p><span className="text-muted-foreground">Objetivo:</span> <span className="font-medium">{answers.objetivo}</span></p>}
              {answers.meta && <p><span className="text-muted-foreground">Meta:</span> <span className="font-medium">{answers.meta}</span></p>}
              {answers.frequenciaTreino && <p><span className="text-muted-foreground">Treino:</span> <span className="font-medium">{answers.frequenciaTreino}</span></p>}
            </div>
          </div>

          <Button variant="hero" className="w-full" onClick={() => navigate("/dashboard")}>
            Ir para meu dia
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors active:scale-95">
            <ChevronLeft size={22} />
          </button>
          <span className="text-xs font-medium text-muted-foreground">{step + 1} de {total}</span>
          <div className="w-10" />
        </div>
        <ProgressBar value={step + 1} max={total} variant="primary" size="sm" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6 pt-8 pb-6" key={step}>
        <div className="space-y-2 mb-8 animate-fade-up">
          <h2 className="text-xl font-semibold text-foreground leading-snug">
            {current.titulo}
          </h2>
          <p className="text-sm text-muted-foreground">{current.subtitulo}</p>
        </div>

        <div className="flex-1 animate-fade-up" style={{ animationDelay: "80ms" }}>
          {current.tipo === "text" && (
            <input
              type="text"
              placeholder={current.placeholder}
              value={answers[current.campo!] || ""}
              onChange={(e) => setValue(current.campo!, e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-secondary/60 border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              autoFocus
            />
          )}

          {current.tipo === "number" && (
            <input
              type="number"
              placeholder={current.placeholder}
              value={answers[current.campo!] || ""}
              onChange={(e) => setValue(current.campo!, e.target.value)}
              className="w-full h-14 px-4 rounded-xl bg-secondary/60 border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              autoFocus
            />
          )}

          {current.tipo === "dual-number" && current.campos && (
            <div className="flex gap-3">
              {current.campos.map((c) => (
                <div key={c.campo} className="flex-1 relative">
                  <input
                    type="number"
                    placeholder={c.placeholder}
                    value={answers[c.campo] || ""}
                    onChange={(e) => setValue(c.campo, e.target.value)}
                    className="w-full h-14 px-4 pr-12 rounded-xl bg-secondary/60 border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">
                    {c.sufixo}
                  </span>
                </div>
              ))}
            </div>
          )}

          {current.tipo === "select" && current.opcoes && (
            <div className="space-y-2">
              {current.opcoes.map((opcao) => (
                <button
                  key={opcao}
                  onClick={() => setValue(current.campo!, opcao)}
                  className={cn(
                    "w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.98]",
                    answers[current.campo!] === opcao
                      ? "border-primary bg-primary/8 text-primary"
                      : "border-border bg-card text-foreground hover:bg-secondary"
                  )}
                >
                  {opcao}
                </button>
              ))}
            </div>
          )}

          {current.tipo === "multi-select" && current.opcoes && (
            <div className="flex flex-wrap gap-2">
              {current.opcoes.map((opcao) => {
                const selected = (answers[current.campo!] || []).includes(opcao);
                return (
                  <button
                    key={opcao}
                    onClick={() => toggleMulti(current.campo!, opcao)}
                    className={cn(
                      "px-4 py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-[0.97]",
                      selected
                        ? "border-primary bg-primary/8 text-primary"
                        : "border-border bg-card text-foreground hover:bg-secondary"
                    )}
                  >
                    {selected && <Check size={14} className="inline mr-1.5" />}
                    {opcao}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Continue button */}
        <div className="pt-4">
          <Button variant="hero" className="w-full" onClick={handleNext}>
            {step === total - 1 ? "Finalizar" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
