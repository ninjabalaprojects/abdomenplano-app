import { useNavigate } from 'react-router-dom'
import { useProgressContext as useProgress } from '../context/ProgressContext'

const COLOR_MAP = {
  sage: { bg: 'bg-sage/20', border: 'border-sage/40' },
  'dusty-rose': { bg: 'bg-dusty-rose/20', border: 'border-dusty-rose/40' },
  terracota: { bg: 'bg-terracota/20', border: 'border-terracota/40' },
  'warm-brown': { bg: 'bg-warm-brown/10', border: 'border-warm-brown/30' },
}

export default function PhaseCard({ phase, compact = false }) {
  const navigate = useNavigate()
  const { isPhaseUnlocked, isPhaseCompleteToday, isPhaseEverCompleted } = useProgress()
  const unlocked = isPhaseUnlocked(phase.id)
  const doneToday = isPhaseCompleteToday(phase.id)
  const everCompleted = isPhaseEverCompleted(phase.id)
  const colors = COLOR_MAP[phase.color] || COLOR_MAP.terracota
  const hasImage = !!phase.bannerImage

  return (
    <div
      onClick={() => unlocked && navigate(`/phases/${phase.id}`)}
      style={hasImage ? { backgroundImage: `url(${phase.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      className={`relative rounded-2xl overflow-hidden border transition-all ${
        unlocked ? 'cursor-pointer active:scale-[0.98]' : 'opacity-50 cursor-not-allowed'
      } ${doneToday ? 'border-sage/40' : colors.border} ${!hasImage ? (doneToday ? 'bg-sage/10' : colors.bg) : ''}`}
    >
      {/* Overlay when image exists */}
      {hasImage && (
        <div className={`absolute inset-0 ${doneToday ? 'bg-warm-brown/65' : 'bg-warm-brown/55'}`} />
      )}

      {/* Content — centered */}
      <div className="relative p-4 flex flex-col items-center justify-center text-center min-h-[110px] gap-1.5">
        <span className={`text-xs font-medium ${hasImage ? 'text-white/70' : 'text-light-brown'}`}>
          Fase {phase.id}
        </span>
        <h3 className={`font-serif font-semibold leading-tight ${hasImage ? 'text-white text-base' : 'text-warm-brown text-sm'}`}>
          {phase.name}
        </h3>
        {!compact && (
          <p className={`text-xs leading-snug line-clamp-2 ${hasImage ? 'text-white/65' : 'text-light-brown'}`}>
            {phase.subtitle}
          </p>
        )}
        <div className="flex items-center gap-2 mt-1 flex-wrap justify-center">
          {doneToday && <span className="text-xs bg-sage text-white px-2 py-0.5 rounded-full">Hecha hoy ✓</span>}
          {!doneToday && everCompleted && unlocked && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${hasImage ? 'bg-white/20 text-white' : 'bg-terracota/20 text-terracota'}`}>
              Pendiente hoy
            </span>
          )}
          {!unlocked && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${hasImage ? 'bg-white/20 text-white/80' : 'bg-light-brown/20 text-light-brown'}`}>
              🔒 Bloqueada
            </span>
          )}
          {!doneToday && unlocked && (
            <span className={`text-xs ${hasImage ? 'text-white/60' : 'text-light-brown/70'}`}>⏱ {phase.duration}</span>
          )}
        </div>
      </div>
    </div>
  )
}
