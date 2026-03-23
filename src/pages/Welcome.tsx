import { useNavigate } from 'react-router-dom'

function Welcome() {
  const navigate = useNavigate()

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
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: 14,
            color: '#9a7b6f',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          LeveFit
        </p>

        <h1
          style={{
            fontSize: 28,
            lineHeight: 1.2,
            marginBottom: 12,
            color: '#3f322d',
          }}
        >
          Emagreça com rotina real, sem radicalismo
        </h1>

        <p
          style={{
            fontSize: 15,
            color: '#6f5f58',
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Um app para te ajudar com alimentação, treino, água, sono e constância
          de um jeito leve e possível.
        </p>

        <div style={{ display: 'grid', gap: 12 }}>
          <button
            onClick={() => navigate('/cadastro')}
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
            Começar
          </button>

          <button
            onClick={() => navigate('/login')}
            style={{
              borderRadius: 16,
              padding: 14,
              fontSize: 16,
              fontWeight: 600,
              background: '#fff7f3',
              color: '#7c6358',
              border: '1px solid #e7d3ca',
              cursor: 'pointer',
            }}
          >
            Já tenho conta
          </button>
        </div>
      </div>
    </div>
  )
}

export default Welcome