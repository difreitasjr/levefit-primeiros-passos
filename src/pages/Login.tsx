import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="w-full max-w-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 animate-fade-up">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <Heart className="text-primary" size={22} strokeWidth={1.8} />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">
            {isLogin ? "Bem-vinda de volta" : "Crie sua conta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Entre para continuar sua jornada" : "Comece sua jornada de bem-estar"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="space-y-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 pl-11 pr-11 rounded-xl bg-secondary/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <button type="button" className="text-xs text-primary font-medium hover:underline">
              Esqueci minha senha
            </button>
          )}

          <Button type="submit" variant="hero" className="w-full">
            {isLogin ? "Entrar" : "Criar conta"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 animate-fade-up" style={{ animationDelay: "200ms" }}>
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">ou continue com</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social login */}
        <div className="flex gap-3 animate-fade-up" style={{ animationDelay: "250ms" }}>
          <button className="flex-1 h-12 rounded-xl border border-border bg-card flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-secondary transition-all active:scale-[0.97]">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button className="flex-1 h-12 rounded-xl border border-border bg-card flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-secondary transition-all active:scale-[0.97]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
            Apple
          </button>
        </div>

        {/* Toggle */}
        <p className="text-center text-sm text-muted-foreground animate-fade-up" style={{ animationDelay: "300ms" }}>
          {isLogin ? "Não tem conta? " : "Já tem conta? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Criar conta" : "Entrar"}
          </button>
        </p>
      </div>
    </div>
  );
}
