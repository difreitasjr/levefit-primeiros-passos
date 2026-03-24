import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'

function AuthTest() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [usuarioEmail, setUsuarioEmail] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error(error)
        return
      }

      setUsuarioEmail(data.session?.user?.email ?? '')
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUsuarioEmail(session?.user?.email ?? '')

      if (event === 'SIGNED_OUT') {
        setMensagem('Você saiu da conta.')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function cadastrar() {
    setCarregando(true)
    setMensagem('')

    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
      setCarregando(false)
      return
    }

    setMensagem('Conta criada. Verifique seu e-mail para confirmar a conta.')
    setCarregando(false)
  }

  async function entrar() {
    setCarregando(true)
    setMensagem('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    })

    if (error) {
      setMensagem(error.message)
      setCarregando(false)
      return
    }

    setMensagem('Login realizado com sucesso.')
    setCarregando(false)
  }

  async function sair() {
    setCarregando(true)
    setMensagem('Saindo...')

    const { error } = await supabase.auth.signOut()

    if (error) {
      setMensagem(error.message)
      setCarregando(false)
      return
    }

    setUsuarioEmail('')
    setCarregando(false)
    setMensagem('Você saiu da conta.')
  }

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: '0 auto' }}>
      <h1>Teste de Auth</h1>

      {usuarioEmail ? (
        <div>
          <p>Logada como: {usuarioEmail}</p>
          <button onClick={sair} disabled={carregando}>
            {carregando ? 'Saindo...' : 'Sair'}
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 12, fontSize: 16 }}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{ padding: 12, fontSize: 16 }}
          />

          <button onClick={cadastrar} disabled={carregando}>
            {carregando ? 'Carregando...' : 'Criar conta'}
          </button>

          <button onClick={entrar} disabled={carregando}>
            {carregando ? 'Carregando...' : 'Entrar'}
          </button>
        </div>
      )}

      {mensagem && <p style={{ marginTop: 16 }}>{mensagem}</p>}
    </div>
  )
}

export default AuthTest