import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Sparkles } from 'lucide-react'

function Cadastro() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async () => {
    // Validações
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    if (!email.includes('@')) {
      setError('Email inválido')
      return
    }

    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      console.log('=== INICIANDO CADASTRO ===')
      console.log('Email:', email)

      // 1. Criar usuário no Supabase Auth
      console.log('Passo 1: Criando usuário no Auth...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (authError) {
        console.error('❌ Erro de autenticação:', {
          message: authError.message,
          code: authError.code,
          status: authError.status,
        })
        setError(`Erro ao criar conta: ${authError.message}`)
        setLoading(false)
        return
      }

      if (!authData.user) {
        console.error('❌ Usuário não retornou do signup')
        setError('Erro ao criar usuário')
        setLoading(false)
        return
      }

      console.log('✅ Usuário criado com sucesso!')
      console.log('User ID:', authData.user.id)
      console.log('User Email:', authData.user.email)

      // 2. Aguardar sincronização
      console.log('Passo 2: Aguardando sincronização (2 segundos)...')
      await new Promise(resolve => setTimeout(resolve, 2000))

      // 3. Criar registro na tabela profiles
      console.log('Passo 3: Criando registro em profiles...')
      console.log('Dados a inserir:', {
        user_id: authData.user.id,
        nome: null,
        objetivo: null,
        onboarding_completed: false,
      })

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: authData.user.id,
            nome: null,
            objetivo: null,
            onboarding_completed: false,
          },
        ])
        .select()

      if (profileError) {
        console.error('❌ ERRO AO CRIAR PERFIL:', {
          code: profileError.code,
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          status: (profileError as any).status,
        })
        setError(`Erro ao criar perfil: ${profileError.message}`)
        setLoading(false)
        return
      }

      console.log('✅ Perfil criado com sucesso!')
      console.log('Profile data:', profileData)

      setSuccess(true)
      setEmail('')
      setPassword('')
      setConfirmPassword('')

      console.log('Redirecionando para login em 2 segundos...')

      // 4. Redirecionar após 2 segundos
      setTimeout(() => {
        console.log('Navegando para /login')
        navigate('/login')
      }, 2000)
    } catch (err: any) {
      console.error('❌ ERRO GERAL:', {
        message: err.message,
        name: err.name,
        stack: err.stack,
      })
      setError(`Erro: ${err.message || 'Algo deu errado'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleSignUp()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Criar Conta</h1>
          <p className="text-gray-600">Junte-se ao LeveFit!</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Mensagem de Sucesso */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded flex items-center gap-2">
              <span>✓</span>
              <span>Conta criada com sucesso! Redirecionando...</span>
            </div>
          )}

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || success}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
            <p className="text-xs text-gray-500">Você receberá um email de confirmação</p>
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Senha
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || success}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Campo Confirmar Senha */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
              Confirmar Senha
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading || success}
              className="border-gray-300 focus:border-green-500 focus:ring-green-500"
            />
          </div>

          {/* Botão Criar Conta */}
          <Button
            onClick={handleSignUp}
            disabled={loading || success || !email || !password || !confirmPassword}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⏳</span>
                Criando conta...
              </span>
            ) : success ? (
              <span className="flex items-center gap-2">
                <span>✓</span>
                Conta criada!
              </span>
            ) : (
              'Criar Conta'
            )}
          </Button>

          {/* Link para Login */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Já tem conta?{' '}
              <Link
                to="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Faça login
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              <Link
                to="/"
                className="text-green-600 font-medium hover:underline"
              >
                Voltar para home
              </Link>
            </p>
          </div>
        </div>

        {/* Termos */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Ao criar uma conta, você concorda com nossos{' '}
          <button className="text-green-600 hover:underline">Termos de Serviço</button>
        </p>
      </div>
    </div>
  )
}

export default Cadastro
