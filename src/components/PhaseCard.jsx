import { useNavigate } from 'react-router-dom'
import { useProgressContext as useProgress } from '../context/ProgressContext'

const COLOR_MAP = {
  sage: { bg: 'bg-sage/20', border: 'border-sage/40', text: 'text-sage' },
  'dusty-rose': { bg: 'bg-dusty-rose/20', border: 'border-dusty-rose/40', text: 'text-dusty-rose' },
  terracota: { bg: 'bg-terracota/20', border: 'border-terracota/40', text: 'text-terracota' },
  'warm-brown': { bg: 'bg-warm-brown/10', border: 'border-warm-brown/30', text: 'text-warm-brown' },
}

export default function PhaseCard({ phase, compact = false }) {
  const navigate = useNavigate()
  const { isPhaseUnlocked, isPhaseCompleteToday, isPhaseEverCompleted } = useProgress()
  const unlocked = isPhaseUnlocked(phase.id)
  const doneToday = isPhaseCompleteToday(phase.id)
  const everCompleted = isPhaseEverCompleted(phase.id)
  const colors = COLOR_MAP[phase.color] || COLOR_MAP.terracota

  return (
    <div
      onClick={() => unlocked && navigate(`/phases/${phase.id}`)}
      className={`relative rounded-2xl border p-4 transition-all ${
        unlocked ? 'cursor-pointer active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
      } ${doneToday ? 'bg-sage/10 border-sage/30' : `${colors.bg} ${colors.border}`}`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${colors.bg}`}>
          {doneToday ? '✅' : unlocked ? phase.emoji : '🔒'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-light-brown">Fase {phase.id}</span>
            {doneToday && <span className="text-xs bg-sage text-white px-2 py-0.5 rounded-full">Hecha hoy ✓</span>}
            {!doneToday && everCompleted && unlocked && <span className="text-xs bg-terracota/20 text-terracota px-2 py-0.5 rounded-full">Pendiente hoy</span>}
            {!unlocked && <span className="text-xs bg-light-brown/20 text-light-brown px-2 py-0.5 rounded-full">Bloqueada</span>}
          </div>
          <h3 className="font-serif text-warm-brown font-semibold mt-0.5 leading-tight">{phase.name}</h3>
          {!compact && <p className="text-light-brown text-sm mt-1 line-clamp-2">{phase.subtitle}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-light-brown/70">⏱ {phase.duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
