import { createContext, useContext, useState } from 'react'
import { useProgress } from '../hooks/useProgress'

const ProgressContext = createContext(null)
const UserContext = createContext(null)

// Inner component — remounts when userId changes, reinitializing all hooks
function ProgressInner({ userId, children }) {
  const progress = useProgress(userId)
  return (
    <ProgressContext.Provider value={progress}>
      {children}
    </ProgressContext.Provider>
  )
}

export function ProgressProvider({ children }) {
  const [currentUserId, setCurrentUserId] = useState(() =>
    localStorage.getItem('ap_current_user') || null
  )
  const [usersList, setUsersList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ap_users') || '[]') } catch { return [] }
  })

  const createUser = (name) => {
    const id = Date.now().toString()
    const startDate = new Date().toISOString().split('T')[0]
    const profile = { name, startDate }
    const newUser = { id, name, startDate }
    const updated = [...usersList, newUser]
    setUsersList(updated)
    localStorage.setItem('ap_users', JSON.stringify(updated))
    // Pre-store the profile so it's ready when ProgressInner remounts
    localStorage.setItem(`u_${id}_user_profile`, JSON.stringify(profile))
    localStorage.setItem('ap_current_user', id)
    setCurrentUserId(id)
  }

  const switchUser = (userId) => {
    localStorage.setItem('ap_current_user', userId)
    setCurrentUserId(userId)
  }

  const logOut = () => {
    localStorage.removeItem('ap_current_user')
    setCurrentUserId(null)
  }

  const deleteUser = (userId) => {
    const updated = usersList.filter(u => u.id !== userId)
    setUsersList(updated)
    localStorage.setItem('ap_users', JSON.stringify(updated))
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(`u_${userId}_`)) localStorage.removeItem(key)
    })
    if (currentUserId === userId) {
      const next = updated[0]
      if (next) {
        localStorage.setItem('ap_current_user', next.id)
        setCurrentUserId(next.id)
      } else {
        localStorage.removeItem('ap_current_user')
        setCurrentUserId(null)
      }
    }
  }

  return (
    <UserContext.Provider value={{ currentUserId, usersList, createUser, switchUser, logOut, deleteUser }}>
      <ProgressInner key={currentUserId || 'none'} userId={currentUserId}>
        {children}
      </ProgressInner>
    </UserContext.Provider>
  )
}

export function useProgressContext() {
  return useContext(ProgressContext)
}

export function useUserContext() {
  return useContext(UserContext)
}
