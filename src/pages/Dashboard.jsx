import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressContext as useProgress } from '../context/ProgressContext'
import { PHASES } from '../data/phases'
import { APP_CONFIG } from '../config/app.config'
import { DAILY_MESSAGES, MILESTONE_MESSAGES } from '../data/messages'
import offersConfig from '../config/offers.json'
import OfferCard from '../components/OfferCard'
import Navigation from '../components/Navigation'
import StreakCard from '../components/StreakCard'
import AchievementToast from '../components/AchievementToast'
import MilestoneModal from '../components/MilestoneModal'
import PageTransition from '../components/PageTransition'

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    userProfile, checkInToday, hasCheckedInToday,
    completedPhases, isPhaseUnlocked, isPhaseCompleteToday, isPhaseEverCompleted,
    getPhasesCompletedToday, getCheckinStreak,
    getDaysSinceStart, getTotalCheckins, checkNewAchievements,
  } = useProgress()

  const [toastAchievement, setToastAchievement] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [shownMilestones, setShownMilestones] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shown_milestones') || '[]') } catch { return [] }
  })

  const phasesCompletedToday = getPhasesCompletedToday()
  const unlockedPhasesList = PHASES.filter(p => isPhaseEverCompleted(p.id) || isPhaseUnlocked(p.id))
  const todayProgress = phasesCompletedToday.length
  const totalUnlocked = unlockedPhasesList.length
  // next phase to do today = first unlocked phase not done today
  const nextPhase = PHASES.find(p => isPhaseUnlocked(p.id) && !isPhaseCompleteToday(p.id))
  const progress = (phasesCompletedToday.length / PHASES.length) * 100
  const checkedIn = hasCheckedInToday()
  const streak = getCheckinStreak()
  const daysSinceStart = getDaysSinceStart()
  const totalCheckins = getTotalCheckins()
  const dailyMsg = DAILY_MESSAGES[daysSinceStart % DAILY_MESSAGES.length]
  const firstOffer = offersConfig.offers.find(o => o.active)

  const handleCheckIn = () => {
    checkInToday()
    const newAchievements = checkNewAchievements()
    if (newAchievements.length > 0) setToastAchievement(newAchievements[0])
    // check milestones
    const newStreak = streak + 1
    const ms = MILESTONE_MESSAGES[newStreak]
    if (ms && !shownMilestones.includes(newStreak)) {
      setMilestone(ms)
      const updated = [...shownMilestones, newStreak]
      setShownMilestones(updated)
      localStorage.setItem('shown_milestones', JSON.stringify(updated))
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <AchievementToast achievement={toastAchievement} onDismiss={() => setToastAchievement(null)} />
      <MilestoneModal milestone={milestone} onClose={() => setMilestone(null)} />

      {/* Top greeting */}
      <div className="bg-gradient-to-b from-beige to-cream px-5 pt-10 pb-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <p className="text-light-brown text-sm">Hola, 💛</p>
          <h1 className="font-serif text-3xl text-warm-brown font-bold leading-tight">
            {userProfile?.name || 'Bienvenida'}
          </h1>
          <p className="text-light-brown text-sm mt-0.5">Día {daysSinceStart + 1} · {APP_CONFIG.productName}</p>
        </motion.div>

        {/* Daily progress bar */}
        <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="flex justify-between text-xs text-light-brown mb-1.5">
            <span>Práctica de hoy</span>
            <span className="font-medium text-terracota">{todayProgress}/{PHASES.length} fases</span>
          </div>
          <div className="h-2 bg-pale-rose rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-terracota to-dusty-rose rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(progress, 3)}%` }}
              transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            />
          </div>
          {todayProgress >= PHASES.length && (
            <p className="text-sage text-xs font-medium mt-1">🌟 ¡Práctica del día completada! Descansa y regresa mañana.</p>
          )}
        </motion.div>
      </div>

      <div className="max-w-lg mx-auto px-4 space-y-4">
        {/* Streak card */}
        <StreakCard
          streak={streak}
          totalCheckins={totalCheckins}
          hasCheckedInToday={checkedIn}
          onCheckIn={handleCheckIn}
        />

        {/* Daily message */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-dusty-rose/20 to-pale-rose/30 rounded-2xl p-4 border border-dusty-rose/20"
        >
          <p className="text-xs font-medium text-dusty-rose mb-1">💬 Mensaje de hoy · {dailyMsg.author}</p>
          <p className="text-warm-brown text-sm leading-relaxed italic">"{dailyMsg.text}"</p>
        </motion.div>

        {/* Next phase */}
        {nextPhase && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <h2 className="font-serif text-lg text-warm-brown font-semibold mb-2">Tu próxima clase</h2>
            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(`/phases/${nextPhase.id}`)}
              className="bg-white rounded-2xl p-4 border border-pale-rose shadow-sm cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-terracota/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {nextPhase.emoji}
                </div>
                <div className="flex-1">
                  <span className="text-xs text-terracota font-medium">Fase {nextPhase.id}</span>
                  <h3 className="font-serif text-warm-brown font-semibold leading-tight">{nextPhase.name}</h3>
                  <p className="text-light-brown text-xs mt-0.5">{nextPhase.duration}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-terracota flex items-center justify-center text-white text-sm">›</div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {completedPhases.length === PHASES.length && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gradient-to-br from-sage/20 to-sage/10 rounded-2xl p-5 text-center border border-sage/30"
          >
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-serif text-warm-brown font-bold text-lg">¡Completaste el protocolo!</h3>
            <p className="text-light-brown text-sm mt-1">Eres parte del 5% que termina. Eso dice todo.</p>
          </motion.div>
        )}

        {/* Phases grid */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-serif text-lg text-warm-brown font-semibold">Las 4 Fases</h2>
            <button onClick={() => navigate('/phases')} className="text-terracota text-sm font-medium">Ver todas →</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PHASES.map((phase, i) => {
              const unlocked = isPhaseUnlocked(phase.id)
              const doneToday = isPhaseCompleteToday(phase.id)
              return (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  whileTap={unlocked ? { scale: 0.95 } : {}}
                  onClick={() => unlocked && navigate(`/phases/${phase.id}`)}
                  className={`rounded-2xl p-3 border transition-all ${
                    doneToday ? 'bg-sage/10 border-sage/30' :
                    unlocked ? 'bg-white border-pale-rose shadow-sm cursor-pointer' :
                    'bg-beige/50 border-beige opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div className="text-2xl mb-1">{doneToday ? '✅' : unlocked ? phase.emoji : '🔒'}</div>
                  <p className="text-xs text-light-brown">Fase {phase.id}</p>
                  <p className="text-sm font-medium text-warm-brown leading-tight">{phase.name}</p>
                  {doneToday && <p className="text-[10px] text-sage mt-0.5 font-medium">Hecha hoy ✓</p>}
                  {!doneToday && unlocked && <p className="text-[10px] text-terracota mt-0.5">Pendiente</p>}
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Bonuses */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-serif text-lg text-warm-brown font-semibold">Tus Bonos</h2>
            <button onClick={() => navigate('/bonuses')} className="text-terracota text-sm font-medium">Ver todos →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { emoji: '🔥', name: 'Queima 21', path: '/bonuses/1' },
              { emoji: '🧘', name: 'Super Flex', path: '/bonuses/2' },
              { emoji: '🥗', name: 'Guía Nutri', path: '/bonuses/3' },
            ].map((b, i) => (
              <motion.div
                key={i}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate(b.path)}
                className="bg-white rounded-2xl p-3 text-center border border-pale-rose shadow-sm cursor-pointer"
              >
                <div className="text-2xl mb-1">{b.emoji}</div>
                <p className="text-xs text-warm-brown font-medium leading-tight">{b.name}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* WhatsApp */}
        <motion.a
          href={APP_CONFIG.whatsappGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-3 bg-gradient-to-r from-[#25D366]/15 to-[#128C7E]/10 rounded-2xl p-4 border border-[#25D366]/20"
        >
          <span className="text-3xl">💬</span>
          <div className="flex-1">
            <p className="font-medium text-warm-brown text-sm">Desafío Ativa 7D</p>
            <p className="text-light-brown text-xs">Carolina en vivo · Comunidad de apoyo</p>
          </div>
          <span className="bg-[#25D366] text-white px-3 py-1.5 rounded-xl text-xs font-medium">Entrar</span>
        </motion.a>

        {/* Upsell */}
        {firstOffer && (
          <div>
            <p className="text-xs text-light-brown/60 mb-2 text-center">Oferta exclusiva para miembros</p>
            <OfferCard offer={firstOffer} />
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
