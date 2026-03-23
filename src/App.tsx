import { Route, Routes } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/app"
        element={<div style={{ padding: 24 }}>Área temporária</div>}
      />
    </Routes>
  )
}

export default App