import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Utensils,
  Bell,
  Calendar,
  LogOut,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lembretes, setLembretes] = useState({
    treino: true,
    agua: true,
    refeicao: true,
    sono: true,
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) setProfile(data);
        setLoading(false);
      });
  }, [user]);

  const toggleLembrete = (key: keyof typeof lembretes) => {
    setLembretes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const p = profile || {};

  const sections = [
    {
      titulo: "Dados pessoais",
      items: [
        { label: "Nome", value: p.nome || "—", icon: User },
        { label: "Idade", value: p.idade ? `${p.idade} anos` : "—", icon: User },
        { label: "Peso atual", value: p.peso_atual ? `${p.peso_atual}kg` : "—", icon: User },
        { label: "Altura", value: p.altura ? `${p.altura}cm` : "—", icon: User },
        { label: "E-mail", value: user?.email || "—", icon: User },
      ],
    },
    {
      titulo: "Objetivo e metas",
      items: [
        { label: "Objetivo", value: p.objetivo || "—", icon: Target },
        { label: "Meta", value: p.meta || "—", icon: Target },
        { label: "Nível de atividade", value: p.nivel_atividade || "—", icon: Target },
      ],
    },
    {
      titulo: "Alimentação",
      items: [
        { label: "Preferências", value: (p.preferencias_alimentares || []).join(", ") || "—", icon: Utensils },
        { label: "Restrições", value: (p.restricoes || []).join(", ") || "—", icon: Utensils },
      ],
    },
    {
      titulo: "Rotina",
      items: [
        { label: "Rotina", value: p.rotina || "—", icon: Calendar },
        { label: "Frequência de treino", value: p.frequencia_treino || "—", icon: Calendar },
        { label: "Horário de treino", value: p.horario_treino || "—", icon: Calendar },
        { label: "Consumo de água", value: p.consumo_agua || "—", icon: Calendar },
        { label: "Média de sono", value: p.media_sono || "—", icon: Calendar },
      ],
    },
  ];

  const lembreteItems = [
    { key: "treino" as const, label: "Lembrete de treino" },
    { key: "agua" as const, label: "Lembrete de água" },
    { key: "refeicao" as const, label: "Lembrete de refeição" },
    { key: "sono" as const, label: "Lembrete de sono" },
  ];

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors active:scale-95"
          >
            <ChevronLeft size={22} />
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Perfil e configurações</h1>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        <div className="bg-card card-elevated rounded-2xl p-5 flex items-center gap-4 animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Heart className="text-primary" size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{p.nome || "Usuária"}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{p.objetivo || ""}</p>
          </div>
        </div>

        {sections.map((section, sIdx) => (
          <div
            key={section.titulo}
            className="bg-card card-elevated rounded-2xl overflow-hidden animate-fade-up"
            style={{ animationDelay: `${(sIdx + 1) * 60}ms` }}
          >
            <div className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {section.titulo}
              </p>
            </div>
            <div>
              {section.items.map((item, i) => (
                <button
                  key={item.label}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left hover:bg-secondary/40 transition-colors active:scale-[0.99]",
                    i < section.items.length - 1 && "border-b border-border/50"
                  )}
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground max-w-[180px] truncate">{item.value}</span>
                    <ChevronRight size={14} className="text-muted-foreground/50" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        <div
          className="bg-card card-elevated rounded-2xl overflow-hidden animate-fade-up"
          style={{ animationDelay: `${(sections.length + 1) * 60}ms` }}
        >
          <div className="px-4 pt-4 pb-2 flex items-center gap-2">
            <Bell size={14} className="text-primary" />
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Notificações
            </p>
          </div>
          <div>
            {lembreteItems.map((item, i) => (
              <div
                key={item.key}
                className={cn(
                  "flex items-center justify-between px-4 py-3",
                  i < lembreteItems.length - 1 && "border-b border-border/50"
                )}
              >
                <span className="text-sm text-foreground">{item.label}</span>
                <button
                  onClick={() => toggleLembrete(item.key)}
                  className={cn(
                    "w-11 h-6 rounded-full transition-colors relative",
                    lembretes[item.key] ? "bg-primary" : "bg-border"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform",
                      lembretes[item.key] ? "translate-x-[22px]" : "translate-x-0.5"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 animate-fade-up"
          style={{ animationDelay: `${(sections.length + 2) * 60}ms` }}
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Sair da conta
        </Button>

        <p className="text-center text-[10px] text-muted-foreground pb-4">
          LeveFit v1.0 · Feito com 💛
        </p>
      </div>
    </div>
  );
}
