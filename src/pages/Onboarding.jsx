import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressContext as useProgress } from '../context/ProgressContext'
import { APP_CONFIG } from '../config/app.config'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const { setUserProfile } = useProgress()
  const navigate = useNavigate()

  const handleStart = () => {
    if (!name.trim()) return
    setUserProfile({
      name: name.trim(),
      startDate: new Date().toISOString().split('T')[0],
    })
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-cream flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {step === 1 && (
          <div className="text-center max-w-sm w-full">
            <div className="w-24 h-24 rounded-full bg-terracota/10 mx-auto mb-6 flex items-center justify-center">
              <span className="text-5xl">🌸</span>
            </div>
            <h1 className="font-serif text-3xl text-warm-brown font-bold leading-tight mb-3">
              ¡Bienvenida al<br />Protocolo Abdomen Plano!
            </h1>
            <p className="text-light-brown text-base leading-relaxed mb-2">
              Tomaste la decisión correcta. Miles de mujeres ya recuperaron su abdomen con este método — y tú serás la próxima.
            </p>
            <div className="bg-white rounded-2xl p-4 mt-6 text-left shadow-sm border border-pale-rose">
              <p className="text-sm font-medium text-terracota mb-2">Lo que vas a lograr:</p>
              {[
                'Cerrar la diástasis abdominal',
                'Reducir hasta 15cm de abdomen',
                'Solo 10 minutos diarios',
                'Sin dieta, sin gimnasio',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 py-1">
                  <span className="text-sage">✓</span>
                  <span className="text-warm-brown text-sm">{item}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep(2)}
              className="mt-8 w-full bg-terracota text-white py-4 rounded-2xl font-semibold text-base shadow-lg active:scale-95 transition-all"
            >
              ¡Empezar mi transformación! 🌟
            </button>
            <p className="text-light-brown/60 text-xs mt-3">Con {APP_CONFIG.instructorName} • {APP_CONFIG.productName}</p>
          </div>
        )}

        {step === 2 && (
          <div className="text-center max-w-sm w-full">
            <div className="w-20 h-20 rounded-full bg-dusty-rose/20 mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl">💛</span>
            </div>
            <h2 className="font-serif text-2xl text-warm-brown font-bold mb-2">¿Cómo te llamas?</h2>
            <p className="text-light-brown text-sm mb-6">Quiero acompañarte de manera personal en este proceso.</p>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && handleStart()}
              placeholder="Tu nombre..."
              className="w-full border-2 border-beige focus:border-terracota outline-none rounded-xl px-4 py-3 text-warm-brown text-base bg-white transition-colors"
              autoFocus
            />
            <div className="mt-6 bg-beige rounded-2xl p-4 text-left">
              <p className="text-sm font-medium text-warm-brown mb-2">¿Cómo funciona el protocolo?</p>
              <div className="space-y-2">
                {[
                  ['🌬️', 'Fase 1: Descompresión — respiras diferente'],
                  ['🎯', 'Fase 2: Activas el músculo correcto'],
                  ['🔗', 'Fase 3: Conectas abdomen y suelo pélvico'],
                  ['✨', 'Fase 4: El cierre ocurre naturalmente'],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span>{icon}</span>
                    <span className="text-warm-brown text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={handleStart}
              disabled={!name.trim()}
              className="mt-6 w-full bg-terracota text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-40 active:scale-95 transition-all"
            >
              ¡Comenzar, {name || 'mi amor'}! 🚀
            </button>
            <button onClick={() => setStep(1)} className="mt-3 text-light-brown/60 text-sm">← Volver</button>
          </div>
        )}
      </div>
    </div>
  )
}
