import { useNavigate } from "react-router-dom";
import { Home, Utensils, Dumbbell, TrendingUp, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Hoje", path: "/dashboard" },
  { icon: Utensils, label: "Alimentação", path: "/dashboard" },
  { icon: Dumbbell, label: "Treino", path: "/dashboard" },
  { icon: TrendingUp, label: "Progresso", path: "/dashboard" },
  { icon: Sparkles, label: "Desafios", path: "/dashboard" },
];

interface BottomNavProps {
  active?: number;
}

export function BottomNav({ active = 0 }: BottomNavProps) {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
        {navItems.map((item, i) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 active:scale-95 min-w-[56px]",
              i === active
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={20} strokeWidth={i === active ? 2.2 : 1.8} />
            <span className={cn("text-[10px]", i === active ? "font-semibold" : "font-medium")}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
