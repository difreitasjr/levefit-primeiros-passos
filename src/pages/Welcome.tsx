import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Droplets, Moon, Dumbbell, Salad } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  const features = [
    { icon: Salad, label: "Alimentação equilibrada" },
    { icon: Dumbbell, label: "Treino possível" },
    { icon: Droplets, label: "Hidratação" },
    { icon: Moon, label: "Sono de qualidade" },
    { icon: Heart, label: "Autocuidado" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-sm flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <div className="animate-fade-up" style={{ animationDelay: "0ms" }}>
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 mx-auto">
            <Heart className="text-primary" size={28} strokeWidth={1.8} />
          </div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-foreground">
            LeveFit
          </h1>
        </div>

        {/* Headline */}
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <h2 className="text-xl font-semibold text-foreground leading-snug">
            Emagreça com rotina real,
            <br />
            <span className="text-primary">sem radicalismo</span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-[280px] mx-auto">
            Seu apoio diário em alimentação, treino, água, sono e constância. 
            Sem dietas malucas, sem pressão.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 animate-fade-up" style={{ animationDelay: "200ms" }}>
          {features.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium"
            >
              <f.icon size={13} strokeWidth={1.8} />
              {f.label}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="w-full space-y-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <Button variant="hero" className="w-full" onClick={() => navigate("/onboarding")}>
            Começar
          </Button>
          <Button variant="hero-outline" className="w-full" onClick={() => navigate("/login")}>
            Já tenho conta
          </Button>
        </div>
      </div>
    </div>
  );
}
