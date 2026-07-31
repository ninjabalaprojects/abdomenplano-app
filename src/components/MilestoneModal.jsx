import { motion, AnimatePresence } from 'framer-motion'

export default function MilestoneModal({ milestone, onClose }) {
  return (
    <AnimatePresence>
      {milestone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-warm-brown/50 flex items-center justify-center z-50 p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-cream rounded-3xl p-8 w-full text-center shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1.2, 1.1, 1] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-6xl mb-4"
            >
              {milestone.title.split(' ')[1]}
            </motion.div>
            <h2 className="font-serif text-2xl text-warm-brown font-bold mb-2">{milestone.title}</h2>
            <p className="text-light-brown text-base leading-relaxed mb-6">{milestone.message}</p>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="bg-terracota text-white px-8 py-3 rounded-2xl font-semibold"
            >
              ¡Seguir adelante! 💪
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
