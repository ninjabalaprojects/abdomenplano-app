import { useProgressContext as useProgress } from '../context/ProgressContext'
import { APP_CONFIG } from '../config/app.config'
import { PHASES } from '../data/phases'
import Header from '../components/Header'
import Navigation from '../components/Navigation'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { userProfile, setUserProfile, completedPhases, getTotalCheckins, getDaysSinceStart, photos } = useProgress()
  const navigate = useNavigate()

  const handleReset = () => {
    if (window.confirm('¿Segura que quieres reiniciar todo tu progreso? Esta acción no se puede deshacer.')) {
      localStorage.clear()
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-cream pb-24">
      <Header title="Tu Perfil" subtitle="Información y configuración" />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* Profile card */}
        <div className="bg-white rounded-2xl p-5 border border-beige shadow-sm text-center">
          <div className="w-20 h-20 rounded-full bg-dusty-rose/20 mx-auto mb-3 flex items-center justify-center text-4xl">🌸</div>
          <h2 className="font-serif text-2xl text-warm-brown font-bold">{userProfile?.name || 'Mi nombre'}</h2>
          <p className="text-light-brown text-sm">Alumna del {APP_CONFIG.productName}</p>
          <p className="text-light-brown/60 text-xs mt-1">Desde {userProfile?.startDate || '—'}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Fases completadas', value: `${completedPhases.length}/${PHASES.length}`, emoji: '📋' },
            { label: 'Días activa', value: getTotalCheckins(), emoji: '📅' },
            { label: 'Días desde inicio', value: getDaysSinceStart(), emoji: '🗓️' },
            { label: 'Fotos guardadas', value: photos.length, emoji: '📷' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm text-center">
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-serif text-2xl text-terracota font-bold">{s.value}</div>
              <div className="text-xs text-light-brown mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Guarantee section */}
        <div className="bg-beige rounded-2xl p-4">
          <h3 className="font-serif text-warm-brown font-semibold mb-3">🛡️ Central de Garantías</h3>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3">
              <p className="font-medium text-warm-brown text-sm">Garantía de satisfacción — 60 días</p>
              <p className="text-light-brown text-xs mt-1">Si en 60 días no ves resultados, devolvemos tu inversión. Necesitas el 80% de check-ins + fotos de antes/después.</p>
            </div>
            <div className="bg-white rounded-xl p-3">
              <p className="font-medium text-warm-brown text-sm">Garantía de resultados</p>
              <p className="text-light-brown text-xs mt-1">Si sigues el protocolo al pie de la letra (todas las fases + check-ins diarios) y no ves ningún cambio en 60 días, te devolvemos el 100%.</p>
            </div>
          </div>
          <a
            href={`mailto:${APP_CONFIG.supportEmail}?subject=Soporte - ${userProfile?.name || ''}`}
            className="mt-3 block text-center bg-warm-brown text-white py-3 rounded-xl text-sm font-medium"
          >
            Contactar soporte → {APP_CONFIG.supportEmail}
          </a>
        </div>

        {/* Reset */}
        <div className="bg-pale-rose/30 rounded-2xl p-4 border border-pale-rose">
          <h3 className="font-medium text-warm-brown mb-1">Reiniciar app</h3>
          <p className="text-light-brown text-xs mb-3">Borra todo el progreso local. Útil solo si vas a empezar desde cero.</p>
          <button onClick={handleReset} className="text-sm text-light-brown underline">Reiniciar mi progreso</button>
        </div>

        {/* Version */}
        <p className="text-center text-light-brown/40 text-xs">{APP_CONFIG.productName} v1.0 • {APP_CONFIG.instructorName}</p>
      </div>
      <Navigation />
    </div>
  )
}
