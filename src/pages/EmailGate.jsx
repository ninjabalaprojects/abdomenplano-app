import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEntitlements } from '../context/EntitlementContext'
import { APP_CONFIG } from '../config/app.config'

export default function EmailGate() {
  const [emailInput, setEmailInput] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { saveEmail } = useEntitlements()
  const navigate = useNavigate()

  const isValid = emailInput.trim().includes('@') && emailInput.trim().length > 4

  const handleSubmit = async () => {
    if (!isValid || submitting) return
    setSubmitting(true)
    await saveEmail(emailInput.trim())
    setSubmitting(false)
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-beige to-cream flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-sm w-full text-center">
        <img
          src="/logo/logo.jpg"
          alt={APP_CONFIG.productName}
          className="w-24 h-24 object-contain mx-auto mb-6 rounded-2xl"
          onError={e => { e.target.style.display = 'none' }}
        />
        <h2 className="font-serif text-2xl text-warm-brown font-bold mb-2">
          Desbloquea tu acceso
        </h2>
        <p className="text-light-brown text-sm mb-6 leading-relaxed">
          Usa el mismo correo que usaste en tu compra para activar tu contenido.
        </p>

        <input
          type="email"
          value={emailInput}
          onChange={e => setEmailInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="tu@correo.com"
          className="w-full border-2 border-beige focus:border-terracota outline-none rounded-xl px-4 py-3 text-warm-brown text-base bg-white transition-colors mb-4"
          autoFocus
          autoComplete="email"
        />

        <button
          onClick={handleSubmit}
          disabled={!isValid || submitting}
          className="w-full bg-terracota text-white py-4 rounded-2xl font-semibold text-base shadow-lg disabled:opacity-40 active:scale-95 transition-all"
        >
          {submitting ? 'Verificando...' : 'Continuar →'}
        </button>

        <p className="text-light-brown/60 text-xs mt-5 leading-relaxed">
          ¿Compraste con otro correo? Ingresa ese correo. Si tienes problemas,{' '}
          <a
            href={`mailto:${APP_CONFIG.supportEmail}`}
            className="underline text-terracota/70"
          >
            contacta soporte
          </a>.
        </p>
      </div>
    </div>
  )
}
