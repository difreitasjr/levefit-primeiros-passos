import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase/client'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)

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

    setTimeout(() => {
      navigate('/app')
    }, 800)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8f3ee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 24,
          padding: 28,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        }}
      >
        <p style={{ fontSize: 14, color: '#9a7b6f', marginBottom: 8 }}>
          LeveFit
        </p>

        <h1 style={{ fontSize: 28, marginBottom: 10, color: '#3f322d' }}>
          Entrar
        </h1>

        <p style={{ color: '#6f5f58', marginBottom: 20 }}>
          Acesse sua conta para continuar.
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: 14,
              borderRadius: 14,
              border: '1px solid #e2d4cc',
              fontSize: 16,
            }}
          />

          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            style={{
              padding: 14,
              borderRadius: 14,
              border: '1px solid #e2d4cc',
              fontSize: 16,
            }}
          />

          <button
            onClick={entrar}
            disabled={carregando}
            style={{
              border: 'none',
              borderRadius: 16,
              padding: 14,
              fontSize: 16,
              fontWeight: 600,
              background: '#d6a692',
              color: '#ffffff',
              cursor: 'pointer',
            }}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {mensagem && (
          <p style={{ marginTop: 16, color: '#6f5f58', lineHeight: 1.5 }}>
            {mensagem}
          </p>
        )}

        <p style={{ marginTop: 20, color: '#6f5f58' }}>
          Ainda não tem conta?{' '}
          <Link to="/cadastro" style={{ color: '#a66f5a', fontWeight: 600 }}>
            Criar conta
          </Link>
        </p>

        <p style={{ marginTop: 8 }}>
          <Link to="/" style={{ color: '#a66f5a' }}>
            Voltar
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login