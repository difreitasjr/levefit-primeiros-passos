import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCheckIn } from "@/hooks/useDailyData";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const checkInCompleto = {
  campos: [
    {
      id: "humor",
      label: "Como você está se sentindo?",
      tipo: "emoji",
      opcoes: [
        { label: "Ótimo", emoji: "😄" },
        { label: "Bom", emoji: "🙂" },
        { label: "Neutro", emoji: "😐" },
        { label: "Ruim", emoji: "😞" },
      ],
    },
    {
      id: "energia",
      label: "Nível de energia",
      tipo: "slider",
      labels: ["Baixa", "Média", "Alta"],
    },
    {
      id: "nota",
      label: "Notas do dia (opcional)",
      tipo: "text",
      placeholder: "Como foi seu dia? Algo especial aconteceu?",
    },
  ],
  feedbacks: [
    {
      titulo: "Que incrível! 🎉",
      mensagem: "Você está com uma energia positiva!",
      recomendacao: "Aproveite este momento para fazer exercícios e consolidar seus hábitos.",
    },
    {
      titulo: "Tudo certo! 👍",
      mensagem: "Você está no caminho certo.",
      recomendacao: "Mantenha a consistência e continue se cuidando.",
    },
    {
      titulo: "Cuidado! 💙",
      mensagem: "Parece que você pode estar precisando de um descanso.",
      recomendacao: "Descanse adequadamente, durma bem e se hidrate.",
    },
  ],
};

export default function CheckIn() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: checkin, saveCheckIn } = useCheckIn();
  
  const [respostas, setRespostas] = useState<Record<string, any>>(
    checkin ? {
      humor: checkin.mood,
      energia: checkin.energy_level,
      nota: checkin.notes,
    } : {}
  );
  const [energyLevel, setEnergyLevel] = useState(checkin?.energy_level || 3);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const setResposta = (id: string, value: any) => {
    setRespostas((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    saveCheckIn.mutate(
      {
        mood: respostas.humor || "neutro",
        energy_level: energyLevel,
        notes: respostas.nota || "",
      },
      {
        onSuccess: () => {
          setSaving(false);
          setSaved(true);
        },
        onError: () => {
          setSaving(false);
          toast.error("Erro ao salvar check-in");
        },
      }
    );
  };

  const feedbackIndex =
    respostas.humor === "Ótimo"
      ? 0
      : respostas.humor === "Ruim"
      ? 2
      : 1;
  const feedback = checkInCompleto.feedbacks[feedbackIndex];

  if (saved) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 pb-24">
        <div className="w-full max-w-sm text-center space-y-5 animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Heart className="text-primary" size={28} strokeWidth={1.5} />
          </div>
          <h1 className="text-xl font-display font-semibold text-foreground">
            {feedback.titulo}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {feedback.mensagem}
          </p>
          <div className="bg-card card-elevated rounded-2xl p-4 text-left">
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1.5">
              Micro recomendação
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {feedback.recomendacao}
            </p>
          </div>
          <Button
            variant="hero"
            className="w-full"
            onClick={() => navigate("/dashboard")}
          >
            Voltar para Hoje
          </Button>
        </div>
        <BottomNav active={0} />
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
            <h1 className="text-xl font-semibold text-foreground">Check-in diário</h1>
            <p className="text-xs text-muted-foreground">Como foi seu dia?</p>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5">
        {checkInCompleto.campos.map((campo, idx) => (
          <div
            key={campo.id}
            className="bg-card card-elevated rounded-2xl p-4 animate-fade-up"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <p className="text-sm font-semibold text-foreground mb-3">{campo.label}</p>

            {campo.tipo === "emoji" && campo.opcoes && (
              <div className="flex flex-wrap gap-2">
                {campo.opcoes.map((o) => (
                  <button
                    key={o.label}
                    onClick={() => setResposta(campo.id, o.label)}
                    className={cn(
                      "flex flex-col items-center gap-1 px-3 py-2.5 rounded-xl border transition-all active:scale-95",
                      respostas[campo.id] === o.label
                        ? "border-primary bg-primary/8"
                        : "border-border hover:bg-secondary"
                    )}
                  >
                    <span className="text-lg">{o.emoji}</span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {o.label}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {campo.tipo === "slider" && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setEnergyLevel(n);
                        setResposta(campo.id, n);
                      }}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold transition-all active:scale-95",
                        energyLevel === n
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                  {campo.labels?.map((l) => (
                    <span key={l} className="w-10 text-center">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {campo.tipo === "text" && (
              <textarea
                placeholder={campo.placeholder}
                rows={3}
                value={respostas[campo.id] || ""}
                onChange={(e) => setResposta(campo.id, e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none transition-all"
              />
            )}
          </div>
        ))}

        <div className="animate-fade-up" style={{ animationDelay: "500ms" }}>
          <Button
            variant="hero"
            className="w-full"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Salvando..." : "Salvar check-in 💛"}
          </Button>
        </div>
      </div>

      <BottomNav active={0} />
    </div>
  );
}
