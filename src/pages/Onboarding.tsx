import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles } from 'lucide-react'

function Onboarding() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [nome, setNome] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [loading, setLoading] = useState(false)

  async function finalizarOnboarding() {
    if (!nome || !objetivo) return
    setLoading(true)

    try {
      if (user) {
        await supabase.from('profiles').upsert({
          user_id: user.id,
          nome,
          objetivo,
          onboarding_completed: true,
        }, { onConflictFields: ['user_id'] })

        await supabase.from('onboarding_answers').upsert({
          user_id: user.id,
          answers: { nome, objetivo },
        }, { onConflictFields: ['user_id'] })
      }

      navigate('/dashboard')
    } catch (err) {
      console.error('Erro ao salvar onboarding:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-5">
            <Sparkles className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Vamos começar!
          </h1>
          <p className="text-muted-foreground text-base">
            Me conta um pouco sobre você para personalizar sua experiência
          </p>
        </div>

        {/* Form */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-foreground">
              Como posso te chamar?
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-12 rounded-xl bg-card border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo" className="text-sm font-medium text-foreground">
              Qual seu objetivo principal?
            </Label>
            <Select value={objetivo} onValueChange={setObjetivo}>
              <SelectTrigger className="h-12 rounded-xl bg-card border-border">
                <SelectValue placeholder="Selecione seu objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emagrecer">Emagrecer</SelectItem>
                <SelectItem value="Manter">Manter o peso</SelectItem>
                <SelectItem value="Ganhar massa">Ganhar massa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="hero"
            className="w-full mt-4"
            onClick={finalizarOnboarding}
            disabled={!nome || !objetivo || loading}
          >
            {loading ? 'Salvando...' : 'Começar minha jornada ✨'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Você pode alterar essas informações depois no seu perfil
        </p>
      </div>
    </div>
  )
}

export default Onboarding
