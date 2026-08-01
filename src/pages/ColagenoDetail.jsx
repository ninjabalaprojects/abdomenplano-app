import { useParams, useNavigate } from 'react-router-dom'
import { COLAGENO_MODULES } from '../data/colageno'
import VideoPlayer from '../components/VideoPlayer'
import Navigation from '../components/Navigation'

export default function ColagenoDetail() {
  const { moduleId } = useParams()
  const navigate = useNavigate()
  const mod = COLAGENO_MODULES.find(m => m.id === Number(moduleId))

  if (!mod) return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-light-brown mb-4">Módulo no encontrado</p>
        <button onClick={() => navigate('/colageno-hormonal')} className="text-terracota font-medium">← Volver</button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream pb-nav-safe">
      {/* Hero */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${mod.bannerColor || 'from-dusty-rose/20 to-pale-rose/30'}`}>
        <div className="absolute inset-0 bg-warm-brown/20" />
        <button
          onClick={() => navigate('/colageno-hormonal')}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center text-white text-xl"
        >
          ‹
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p className="text-white/70 text-xs">
            {mod.isSecret ? 'Bono Secreto' : `Módulo ${mod.id}`}
          </p>
          <h1 className="font-serif text-xl text-white font-bold leading-tight">{mod.name}</h1>
          <p className="text-white/60 text-sm mt-0.5">{mod.subtitle}</p>
        </div>
        <div className="absolute top-1/2 right-6 -translate-y-1/2 text-5xl opacity-30">{mod.emoji}</div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 pb-8 space-y-5">
        {/* Video */}
        <VideoPlayer videoId={mod.videoId || `COLAGENO_${mod.id}`} title={mod.name} />

        {/* Descripción */}
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-xs font-medium text-terracota mb-1">
            {mod.isSecret ? '🎁 Bono Secreto' : `📌 Módulo ${mod.id}`}
          </p>
          <p className="text-warm-brown text-sm leading-relaxed">{mod.description}</p>
        </div>

        {mod.isSecret && (
          <div className="bg-warm-brown/10 rounded-2xl p-5 border border-warm-brown/20 text-center">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="font-serif text-warm-brown font-semibold mb-2">Contenido exclusivo</h3>
            <p className="text-light-brown text-sm">
              Este bono especial estará disponible muy pronto. ¡Estás entre las primeras en tener acceso!
            </p>
          </div>
        )}

        {!mod.isSecret && (
          <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
            <h3 className="font-serif text-warm-brown font-semibold mb-2">Contenido del módulo</h3>
            <p className="text-light-brown text-sm leading-relaxed">
              El contenido completo de este módulo estará disponible en breve. El video y los materiales de apoyo serán cargados por Carolina próximamente.
            </p>
          </div>
        )}
      </div>

      <Navigation />
    </div>
  )
}
