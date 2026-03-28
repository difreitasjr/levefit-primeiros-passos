import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeals } from '@/hooks/useDailyData';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Utensils, Plus, Trash2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export default function Alimentacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: meals = [], addMeal, toggleMeal } = useMeals();
  
  const [mealType, setMealType] = useState('cafe_manha');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddMeal = () => {
    if (!description.trim()) return;
    
    addMeal.mutate({ meal_type: mealType, description }, {
      onSuccess: () => {
        setDescription('');
        setMealType('cafe_manha');
      },
    });
  };

  const mealLabels: Record<string, string> = {
    cafe_manha: '☕ Café da manhã',
    almoco: '🍽️ Almoço',
    lanche: '🥪 Lanche',
    jantar: '🍽️ Jantar',
  };

  const completedMeals = meals.filter(m => m.completed).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-accent/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <Utensils size={20} className="text-primary" />
            <h1 className="text-lg font-semibold text-foreground">Alimentação</h1>
          </div>
        </div>
        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-full">
          {completedMeals}/{meals.length}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-6 space-y-6">
        {/* Add Meal Form */}
        <div className="bg-card card-elevated rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Adicionar refeição</h2>
          
          <div className="space-y-2">
            <Label htmlFor="mealType" className="text-sm font-medium">
              Tipo de refeição
            </Label>
            <Select value={mealType} onValueChange={setMealType}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cafe_manha">☕ Café da manhã</SelectItem>
                <SelectItem value="almoco">🍽️ Almoço</SelectItem>
                <SelectItem value="lanche">🥪 Lanche</SelectItem>
                <SelectItem value="jantar">🍽️ Jantar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              O que você comeu?
            </Label>
            <Input
              id="description"
              placeholder="Ex: Ovos com pão integral"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <Button
            onClick={handleAddMeal}
            disabled={addMeal.isPending || !description.trim()}
            variant="hero"
            className="w-full"
          >
            <Plus size={16} className="mr-2" />
            {addMeal.isPending ? 'Adicionando...' : 'Adicionar'}
          </Button>
        </div>

        {/* Meals List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground px-1">Refeições do dia</h2>
          
          {meals.length === 0 ? (
            <div className="bg-card card-elevated rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">Nenhuma refeição registrada ainda</p>
            </div>
          ) : (
            meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-card card-elevated rounded-2xl p-4 flex items-start gap-3"
              >
                <button
                  onClick={() => toggleMeal.mutate({ id: meal.id, completed: meal.completed })}
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                    meal.completed ? "border-accent bg-accent" : "border-border"
                  )}
                >
                  {meal.completed && <Check size={14} className="text-accent-foreground" />}
                </button>
                
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium",
                    meal.completed && "text-muted-foreground line-through"
                  )}>
                    {mealLabels[meal.meal_type]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{meal.description}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Tips */}
        <div className="bg-primary/5 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">💡 Dica</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Registre todas as suas refeições para acompanhar sua alimentação e manter-se no caminho certo para seus objetivos.
          </p>
        </div>
      </div>
    </div>
  );
}