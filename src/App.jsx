import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProgressProvider, useProgressContext, useUserContext } from './context/ProgressContext'

import ProfileSelect from './pages/ProfileSelect'
import Dashboard from './pages/Dashboard'
import Phases from './pages/Phases'
import PhaseDetail from './pages/PhaseDetail'
import Progress from './pages/Progress'
import Bonuses from './pages/Bonuses'
import BonusDetail from './pages/BonusDetail'
import Profile from './pages/Profile'

function AppRoutes() {
  const { currentUserId } = useUserContext()
  const { userProfile } = useProgressContext()

  if (!currentUserId || !userProfile) {
    return <ProfileSelect />
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
        <AppRoutes />
      </ProgressProvider>
    </BrowserRouter>
  )
}
