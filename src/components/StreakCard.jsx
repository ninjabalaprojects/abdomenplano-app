import { motion } from 'framer-motion'

export default function StreakCard({ streak, totalCheckins, hasCheckedInToday, onCheckIn }) {
  return (
    <motion.div
      initial={{ scale: 0.97, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.1 }}
      className={`rounded-3xl p-5 border transition-all ${
        hasCheckedInToday
          ? 'bg-gradient-to-br from-sage/20 to-sage/10 border-sage/30'
          : 'bg-white border-pale-rose shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-end gap-2">
            <span className="font-serif text-5xl font-bold text-warm-brown leading-none">{streak}</span>
            <span className="text-2xl mb-1">🔥</span>
          </div>
          <p className="text-light-brown text-sm mt-1">
            {streak === 0 ? 'Empieza tu racha hoy' : streak === 1 ? 'día seguido' : 'días seguidos'}
          </p>
          <p className="text-light-brown/60 text-xs mt-0.5">{totalCheckins} prácticas en total</p>
        </div>
        {!hasCheckedInToday ? (
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onCheckIn}
            className="bg-terracota text-white px-5 py-3 rounded-2xl font-semibold text-sm shadow-md"
          >
            ¡Lo hice hoy! ✓
          </motion.button>
        ) : (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-sage/20 flex items-center justify-center text-2xl">✅</div>
            <p className="text-sage text-xs mt-1 font-medium">¡Hecho!</p>
          </div>
        )}
      </div>
      {streak > 0 && (
        <div className="mt-3 flex gap-1 flex-wrap">
          {Array.from({ length: Math.min(streak, 14) }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="w-5 h-5 rounded-md bg-terracota/80 flex items-center justify-center text-[9px]"
            >
              🔥
            </motion.div>
          ))}
          {streak > 14 && <span className="text-xs text-light-brown self-center">+{streak - 14} más</span>}
        </div>
      )}
    </motion.div>
  )
}
