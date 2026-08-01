import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider, useProgressContext } from './context/ProgressContext'
import { EntitlementProvider, useEntitlements } from './context/EntitlementContext'

import Onboarding from './pages/Onboarding'
import EmailGate from './pages/EmailGate'
import Dashboard from './pages/Dashboard'
import Phases from './pages/Phases'
import PhaseDetail from './pages/PhaseDetail'
import Progress from './pages/Progress'
import Bonuses from './pages/Bonuses'
import BonusDetail from './pages/BonusDetail'
import Profile from './pages/Profile'

function AppRoutes() {
  const { userProfile } = useProgressContext()
  const { email } = useEntitlements()
  const hasProfile = !!userProfile
  const hasEmail = !!email

  // Passo 1: coletar nome
  if (!hasProfile) {
    return (
      <Routes>
        <Route path="*" element={<Onboarding />} />
      </Routes>
    )
  }

  // Passo 2: verificar email de compra
  if (!hasEmail) {
    return (
      <Routes>
        <Route path="*" element={<EmailGate />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/phases" element={<Phases />} />
      <Route path="/phases/:id" element={<PhaseDetail />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/bonuses" element={<Bonuses />} />
      <Route path="/bonuses/:id" element={<BonusDetail />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <EntitlementProvider>
          <AppRoutes />
        </EntitlementProvider>
      </ProgressProvider>
    </BrowserRouter>
  )
}
