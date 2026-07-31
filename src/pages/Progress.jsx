import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProgressContext as useProgress } from '../context/ProgressContext'
import { APP_CONFIG } from '../config/app.config'
import { ACHIEVEMENTS } from '../data/achievements'
import { MILESTONE_MESSAGES } from '../data/messages'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import PageTransition from '../components/PageTransition'

export default function Progress() {
  const {
    userProfile, dailyCheckins, checkInToday, hasCheckedInToday,
    getCheckinStreak, getTotalCheckins, photos, addPhoto, getDaysSinceStart,
    isAchievementUnlocked,
  } = useProgress()

  const [photoNote, setPhotoNote] = useState('')
  const totalDays = APP_CONFIG.guaranteeDays
  const daysSinceStart = getDaysSinceStart()
  const checkedIn = hasCheckedInToday()
  const streak = getCheckinStreak()
  const totalCheckins = getTotalCheckins()
  const adherencePercent = daysSinceStart > 0 ? Math.round((totalCheckins / Math.max(daysSinceStart, 1)) * 100) : 0

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      addPhoto({ url: reader.result, note: photoNote, type: photos.length === 0 ? 'antes' : 'progreso' })
      setPhotoNote('')
    }
    reader.readAsDataURL(file)
  }

  const startDate = userProfile?.startDate ? new Date(userProfile.startDate) : new Date()
  const days = Array.from({ length: totalDays }, (_, i) => {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const key = d.toISOString().split('T')[0]
    const today = new Date().toISOString().split('T')[0]
    return { key, dayNum: i + 1, checked: !!dailyCheckins[key], isPast: key < today, isToday: key === today }
  })

  // Next milestone
  const milestoneKeys = Object.keys(MILESTONE_MESSAGES).map(Number).sort((a, b) => a - b)
  const nextMilestone = milestoneKeys.find(d => d > streak)

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream pb-24">
        <Header title="Tu Progreso" subtitle={`Día ${Math.min(daysSinceStart + 1, totalDays)} de ${totalDays}`} />

        <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Días activa', value: totalCheckins, emoji: '📅' },
              { label: 'Racha', value: streak, emoji: '🔥' },
              { label: 'Adherencia', value: `${adherencePercent}%`, emoji: '💪' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl p-3 text-center border border-beige shadow-sm"
              >
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="font-serif text-xl text-terracota font-bold">{s.value}</div>
                <div className="text-xs text-light-brown mt-0.5">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Next milestone progress */}
          {nextMilestone && (
            <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
              <p className="text-xs text-light-brown mb-2">Próximo hito: <span className="font-medium text-terracota">{nextMilestone} días seguidos</span></p>
              <div className="h-2 bg-pale-rose rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-terracota to-dusty-rose rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(streak / nextMilestone) * 100}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <p className="text-xs text-light-brown/60 mt-1">{streak}/{nextMilestone} días</p>
            </div>
          )}

          {/* Check in */}
          <div className={`rounded-2xl p-4 border ${checkedIn ? 'bg-sage/10 border-sage/30' : 'bg-white border-pale-rose shadow-sm'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-warm-brown">{checkedIn ? '✅ ¡Práctica de hoy registrada!' : '¿Hiciste tu práctica hoy?'}</p>
                <p className="text-light-brown text-xs mt-0.5">Registra cada día para la garantía</p>
              </div>
              {!checkedIn && (
                <motion.button whileTap={{ scale: 0.92 }} onClick={checkInToday} className="bg-terracota text-white px-4 py-2 rounded-xl text-sm font-medium">
                  ¡Lo hice!
                </motion.button>
              )}
            </div>
          </div>

          {/* 60-day calendar */}
          <div>
            <h2 className="font-serif text-lg text-warm-brown font-semibold mb-3">Línea de tiempo — 60 días</h2>
            <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
              <div className="grid grid-cols-10 gap-1">
                {days.map(day => (
                  <div
                    key={day.key}
                    className={`aspect-square rounded-md flex items-center justify-center text-[9px] font-medium transition-all ${
                      day.checked ? 'bg-terracota text-white' :
                      day.isToday ? 'bg-terracota/20 border border-terracota text-terracota' :
                      day.isPast ? 'bg-pale-rose text-light-brown/40' :
                      'bg-beige text-light-brown/30'
                    }`}
                  >
                    {day.dayNum}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-light-brown flex-wrap">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-terracota"/>Completado</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-terracota/20 border border-terracota"/>Hoy</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-pale-rose"/>Perdido</div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h2 className="font-serif text-lg text-warm-brown font-semibold mb-3">Tus Logros</h2>
            <div className="grid grid-cols-3 gap-2">
              {ACHIEVEMENTS.map((a, i) => {
                const unlocked = isAchievementUnlocked(a.id)
                return (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className={`rounded-2xl p-3 text-center border transition-all ${
                      unlocked ? 'bg-white border-pale-rose shadow-sm' : 'bg-beige/40 border-beige opacity-50'
                    }`}
                  >
                    <div className={`text-2xl mb-1 ${!unlocked && 'grayscale'}`}>{a.emoji}</div>
                    <p className="text-xs font-medium text-warm-brown leading-tight">{a.name}</p>
                    {unlocked && <p className="text-[10px] text-terracota mt-0.5">Desbloqueado ✓</p>}
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Photos */}
          <div>
            <h2 className="font-serif text-lg text-warm-brown font-semibold mb-2">Fotos de progreso</h2>
            <p className="text-light-brown text-xs mb-3">Guarda tus fotos para la garantía de 60 días.</p>
            {photos.length > 0 && (
              <div className="grid grid-cols-2 gap-3 mb-3">
                {photos.map(photo => (
                  <div key={photo.id} className="bg-white rounded-2xl overflow-hidden border border-beige shadow-sm">
                    <img src={photo.url} alt={photo.note || 'Progreso'} className="w-full h-32 object-cover" />
                    <div className="p-2">
                      <p className="text-xs font-medium text-terracota">{photo.type === 'antes' ? '📷 Antes' : '📸 Progreso'}</p>
                      <p className="text-xs text-light-brown">{photo.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <input
              type="text"
              value={photoNote}
              onChange={e => setPhotoNote(e.target.value)}
              placeholder="Nota opcional..."
              className="w-full border border-beige rounded-xl px-3 py-2 text-sm text-warm-brown mb-2 focus:border-terracota outline-none bg-white"
            />
            <label className="block w-full bg-beige border border-beige rounded-xl py-3 text-center text-sm font-medium text-warm-brown cursor-pointer active:bg-pale-rose transition-colors">
              📷 Agregar foto de progreso
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
            </label>
          </div>

          {/* Guarantee */}
          <div className="bg-gradient-to-br from-beige to-cream rounded-2xl p-4 border border-beige">
            <h3 className="font-serif text-warm-brown font-semibold mb-2">🛡️ Garantía de {totalDays} días</h3>
            <p className="text-light-brown text-sm leading-relaxed mb-3">
              Si en {totalDays} días no ves resultados, devolvemos tu dinero con check-ins diarios y fotos de antes/después.
            </p>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}?subject=Garantía 60 días - ${userProfile?.name || ''}`}
              className="block text-center bg-warm-brown text-white py-2 rounded-xl text-sm font-medium"
            >
              Contactar soporte →
            </a>
          </div>
        </div>

        <Navigation />
      </div>
    </PageTransition>
  )
}
