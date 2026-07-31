import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Inicio' },
  { path: '/phases',    icon: '📋', label: 'Fases' },
  { path: '/progress',  icon: '📈', label: 'Progreso' },
  { path: '/bonuses',   icon: '🎁', label: 'Bonos' },
  { path: '/profile',   icon: '👤', label: 'Perfil' },
]

export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-pale-rose z-50 pb-safe">
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <motion.button
              key={item.path}
              onClick={() => navigate(item.path)}
              whileTap={{ scale: 0.88 }}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl relative min-w-[56px]"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-terracota/10 rounded-2xl"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="text-xl relative z-10">{item.icon}</span>
              <span className={`text-[10px] font-medium relative z-10 ${isActive ? 'text-terracota' : 'text-light-brown/50'}`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </nav>
  )
}
