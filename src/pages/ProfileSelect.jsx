import { useState } from 'react'
import { useUserContext } from '../context/ProgressContext'
import { APP_CONFIG } from '../config/app.config'

export default function ProfileSelect() {
  const { usersList, createUser, switchUser } = useUserContext()
  const [creating, setCreating] = useState(usersList.length === 0)
  const [name, setName] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    createUser(name.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo/logo.jpg"
            alt="Logo"
            className="w-20 h-20 object-contain rounded-2xl"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>

        {!creating ? (
          <>
            <h1 className="font-serif text-2xl text-warm-brown font-bold text-center mb-1">
              ¿Quién va a practicar hoy?
            </h1>
            <p className="text-light-brown text-sm text-center mb-6">Selecciona tu perfil</p>

            <div className="space-y-3 mb-6">
              {usersList.map(user => (
                <button
                  key={user.id}
                  onClick={() => switchUser(user.id)}
                  className="w-full flex items-center gap-4 bg-white rounded-2xl p-4 border border-beige shadow-sm active:scale-[0.98] transition-all text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-terracota/10 flex items-center justify-center text-2xl flex-shrink-0">
                    🌸
                  </div>
                  <div className="flex-1">
                    <p className="font-serif text-warm-brown font-semibold">{user.name}</p>
                    <p className="text-light-brown text-xs mt-0.5">Desde {user.startDate}</p>
                  </div>
                  <span className="text-light-brown text-xl">›</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setCreating(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-terracota/30 text-terracota text-sm font-medium hover:bg-terracota/5 transition-all"
            >
              + Agregar nuevo perfil
            </button>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl text-warm-brown font-bold text-center mb-1">
              {usersList.length === 0 ? `Bienvenida al ${APP_CONFIG.productName}` : 'Nuevo perfil'}
            </h1>
            <p className="text-light-brown text-sm text-center mb-8">
              {usersList.length === 0 ? '¿Cómo te llamas?' : 'Ingresa el nombre del nuevo perfil'}
            </p>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              placeholder="Tu nombre"
              autoFocus
              className="w-full bg-white border border-beige rounded-2xl px-4 py-4 text-warm-brown text-lg font-serif text-center focus:outline-none focus:border-terracota/40 mb-4"
            />

            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
                name.trim()
                  ? 'bg-terracota text-white shadow-md active:scale-95'
                  : 'bg-beige text-light-brown cursor-not-allowed'
              }`}
            >
              Comenzar
            </button>

            {usersList.length > 0 && (
              <button
                onClick={() => { setCreating(false); setName('') }}
                className="w-full text-center text-light-brown text-sm mt-3"
              >
                ← Volver
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
