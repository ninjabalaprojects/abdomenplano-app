import { useProgressContext as useProgress, useUserContext } from '../context/ProgressContext'
import { APP_CONFIG } from '../config/app.config'
import { PHASES } from '../data/phases'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function Profile() {
  const { userProfile, completedPhases, getTotalCheckins, getDaysSinceStart, photos } = useProgress()
  const { usersList, currentUserId, logOut, deleteUser } = useUserContext()

  const handleReset = () => {
    if (window.confirm('¿Segura que quieres reiniciar tu progreso? Esta acción no se puede deshacer.')) {
      deleteUser(currentUserId)
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

        {/* Switch / add profiles */}
        <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
          <h3 className="font-serif text-warm-brown font-semibold mb-3">Perfiles guardados</h3>
          <div className="space-y-2 mb-3">
            {usersList.map(user => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-xl ${user.id === currentUserId ? 'bg-terracota/10 border border-terracota/20' : 'bg-beige'}`}
              >
                <span className="text-xl">🌸</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-warm-brown">{user.name}</p>
                  <p className="text-xs text-light-brown">Desde {user.startDate}</p>
                </div>
                {user.id === currentUserId
                  ? <span className="text-xs text-terracota font-medium">Activa</span>
                  : <button onClick={() => logOut()} className="text-xs text-light-brown underline">Cambiar</button>
                }
              </div>
            ))}
          </div>
          <button
            onClick={logOut}
            className="w-full py-3 rounded-xl border-2 border-dashed border-terracota/30 text-terracota text-sm font-medium"
          >
            + Agregar / cambiar perfil
          </button>
        </div>

        {/* Guarantee */}
        <div className="bg-beige rounded-2xl p-4">
          <h3 className="font-serif text-warm-brown font-semibold mb-3">🛡️ Central de Garantías</h3>
          <div className="bg-white rounded-xl p-3">
            <p className="font-medium text-warm-brown text-sm">Garantía de satisfacción — 60 días</p>
            <p className="text-light-brown text-xs mt-1">Si en 60 días no ves resultados, devolvemos tu inversión. Necesitas el 80% de check-ins + fotos de antes/después.</p>
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
          <h3 className="font-medium text-warm-brown mb-1">Eliminar perfil</h3>
          <p className="text-light-brown text-xs mb-3">Borra este perfil y todo su progreso. No se puede deshacer.</p>
          <button onClick={handleReset} className="text-sm text-light-brown underline">Eliminar mi perfil</button>
        </div>

        <p className="text-center text-light-brown/40 text-xs">{APP_CONFIG.productName} v1.0 • {APP_CONFIG.instructorName}</p>
      </div>
      <Navigation />
    </div>
  )
}
