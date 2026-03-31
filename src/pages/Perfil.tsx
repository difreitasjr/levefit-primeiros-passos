import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Perfil() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lembretes, setLembretes] = useState({
    treino: true,
    agua: true,
    refeicao: true,
    sono: true,
  });

  // Estado do modal de edição
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLabel, setEditingLabel] = useState("");
  const [editingField, setEditingField] = useState("");
  const [editingValue, setEditingValue] = useState("");
  const [editingType, setEditingType] = useState<"text" | "number">("text");

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile(data);
          setLembretes({
            treino: data.lembrete_treino ?? true,
            agua: data.lembrete_agua ?? true,
            refeicao: data.lembrete_refeicao ?? true,
            sono: data.lembrete_sono ?? true,
          });
        }
        setLoading(false);
      });
  }, [user]);

  const openEdit = (label: string, field: string, value: any, type: "text" | "number" = "text") => {
    setEditingLabel(label);
    setEditingField(field);
    setEditingValue(value ?? "");
    setEditingType(type);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    const valorFinal = editingType === "number"
      ? editingValue === "" ? null : Number(editingValue)
      : editingValue;

    const { error } = await supabase
      .from("profiles")
      .update({ [editingField]: valorFinal })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Erro ao salvar. Tente novamente.");
    } else {
      setProfile((prev: any) => ({ ...prev, [editingField]: valorFinal }));
      toast.success(`${editingLabel} atualizado com sucesso!`);
      setModalOpen(false);
    }
    setSaving(false);
  };

  const toggleLembrete = async (key: keyof typeof lembretes) => {
    if (!user) return;
    const novoValor = !lembretes[key];
    setLembretes((prev) => ({ ...prev, [key]: novoValor }));

    const coluna = `lembrete_${key}`;
    const { error } = await supabase
      .from("profiles")
      .update({ [coluna]: novoValor })
      .eq("user_id", user.id);

    if (error) {
      // Reverte se der erro
      setLembretes((prev) => ({ ...prev, [key]: !novoValor }));
      toast.error("Erro ao salvar preferência.");
    } else {
      toast.success(`Lembrete de ${key} ${novoValor ? "ativado" : "desativado"}!`);
    }
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
        { label: "Nome", value: p.nome || "—", field: "nome", type: "text" as const },
        { label: "Idade", value: p.idade ? `${p.idade} anos` : "—", field: "idade", type: "number" as const, rawValue: p.idade },
        { label: "Peso atual", value: p.peso_atual ? `${p.peso_atual}kg` : "—", field: "peso_atual", type: "number" as const, rawValue: p.peso_atual },
        { label: "Altura", value: p.altura ? `${p.altura}cm` : "—", field: "altura", type: "number" as const, rawValue: p.altura },
        { label: "E-mail", value: user?.email || "—", field: null },
      ],
    },
    {
      titulo: "Objetivo e metas",
      items: [
        { label: "Objetivo", value: p.objetivo || "—", field: "objetivo", type: "text" as const },
        { label: "Meta", value: p.meta || "—", field: "meta", type: "text" as const },
        { label: "Nível de atividade", value: p.nivel_atividade || "—", field: "nivel_atividade", type: "text" as const },
      ],
    },
    {
      titulo: "Alimentação",
      items: [
        { label: "Preferências", value: (p.preferencias_alimentares || []).join(", ") || "—", field: "preferencias_alimentares", type: "text" as const },
        { label: "Restrições", value: (p.restricoes || []).join(", ") || "—", field: "restricoes", type: "text" as const },
      ],
    },
    {
      titulo: "Rotina",
      items: [
        { label: "Rotina", value: p.rotina || "—", field: "rotina", type: "text" as const },
        { label: "Frequência de treino", value: p.frequencia_treino || "—", field: "frequencia_treino", type: "text" as const },
        { label: "Horário de treino", value: p.horario_treino || "—", field: "horario_treino", type: "text" as const },
        { label: "Consumo de água", value: p.consumo_agua || "—", field: "consumo_agua", type: "text" as const },
        { label: "Média de sono", value: p.media_sono || "—", field: "media_sono", type: "text" as const },
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
        {/* Card do usuário */}
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

        {/* Seções editáveis */}
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
                  disabled={!item.field}
                  onClick={() => {
                    if (!item.field) return;
                    const raw = (item as any).rawValue ?? p[item.field] ?? "";
                    openEdit(item.label, item.field, raw, (item as any).type ?? "text");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 text-left transition-colors active:scale-[0.99]",
                    item.field
                      ? "hover:bg-secondary/40 cursor-pointer"
                      : "cursor-default opacity-70",
                    i < section.items.length - 1 && "border-b border-border/50"
                  )}
                >
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground max-w-[180px] truncate">
                      {item.value}
                    </span>
                    {item.field && (
                      <Pencil size={13} className="text-muted-foreground/50" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Notificações */}
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
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Sair da conta
        </Button>

        <p className="text-center text-[10px] text-muted-foreground pb-4">
          LeveFit v1.0 · Feito com 💛
        </p>
      </div>

      {/* Modal de edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil size={16} className="text-primary" />
              Editar {editingLabel}
            </DialogTitle>
          </DialogHeader>

          <div className="py-2">
            <Input
              type={editingType}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              placeholder={`Digite ${editingLabel.toLowerCase()}...`}
              className="text-base"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && !saving) handleSave();
              }}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Salvar"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
