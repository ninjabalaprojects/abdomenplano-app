import { useLocalStorage } from './useLocalStorage'
import { ACHIEVEMENTS } from '../data/achievements'

const today = () => new Date().toISOString().split('T')[0]

export function useProgress() {
  const [userProfile, setUserProfile] = useLocalStorage('user_profile', null)
  // unlockedPhases: permanent — only used to unlock next phase
  const [unlockedPhases, setUnlockedPhases] = useLocalStorage('completed_phases', [])
  // phaseDailyLog: { 'YYYY-MM-DD': [1, 2, 3, 4] } — resets each day
  const [phaseDailyLog, setPhaseDailyLog] = useLocalStorage('phase_daily_log', {})
  const [dailyCheckins, setDailyCheckins] = useLocalStorage('daily_checkins', {})
  const [photos, setPhotos] = useLocalStorage('progress_photos', [])
  const [phaseChecklists, setPhaseChecklists] = useLocalStorage('phase_checklists', {})
  const [unlockedAchievements, setUnlockedAchievements] = useLocalStorage('achievements', [])

  // completedPhases exposed for backwards compat (achievements etc)
  const completedPhases = unlockedPhases

  const markPhaseComplete = (phaseId) => {
    // unlock permanently (for next-phase access)
    if (!unlockedPhases.includes(phaseId)) {
      setUnlockedPhases([...unlockedPhases, phaseId])
    }
    // mark as done today
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

  // permanent unlock (for showing lock/unlock UI only)
  const isPhaseEverCompleted = (phaseId) => unlockedPhases.includes(phaseId)

  // daily — resets each day
  const isPhaseCompleteToday = (phaseId) => (phaseDailyLog[today()] || []).includes(phaseId)

  const getPhasesCompletedToday = () => phaseDailyLog[today()] || []

  // Legacy alias used in achievements/dashboard
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
      if (dailyCheckins[key]) {
        streak++
        d.setDate(d.getDate() - 1)
      } else break
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
