import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  variant?: "primary" | "accent" | "terracotta";
  size?: "sm" | "md";
}

export function ProgressBar({ value, max = 100, className, variant = "primary", size = "md" }: ProgressBarProps) {
  const percent = Math.min((value / max) * 100, 100);

  const variantColors = {
    primary: "bg-primary",
    accent: "bg-accent",
    terracotta: "bg-terracotta",
  };

  return (
    <div className={cn("w-full rounded-full bg-secondary overflow-hidden", size === "sm" ? "h-1.5" : "h-2.5", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-700 ease-out", variantColors[variant])}
        style={{ width: `${percent}%`, animation: "progress-fill 1s ease-out" }}
      />
    </div>
  );
}
