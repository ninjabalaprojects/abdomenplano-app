import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

export default function AchievementToast({ achievement, onDismiss }) {
  useEffect(() => {
    if (!achievement) return
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          initial={{ opacity: 0, y: -80, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -60, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="fixed top-4 left-4 right-4 z-[100] max-w-sm mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl border border-pale-rose px-4 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracota/10 flex items-center justify-center text-xl flex-shrink-0">
              {achievement.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-terracota">🏅 Logro desbloqueado</p>
              <p className="font-semibold text-warm-brown text-sm leading-tight">{achievement.name}</p>
              <p className="text-light-brown text-xs truncate">{achievement.desc}</p>
            </div>
            <button onClick={onDismiss} className="text-light-brown/40 text-lg leading-none p-1">×</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
