import { useEffect, useState } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase/client'
import Welcome from './pages/Welcome'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import AuthTest from './test/AuthTest'

function AreaTemporaria() {
  const navigate = useNavigate()
  const [usuarioEmail, setUsuarioEmail] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUsuarioEmail(data.session?.user?.email ?? '')
    })
  }, [])

  async function sair() {
    setCarregando(true)

    await supabase.auth.signOut()

    setUsuarioEmail('')
    setCarregando(false)
    navigate('/login')
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
          Área interna temporária
        </h1>

        <p style={{ color: '#6f5f58', marginBottom: 20 }}>
          Login funcionando.
        </p>

        <p style={{ marginBottom: 20, color: '#6f5f58' }}>
          Usuária logada: <strong>{usuarioEmail || 'não identificado'}</strong>
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          <button
            onClick={sair}
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
            {carregando ? 'Saindo...' : 'Sair'}
          </button>

          <Link to="/" style={{ color: '#a66f5a' }}>
            Voltar para Welcome
          </Link>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/app" element={<AreaTemporaria />} />
      <Route path="/teste-auth" element={<AuthTest />} />
    </Routes>
  )
}

export default App