import { useNavigate } from 'react-router-dom'
import { PHASES } from '../data/phases'
import PhaseCard from '../components/PhaseCard'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function Phases() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <Header title="Las 4 Fases" subtitle="Tu protocolo completo paso a paso" />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        <div className="bg-beige rounded-2xl p-4 text-sm text-light-brown">
          <span className="font-medium text-warm-brown">¿Cómo funciona?</span> Completa cada fase en orden. Cuando marques una como completada, la siguiente se desbloqueará automáticamente.
        </div>
        {PHASES.map(phase => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>
      <Navigation />
    </div>
  )
}
