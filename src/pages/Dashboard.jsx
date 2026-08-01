import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgressContext as useProgress } from '../context/ProgressContext'
import { useEntitlements } from '../context/EntitlementContext'
import { PHASES } from '../data/phases'
import { APP_CONFIG } from '../config/app.config'
import { DAILY_MESSAGES, MILESTONE_MESSAGES } from '../data/messages'
import Navigation from '../components/Navigation'
import PhaseCard from '../components/PhaseCard'
import { BONUSES } from '../data/bonuses'
import StreakCard from '../components/StreakCard'
import AchievementToast from '../components/AchievementToast'
import MilestoneModal from '../components/MilestoneModal'
import OFFERS from '../config/offers.json'

const COLAGENO_OFFER = OFFERS.offers.find(o => o.id === 'colageno_hormonal')

export default function Dashboard() {
  const navigate = useNavigate()
  const {
    userProfile, checkInToday, hasCheckedInToday,
    completedPhases, isPhaseUnlocked, isPhaseCompleteToday, isPhaseEverCompleted,
    getPhasesCompletedToday, getCheckinStreak,
    getDaysSinceStart, getTotalCheckins, checkNewAchievements,
  } = useProgress()

  const { isUnlocked, fetchEntitlements } = useEntitlements()

  const [toastAchievement, setToastAchievement] = useState(null)
  const [milestone, setMilestone] = useState(null)
  const [shownMilestones, setShownMilestones] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shown_milestones') || '[]') } catch { return [] }
  })

  // Revalidar entitlements toda vez que o dashboard abre
  useEffect(() => {
    fetchEntitlements()
  }, [])

  const phasesCompletedToday = getPhasesCompletedToday()
  const unlockedPhasesList = PHASES.filter(p => isPhaseEverCompleted(p.id) || isPhaseUnlocked(p.id))
  const todayProgress = phasesCompletedToday.length
  const nextPhase = PHASES.find(p => isPhaseUnlocked(p.id) && !isPhaseCompleteToday(p.id))
  const progress = (phasesCompletedToday.length / PHASES.length) * 100
  const checkedIn = hasCheckedInToday()
  const streak = getCheckinStreak()
  const daysSinceStart = getDaysSinceStart()
  const totalCheckins = getTotalCheckins()
  const dailyMsg = DAILY_MESSAGES[daysSinceStart % DAILY_MESSAGES.length]

  const cologenoUnlocked = isUnlocked('colageno_hormonal')

  const handleCheckIn = () => {
    checkInToday()
    const newAchievements = checkNewAchievements()
    if (newAchievements.length > 0) setToastAchievement(newAchievements[0])
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
    <div className="min-h-screen bg-cream pb-nav-safe">
      <AchievementToast achievement={toastAchievement} onDismiss={() => setToastAchievement(null)} />
      <MilestoneModal milestone={milestone} onClose={() => setMilestone(null)} />

      {/* Top greeting */}
      <div className="bg-gradient-to-b from-beige to-cream px-5 pt-10 pb-5">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-light-brown text-sm">Hola, 💛</p>
              <h1 className="font-serif text-3xl text-warm-brown font-bold leading-tight">
                {userProfile?.name || 'Bienvenida'}
              </h1>
              <p className="text-light-brown text-sm mt-0.5">Día {daysSinceStart + 1} · {APP_CONFIG.productName}</p>
            </div>
            <img
              src="/logo/logo.jpg"
              alt="Logo"
              className="w-14 h-14 object-contain rounded-xl flex-shrink-0"
              onError={e => { e.target.style.display = 'none' }}
            />
          </div>
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
              style={nextPhase.bannerImage ? { backgroundImage: `url(${nextPhase.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              className={`relative rounded-2xl overflow-hidden border border-pale-rose shadow-sm cursor-pointer ${!nextPhase.bannerImage ? 'bg-white' : ''}`}
            >
              {nextPhase.bannerImage && <div className="absolute inset-0 bg-warm-brown/55" />}
              <div className="relative flex items-center gap-3 p-4">
                <div className="flex-1">
                  <span className={`text-xs font-medium ${nextPhase.bannerImage ? 'text-white/70' : 'text-terracota'}`}>Fase {nextPhase.id}</span>
                  <h3 className={`font-serif font-semibold leading-tight ${nextPhase.bannerImage ? 'text-white' : 'text-warm-brown'}`}>{nextPhase.name}</h3>
                  <p className={`text-xs mt-0.5 ${nextPhase.bannerImage ? 'text-white/60' : 'text-light-brown'}`}>{nextPhase.duration}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-sm flex-shrink-0">›</div>
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
            {PHASES.map((phase, i) => (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
              >
                <PhaseCard phase={phase} compact />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bonuses */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-serif text-lg text-warm-brown font-semibold">Tus Bonos</h2>
            <button onClick={() => navigate('/bonuses')} className="text-terracota text-sm font-medium">Ver todos →</button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {BONUSES.map((bonus, i) => (
              <motion.div
                key={bonus.id}
                whileTap={{ scale: 0.93 }}
                onClick={() => navigate(`/bonuses/${i + 1}`)}
                style={bonus.bannerImage ? { backgroundImage: `url(${bonus.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                className="relative rounded-2xl overflow-hidden border border-pale-rose shadow-sm cursor-pointer min-h-[90px]"
              >
                {bonus.bannerImage && <div className="absolute inset-0 bg-warm-brown/55" />}
                <div className="relative p-3 flex flex-col items-center justify-center text-center h-full min-h-[90px]">
                  <p className={`text-xs font-medium leading-tight ${bonus.bannerImage ? 'text-white' : 'text-warm-brown'}`}>{bonus.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Protocolo Colágeno Hormonal */}
        {COLAGENO_OFFER && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            {cologenoUnlocked ? (
              // ✅ DESBLOQUEADO — clique leva para a página de conteúdo
              <motion.div
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/colageno-hormonal')}
                className="bg-white rounded-2xl border border-pale-rose shadow-sm overflow-hidden cursor-pointer"
              >
                <div className="relative flex items-center justify-center bg-beige overflow-hidden">
                  {COLAGENO_OFFER.image
                    ? <img src={COLAGENO_OFFER.image} alt={COLAGENO_OFFER.name} className="w-full object-contain" />
                    : <div className="h-32 w-full flex items-center justify-center"><span className="text-4xl">✨</span></div>
                  }
                  <span className="absolute top-3 right-3 text-xs bg-sage text-white px-3 py-1 rounded-full font-medium shadow">
                    ✓ Desbloqueado
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg text-warm-brown font-semibold">{COLAGENO_OFFER.name}</h3>
                    <p className="text-light-brown text-xs mt-0.5">{COLAGENO_OFFER.description}</p>
                  </div>
                  <span className="text-terracota text-2xl flex-shrink-0">›</span>
                </div>
              </motion.div>
            ) : (
              // 🔒 BLOQUEADO — card com cadeado, clique leva ao checkout
              <div className="bg-white rounded-2xl border border-pale-rose shadow-sm overflow-hidden">
                <div className="relative flex items-center justify-center bg-beige overflow-hidden">
                  {COLAGENO_OFFER.image
                    ? <img src={COLAGENO_OFFER.image} alt={COLAGENO_OFFER.name} className="w-full object-contain" />
                    : <div className="h-32 w-full flex items-center justify-center"><span className="text-4xl">✨</span></div>
                  }
                  {/* Cadeado overlay */}
                  <div className="absolute inset-0 bg-warm-brown/30 flex items-center justify-center">
                    <div className="bg-white/90 rounded-full w-12 h-12 flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🔒</span>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 text-xs bg-terracota text-white px-3 py-1 rounded-full font-medium shadow">
                    {COLAGENO_OFFER.tag || 'Edición Especial'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-serif text-lg text-warm-brown font-semibold">{COLAGENO_OFFER.name}</h3>
                  <p className="text-light-brown text-xs mt-1 mb-3 leading-relaxed">{COLAGENO_OFFER.description}</p>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-terracota font-bold text-2xl">${COLAGENO_OFFER.price} USD</span>
                        {COLAGENO_OFFER.originalPrice && (
                          <span className="text-light-brown/50 text-sm line-through">${COLAGENO_OFFER.originalPrice}</span>
                        )}
                      </div>
                      {COLAGENO_OFFER.discount && (
                        <span className="inline-block bg-terracota/10 text-terracota text-xs font-bold px-2 py-0.5 rounded-full mt-0.5">
                          {COLAGENO_OFFER.discount} · Solo por hoy
                        </span>
                      )}
                    </div>
                    <a
                      href={COLAGENO_OFFER.checkout_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-terracota text-white px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-95 transition-all flex-shrink-0"
                    >
                      Quiero esto →
                    </a>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </div>

      <Navigation />
    </div>
  )
}
