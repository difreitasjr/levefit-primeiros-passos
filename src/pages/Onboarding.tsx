import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Onboarding() {
  const navigate = useNavigate()

  const [nome, setNome] = useState('')
  const [objetivo, setObjetivo] = useState('')

  function finalizarOnboarding() {
    localStorage.setItem(
      'levefit_onboarding',
      JSON.stringify({
        nome,
        objetivo,
      })
    )

    navigate('/app')
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Onboarding</h1>

      <div style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
        <input
          type="text"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={{ padding: 12 }}
        />

        <select
          value={objetivo}
          onChange={(e) => setObjetivo(e.target.value)}
          style={{ padding: 12 }}
        >
          <option value="">Objetivo principal</option>
          <option value="Emagrecer">Emagrecer</option>
          <option value="Manter">Manter</option>
          <option value="Ganhar massa">Ganhar massa</option>
        </select>

        <button onClick={finalizarOnboarding}>
          Finalizar
        </button>
      </div>
    </div>
  )
}

export default Onboarding