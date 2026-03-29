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
  const [error, setError] = useState('')

  const finalizarOnboarding = async () => {
    if (!nome.trim() || !objetivo) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (!user) {
      setError('Usuário não autenticado')
      console.error('Usuário não encontrado')
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log('Salvando onboarding para usuário:', user.id)

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(
          {
            user_id: user.id,
            nome: nome.trim(),
            objetivo,
            onboarding_completed: true,
          },
          { onConflict: 'user_id' }
        )

      if (profileError) {
        console.error('Erro ao salvar profile:', profileError)
        setError(`Erro ao salvar perfil: ${profileError.message}`)
        setLoading(false)
        return
      }

      console.log('Perfil salvo com sucesso!')
      setLoading(false)
      navigate('/dashboard')
    } catch (err: any) {
      console.error('Erro geral ao salvar onboarding:', err)
      setError(`Erro: ${err.message || 'Algo deu errado'}`)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bem-vindo ao LeveFit!</h1>
          <p className="text-gray-600">Vamos personalizar sua jornada</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="nome" className="text-gray-700 font-medium">
              Como você gostaria de ser chamado?
            </Label>
            <Input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              disabled={loading}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="objetivo" className="text-gray-700 font-medium">
              Qual é seu objetivo?
            </Label>
            <Select value={objetivo} onValueChange={setObjetivo} disabled={loading}>
              <SelectTrigger id="objetivo" className="border-gray-300">
                <SelectValue placeholder="Selecione seu objetivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Emagrecer">Emagrecer</SelectItem>
                <SelectItem value="Manter">Manter peso</SelectItem>
                <SelectItem value="Ganhar massa">Ganhar massa muscular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={finalizarOnboarding}
            disabled={loading || !nome.trim() || !objetivo}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
          >
            {loading ? 'Salvando...' : 'Começar minha jornada ✨'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding
