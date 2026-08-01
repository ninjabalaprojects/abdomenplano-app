import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { COLAGENO_PRODUCT, COLAGENO_MODULES } from '../data/colageno'
import Navigation from '../components/Navigation'

export default function ColagenoHormonal() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-cream pb-nav-safe">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden bg-beige">
        {COLAGENO_PRODUCT.bannerImage && (
          <img
            src={COLAGENO_PRODUCT.bannerImage}
            alt={COLAGENO_PRODUCT.name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/80 via-warm-brown/30 to-warm-brown/20" />
        <button
          onClick={() => navigate('/dashboard')}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl"
        >
          ‹
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p className="text-white/70 text-xs">Protocolo completo desbloqueado ✓</p>
          <h1 className="font-serif text-2xl text-white font-bold leading-tight">{COLAGENO_PRODUCT.name}</h1>
          <p className="text-white/60 text-sm mt-0.5">{COLAGENO_PRODUCT.subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-8 space-y-4">
        {/* Intro */}
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-warm-brown text-sm leading-relaxed">{COLAGENO_PRODUCT.description}</p>
        </div>

        {/* Modules */}
        <div>
          <h2 className="font-serif text-lg text-warm-brown font-semibold mb-3">Tu contenido</h2>
          <div className="space-y-3">
            {COLAGENO_MODULES.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/colageno-hormonal/${mod.id}`)}
                className="cursor-pointer"
              >
                {mod.isSecret ? (
                  // Bono secreto — visual misterioso
                  <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-warm-brown/30 bg-gradient-to-br from-warm-brown/10 to-beige">
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-14 h-14 rounded-2xl bg-warm-brown/20 flex items-center justify-center text-2xl flex-shrink-0 border-2 border-dashed border-warm-brown/30">
                        ❓
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs bg-warm-brown/20 text-warm-brown px-2 py-0.5 rounded-full font-medium">
                            Bono Secreto
                          </span>
                        </div>
                        <h3 className="font-serif text-warm-brown font-semibold leading-tight">{mod.name}</h3>
                        <p className="text-light-brown text-xs mt-0.5">{mod.subtitle}</p>
                      </div>
                      <span className="text-warm-brown/40 text-xl flex-shrink-0">›</span>
                    </div>
                  </div>
                ) : (
                  // Módulo normal
                  <div className={`relative rounded-2xl overflow-hidden border border-pale-rose shadow-sm bg-gradient-to-br ${mod.bannerColor}`}>
                    <div className="flex items-center gap-4 p-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/60 flex items-center justify-center text-2xl flex-shrink-0">
                        {mod.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-terracota font-medium">Módulo {mod.id}</span>
                        <h3 className="font-serif text-warm-brown font-semibold leading-tight">{mod.name}</h3>
                        <p className="text-light-brown text-xs mt-0.5 line-clamp-1">{mod.subtitle}</p>
                      </div>
                      <span className="text-terracota text-xl flex-shrink-0">›</span>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  )
}
