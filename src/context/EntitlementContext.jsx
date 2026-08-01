import { createContext, useContext, useState, useCallback } from 'react'

const EntitlementContext = createContext(null)

function loadStored() {
  try {
    return {
      email: localStorage.getItem('user_email') || null,
      entitlements: JSON.parse(localStorage.getItem('user_entitlements') || '[]'),
    }
  } catch {
    return { email: null, entitlements: [] }
  }
}

export function EntitlementProvider({ children }) {
  const stored = loadStored()
  const [email, setEmailState] = useState(stored.email)
  const [entitlements, setEntitlements] = useState(stored.entitlements)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchEntitlements = useCallback(async (emailToFetch) => {
    const e = emailToFetch || email
    if (!e) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/entitlements?email=${encodeURIComponent(e)}`)
      if (!res.ok) throw new Error('Falha ao consultar acesso')
      const data = await res.json()
      const products = data.products || []
      setEntitlements(products)
      localStorage.setItem('user_entitlements', JSON.stringify(products))
    } catch (err) {
      setError(err.message)
      // Em caso de erro, mantém entitlements anteriores salvas
    } finally {
      setLoading(false)
    }
  }, [email])

  const saveEmail = useCallback(async (newEmail) => {
    const e = newEmail.toLowerCase().trim()
    setEmailState(e)
    localStorage.setItem('user_email', e)
    await fetchEntitlements(e)
  }, [fetchEntitlements])

  const clearEmail = useCallback(() => {
    setEmailState(null)
    setEntitlements([])
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_entitlements')
  }, [])

  const isUnlocked = useCallback((productKey) => {
    return entitlements.includes(productKey)
  }, [entitlements])

  return (
    <EntitlementContext.Provider value={{
      email,
      entitlements,
      loading,
      error,
      saveEmail,
      clearEmail,
      fetchEntitlements,
      isUnlocked,
    }}>
      {children}
    </EntitlementContext.Provider>
  )
}

export function useEntitlements() {
  return useContext(EntitlementContext)
}
