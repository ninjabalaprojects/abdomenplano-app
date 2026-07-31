import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider, useProgressContext } from './context/ProgressContext'

import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Phases from './pages/Phases'
import PhaseDetail from './pages/PhaseDetail'
import Progress from './pages/Progress'
import Bonuses from './pages/Bonuses'
import BonusDetail from './pages/BonusDetail'
import Profile from './pages/Profile'

function AppRoutes() {
  const { userProfile } = useProgressContext()
  const hasProfile = !!userProfile

  return (
    <Routes>
      <Route path="/" element={hasProfile ? <Navigate to="/dashboard" /> : <Onboarding />} />
      <Route path="/dashboard" element={hasProfile ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/phases" element={hasProfile ? <Phases /> : <Navigate to="/" />} />
      <Route path="/phases/:id" element={hasProfile ? <PhaseDetail /> : <Navigate to="/" />} />
      <Route path="/progress" element={hasProfile ? <Progress /> : <Navigate to="/" />} />
      <Route path="/bonuses" element={hasProfile ? <Bonuses /> : <Navigate to="/" />} />
      <Route path="/bonuses/:id" element={hasProfile ? <BonusDetail /> : <Navigate to="/" />} />
      <Route path="/profile" element={hasProfile ? <Profile /> : <Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ProgressProvider>
        <AppRoutes />
      </ProgressProvider>
    </BrowserRouter>
  )
}
