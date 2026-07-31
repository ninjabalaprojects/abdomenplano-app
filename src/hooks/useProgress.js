import { useLocalStorage } from './useLocalStorage'
import { ACHIEVEMENTS } from '../data/achievements'

const today = () => new Date().toISOString().split('T')[0]

export function useProgress(userId) {
  const p = userId ? `u_${userId}_` : 'u_default_'

  const [userProfile, setUserProfile] = useLocalStorage(`${p}user_profile`, null)
  const [unlockedPhases, setUnlockedPhases] = useLocalStorage(`${p}completed_phases`, [])
  const [phaseDailyLog, setPhaseDailyLog] = useLocalStorage(`${p}phase_daily_log`, {})
  const [dailyCheckins, setDailyCheckins] = useLocalStorage(`${p}daily_checkins`, {})
  const [photos, setPhotos] = useLocalStorage(`${p}progress_photos`, [])
  const [phaseChecklists, setPhaseChecklists] = useLocalStorage(`${p}phase_checklists`, {})
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage(`${p}achievements`, [])

  const completedPhases = unlockedPhases

  const markPhaseComplete = (phaseId) => {
    if (!unlockedPhases.includes(phaseId)) {
      setUnlockedPhases([...unlockedPhases, phaseId])
    }
    const todayKey = today()
    setPhaseDailyLog(prev => {
      const todayPhases = prev[todayKey] || []
      if (todayPhases.includes(phaseId)) return prev
      return { ...prev, [todayKey]: [...todayPhases, phaseId] }
    })
  }

  const isPhaseUnlocked = (phaseId) => {
    if (phaseId === 1) return true
    return unlockedPhases.includes(phaseId - 1)
  }

  const isPhaseEverCompleted = (phaseId) => unlockedPhases.includes(phaseId)
  const isPhaseCompleteToday = (phaseId) => (phaseDailyLog[today()] || []).includes(phaseId)
  const getPhasesCompletedToday = () => phaseDailyLog[today()] || []
  const isPhaseComplete = isPhaseCompleteToday

  const checkInToday = () => {
    const todayStr = today()
    setDailyCheckins(prev => ({ ...prev, [todayStr]: true }))
  }

  const hasCheckedInToday = () => !!dailyCheckins[today()]

  const getCheckinStreak = () => {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().split('T')[0]
      if (dailyCheckins[key]) { streak++; d.setDate(d.getDate() - 1) }
      else break
    }
    return streak
  }

  const getTotalCheckins = () => Object.keys(dailyCheckins).length

  const toggleChecklistItem = (phaseId, itemIndex) => {
    setPhaseChecklists(prev => {
      const phaseKey = `phase_${phaseId}`
      const todayKey = today()
      const existing = prev[phaseKey]?.[todayKey] || []
      const updated = existing.includes(itemIndex)
        ? existing.filter(i => i !== itemIndex)
        : [...existing, itemIndex]
      return { ...prev, [phaseKey]: { ...(prev[phaseKey] || {}), [todayKey]: updated } }
    })
  }

  const getTodayChecklist = (phaseId) =>
    phaseChecklists[`phase_${phaseId}`]?.[today()] || []

  const addPhoto = (photoData) => {
    setPhotos(prev => [...prev, { ...photoData, date: today(), id: Date.now() }])
  }

  const getDaysSinceStart = () => {
    if (!userProfile?.startDate) return 0
    const start = new Date(userProfile.startDate)
    return Math.floor((new Date() - start) / (1000 * 60 * 60 * 24))
  }

  const checkNewAchievements = () => {
    const params = {
      totalCheckins: getTotalCheckins(),
      streak: getCheckinStreak(),
      completedPhases,
      photos: photos.length,
    }
    const newOnes = ACHIEVEMENTS.filter(a =>
      !unlockedAchievements.includes(a.id) && a.condition(params)
    )
    if (newOnes.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newOnes.map(a => a.id)])
    }
    return newOnes
  }

  const isAchievementUnlocked = (id) => unlockedAchievements.includes(id)

  return {
    userProfile, setUserProfile,
    completedPhases, markPhaseComplete,
    isPhaseUnlocked, isPhaseComplete,
    isPhaseCompleteToday, isPhaseEverCompleted,
    getPhasesCompletedToday,
    dailyCheckins, checkInToday, hasCheckedInToday,
    getCheckinStreak, getTotalCheckins,
    toggleChecklistItem, getTodayChecklist,
    photos, addPhoto,
    getDaysSinceStart,
    checkNewAchievements, isAchievementUnlocked, unlockedAchievements,
  }
}
