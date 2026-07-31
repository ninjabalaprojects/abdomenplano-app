import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { PHASES } from '../data/phases'
import { useProgressContext as useProgress } from '../context/ProgressContext'
import VideoPlayer from '../components/VideoPlayer'
import offersConfig from '../config/offers.json'
import OfferCard from '../components/OfferCard'
import Navigation from '../components/Navigation'

export default function PhaseDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const phase = PHASES.find(p => p.id === Number(id))
  const { isPhaseUnlocked, isPhaseCompleteToday, isPhaseEverCompleted, markPhaseComplete, toggleChecklistItem, getTodayChecklist, checkInToday, getPhasesCompletedToday } = useProgress()
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  if (!phase) return <div className="p-8 text-center text-light-brown">Fase no encontrada</div>

  const unlocked = isPhaseUnlocked(phase.id)
  const completeToday = isPhaseCompleteToday(phase.id)
  const everCompleted = isPhaseEverCompleted(phase.id)
  const todayChecked = getTodayChecklist(phase.id)
  const allDone = todayChecked.length === phase.checklistItems.length
  const nextPhase = PHASES.find(p => p.id === phase.id + 1)
  const completionOffer = offersConfig.offers.find(o => o.active)
  const todayPhasesCount = getPhasesCompletedToday().length

  const handleComplete = () => {
    markPhaseComplete(phase.id)
    checkInToday()
    setShowCompleteModal(true)
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="text-center max-w-xs">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="font-serif text-xl text-warm-brown font-bold mb-2">Fase bloqueada</h2>
          <p className="text-light-brown text-sm mb-4">Completa la fase anterior para desbloquear esta.</p>
          <button onClick={() => navigate('/phases')} className="bg-terracota text-white px-6 py-3 rounded-xl font-medium">Ver fases</button>
        </div>
        <Navigation />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream pb-28">
      {/* Back button */}
      <div className="sticky top-0 bg-cream/90 backdrop-blur-sm z-40 px-4 py-3 border-b border-beige">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <button onClick={() => navigate('/phases')} className="text-terracota text-2xl">‹</button>
          <div>
            <p className="text-xs text-light-brown">Fase {phase.id}</p>
            <h1 className="font-serif text-lg text-warm-brown font-semibold leading-tight">{phase.name}</h1>
          </div>
          {completeToday && <span className="ml-auto text-xs bg-sage text-white px-2 py-1 rounded-full">✅ Hecha hoy</span>}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* Video */}
        <VideoPlayer videoId={phase.videoPlaceholderId} title={phase.name} />

        {/* Description */}
        <div>
          <h2 className="font-serif text-lg text-warm-brown font-semibold mb-2">¿Qué harás en esta fase?</h2>
          <p className="text-light-brown text-sm leading-relaxed">{phase.description}</p>
        </div>

        {/* Mechanism */}
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-xs font-medium text-terracota mb-1">¿Por qué funciona? (el mecanismo)</p>
          <p className="text-warm-brown text-sm leading-relaxed">{phase.mechanism}</p>
        </div>

        {/* Daily checklist */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg text-warm-brown font-semibold">Checklist de hoy</h2>
            <span className="text-xs text-light-brown">{todayChecked.length}/{phase.checklistItems.length}</span>
          </div>
          <div className="space-y-2">
            {phase.checklistItems.map((item, i) => {
              const checked = todayChecked.includes(i)
              return (
                <div
                  key={i}
                  onClick={() => toggleChecklistItem(phase.id, i)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all active:scale-[0.98] ${
                    checked ? 'bg-sage/10 border-sage/30' : 'bg-white border-beige'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    checked ? 'bg-sage border-sage' : 'border-light-brown/30'
                  }`}>
                    {checked && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm ${checked ? 'text-light-brown line-through' : 'text-warm-brown'}`}>{item}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tip */}
        <div className="bg-dusty-rose/10 rounded-2xl p-4 border border-dusty-rose/20">
          <p className="text-xs font-medium text-dusty-rose mb-1">💡 Consejo de Carolina</p>
          <p className="text-warm-brown text-sm leading-relaxed">{phase.tips}</p>
        </div>

        {/* Complete button — resets daily */}
        {!completeToday ? (
          <button
            onClick={handleComplete}
            disabled={!allDone}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all ${
              allDone
                ? 'bg-terracota text-white shadow-lg active:scale-95'
                : 'bg-beige text-light-brown cursor-not-allowed'
            }`}
          >
            {allDone ? '✅ ¡Fase completada hoy!' : `Completa todos los pasos primero (${todayChecked.length}/${phase.checklistItems.length})`}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="bg-sage/10 border border-sage/30 rounded-2xl p-4 text-center">
              <p className="text-sage font-semibold">✅ ¡Fase {phase.id} completada hoy!</p>
              <p className="text-light-brown text-xs mt-1">Regresa mañana para continuar tu práctica diaria</p>
            </div>
            {nextPhase && (
              <button
                onClick={() => navigate(`/phases/${nextPhase.id}`)}
                className="w-full py-3 rounded-2xl font-semibold text-base bg-terracota text-white shadow-lg active:scale-95 transition-all"
              >
                Continuar → Fase {nextPhase.id}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Completion modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-warm-brown/40 flex items-center justify-center z-50 p-4">
          <div className="bg-cream rounded-3xl p-6 w-full space-y-4">
            {todayPhasesCount >= 4 ? (
              /* All 4 phases done today */
              <div className="text-center">
                <div className="text-5xl mb-3">🌟</div>
                <h2 className="font-serif text-2xl text-warm-brown font-bold">¡Completaste las 4 fases de hoy!</h2>
                <p className="text-light-brown text-sm mt-2 leading-relaxed">
                  Eso es todo por hoy. Aprovecha para descansar — tu cuerpo necesita este tiempo para procesar el trabajo que acabas de hacer.
                </p>
                <div className="bg-beige rounded-2xl p-3 mt-3 text-sm text-warm-brown">
                  💤 Descansa bien y <span className="font-semibold text-terracota">mañana repite las 4 fases</span> para seguir avanzando.
                </div>
              </div>
            ) : (
              /* Individual phase done */
              <div className="text-center">
                <div className="text-5xl mb-3">🎉</div>
                <h2 className="font-serif text-2xl text-warm-brown font-bold">¡Fase {phase.id} completada!</h2>
                <p className="text-light-brown text-sm mt-2">
                  {!everCompleted
                    ? `La Fase ${phase.id + 1} ya está desbloqueada. ¡Continúa!`
                    : `${todayPhasesCount}/4 fases de hoy completadas.`}
                </p>
              </div>
            )}
            {completionOffer && todayPhasesCount >= 4 && (
              <div>
                <p className="text-xs text-light-brown text-center mb-2">Lleva tu progreso más lejos:</p>
                <OfferCard offer={completionOffer} />
              </div>
            )}
            <div className="flex gap-3">
              {nextPhase && todayPhasesCount < 4 && (
                <button
                  onClick={() => { setShowCompleteModal(false); navigate(`/phases/${nextPhase.id}`) }}
                  className="flex-1 bg-terracota text-white py-3 rounded-xl font-medium"
                >
                  Siguiente fase →
                </button>
              )}
              <button
                onClick={() => { setShowCompleteModal(false); navigate('/dashboard') }}
                className="flex-1 bg-beige text-warm-brown py-3 px-4 rounded-xl font-medium"
              >
                {todayPhasesCount >= 4 ? '¡Hasta mañana! 👋' : 'Inicio'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  )
}
