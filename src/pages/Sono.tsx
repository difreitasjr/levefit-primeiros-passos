import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSleep } from '@/hooks/useDailyData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Sono() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sleep, updateSleep } = useSleep();
  
  const [hours, setHours] = useState(sleep?.hours_slept || 0);
  const [quality, setQuality] = useState(sleep?.quality || 'regular');

  const handleSave = () => {
    updateSleep.mutate({ hours: parseFloat(hours.toString()), quality }, {
      onSuccess: () => {
        navigate(-1);
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <Moon size={20} className="text-primary" />
          <h1 className="text-lg font-semibold text-foreground">Registrar Sono</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        <div className="bg-card card-elevated rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hours" className="text-sm font-medium">
              Quantas horas você dormiu?
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="hours"
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(parseFloat(e.target.value) || 0)}
                className="h-12 rounded-xl"
                placeholder="0"
              />
              <span className="text-sm font-medium text-muted-foreground">horas</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quality" className="text-sm font-medium">
              Qualidade do sono
            </Label>
            <Select value={quality} onValueChange={setQuality}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ruim">Ruim</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="bom">Bom</SelectItem>
                <SelectItem value="otimo">Ótimo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSleep.isPending}
            className="w-full mt-6"
            variant="hero"
          >
            {updateSleep.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-primary/5 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">💡 Dica</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            O ideal é dormir entre 7-9 horas por noite. Registre seu sono todos os dias para acompanhar sua qualidade de vida.
          </p>
        </div>
      </div>
    </div>
  );
}
