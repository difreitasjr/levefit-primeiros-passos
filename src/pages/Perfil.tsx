import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  User,
  Target,
  Utensils,
  Bell,
  Calendar,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Perfil() {
  const navigate = useNavigate();
  const [lembretes, setLembretes] = useState({
    treino: mockUser.lembreteTreino,
    agua: mockUser.lembreteAgua,
    refeicao: mockUser.lembreteRefeicao,
    sono: mockUser.lembreteSono,
  });

  const toggleLembrete = (key: keyof typeof lembretes) => {
    setLembretes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      titulo: "Dados pessoais",
      items: [
        { label: "Nome", value: mockUser.nome, icon: User },
        { label: "Idade", value: `${mockUser.idade} anos`, icon: User },
        { label: "Peso atual", value: `${mockUser.pesoAtual}kg`, icon: User },
        { label: "Altura", value: `${mockUser.altura}cm`, icon: User },
        { label: "E-mail", value: mockUser.email, icon: User },
      ],
    },
    {
      titulo: "Objetivo e metas",
      items: [
        { label: "Objetivo", value: mockUser.objetivo, icon: Target },
        { label: "Meta", value: mockUser.meta, icon: Target },
        { label: "Nível de atividade", value: mockUser.nivelAtividade, icon: Target },
      ],
    },
    {
      titulo: "Alimentação",
      items: [
        { label: "Preferências", value: mockUser.preferenciasAlimentares.join(", "), icon: Utensils },
        { label: "Restrições", value: mockUser.restricoes.join(", "), icon: Utensils },
      ],
    },
    {
      titulo: "Rotina",
      items: [
        { label: "Rotina", value: mockUser.rotina, icon: Calendar },
        { label: "Frequência de treino", value: mockUser.frequenciaTreino, icon: Calendar },
        { label: "Horário de treino", value: mockUser.horarioTreino, icon: Calendar },
        { label: "Consumo de água", value: mockUser.consumoAgua, icon: Calendar },
        { label: "Média de sono", value: mockUser.mediaSono, icon: Calendar },
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
            <h1 className="text-xl font-semibold text-foreground">Perfil e configurações</h1>
          </div>
        </div>
      </div>

      <div className="px-5 space-y-4">
        {/* Avatar card */}
        <div className="bg-card card-elevated rounded-2xl p-5 flex items-center gap-4 animate-fade-up">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Heart className="text-primary" size={24} strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-lg font-semibold text-foreground">{mockUser.nome}</p>
            <p className="text-xs text-muted-foreground">{mockUser.email}</p>
            <p className="text-xs text-primary font-medium mt-0.5">{mockUser.objetivo}</p>
          </div>
        </div>

        {/* Sections */}
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

        {/* Lembretes / Notificações */}
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

        {/* Logout */}
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/5 animate-fade-up"
          style={{ animationDelay: `${(sections.length + 2) * 60}ms` }}
          onClick={() => navigate("/")}
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
