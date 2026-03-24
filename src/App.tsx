import { Route, Routes } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Cadastro from './pages/Cadastro'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Alimentacao from './pages/Alimentacao'
import Treino from './pages/Treino'
import Progresso from './pages/Progresso'
import CheckIn from './pages/CheckIn'
import Desafios from './pages/Desafios'
import Perfil from './pages/Perfil'
import ResetPassword from './pages/ResetPassword'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/alimentacao" element={<Alimentacao />} />
      <Route path="/treino" element={<Treino />} />
      <Route path="/progresso" element={<Progresso />} />
      <Route path="/checkin" element={<CheckIn />} />
      <Route path="/desafios" element={<Desafios />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
