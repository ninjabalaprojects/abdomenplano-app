import { useParams, useNavigate } from 'react-router-dom'
import { BONUSES } from '../data/bonuses'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function BonusDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const bonus = BONUSES[Number(id) - 1]
  if (!bonus) return <div className="p-8 text-center">Bono no encontrado</div>

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Hero with image */}
      <div className="relative h-56 overflow-hidden bg-beige">
        {bonus.bannerImage && (
          <img src={bonus.bannerImage} alt={bonus.name} className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/80 via-warm-brown/30 to-warm-brown/20" />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl"
        >
          ‹
        </button>
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <p className="text-white/70 text-xs">Bono incluido</p>
          <h1 className="font-serif text-2xl text-white font-bold leading-tight">{bonus.name}</h1>
          <p className="text-white/60 text-sm mt-0.5">{bonus.subtitle}</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        {/* PDF button */}
        {bonus.pdfUrl && (
          <a
            href={bonus.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between bg-terracota text-white px-5 py-4 rounded-2xl shadow-md active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="font-semibold text-sm">Ver guía completa en PDF</p>
                <p className="text-white/70 text-xs">Descarga o abre en tu dispositivo</p>
              </div>
            </div>
            <span className="text-xl">↓</span>
          </a>
        )}

        <div className="bg-beige rounded-2xl p-4">
          <p className="text-light-brown text-sm leading-relaxed">{bonus.description}</p>
        </div>

        {/* Bonus 1 - Quema 21 */}
        {bonus.id === 'bonus-1' && bonus.content && !Array.isArray(bonus.content) && (() => {
          const c = bonus.content
          return (
            <>
              {/* Bienvenida */}
              <div className="bg-beige rounded-2xl p-4">
                <p className="text-xs font-medium text-terracota mb-1">Mensaje de Carolina</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.bienvenida}</p>
              </div>

              {/* Cómo usar */}
              <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                <h3 className="font-serif text-warm-brown font-semibold mb-3">Cómo usar este desafío</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-terracota/10 rounded-xl p-3">
                    <p className="font-bold text-terracota text-base">{c.howToUse.duration}</p>
                    <p className="text-xs text-light-brown mt-0.5">por día</p>
                  </div>
                  <div className="bg-terracota/10 rounded-xl p-3">
                    <p className="font-bold text-terracota text-base">{c.howToUse.weeks} semanas</p>
                    <p className="text-xs text-light-brown mt-0.5">progresivas</p>
                  </div>
                  <div className="bg-terracota/10 rounded-xl p-3">
                    <p className="font-bold text-terracota text-base">21 días</p>
                    <p className="text-xs text-light-brown mt-0.5">de quema</p>
                  </div>
                </div>
                <p className="text-xs text-light-brown mt-3 text-center">{c.howToUse.format}</p>
              </div>

              {/* Reglas de seguridad */}
              <div>
                <h3 className="font-serif text-lg text-warm-brown font-semibold mb-3">Reglas de seguridad</h3>
                <div className="space-y-2">
                  {c.safetyRules.map((rule, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-dusty-rose/20 flex items-center justify-center text-sm font-bold text-dusty-rose flex-shrink-0">{i + 1}</div>
                      <div>
                        <p className="font-medium text-warm-brown text-sm">{rule.name}</p>
                        <p className="text-light-brown text-xs mt-0.5">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calentamiento */}
              <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                <h3 className="font-serif text-warm-brown font-semibold mb-3">Calentamiento (3 min)</h3>
                <div className="space-y-2">
                  {c.warmup.map((ex, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-warm-brown">
                      <span className="text-terracota font-bold">→</span>
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Semanas */}
              {c.weeks.map(week => (
                <div key={week.week}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-terracota flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{week.week}</div>
                    <div>
                      <h3 className="font-serif text-warm-brown font-semibold">{week.name}</h3>
                      <p className="text-xs text-light-brown">{week.days} · {week.description}</p>
                    </div>
                  </div>

                  {/* Ejercicios (semanas 1 y 2) */}
                  {week.exercises && (
                    <div className="space-y-2">
                      {week.exercises.map((ex, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-medium text-warm-brown text-sm">{ex.name}</p>
                            <div className="text-right flex-shrink-0">
                              <p className="text-xs font-semibold text-terracota">{ex.reps}</p>
                              <p className="text-xs text-light-brown">{ex.sets}</p>
                            </div>
                          </div>
                          {ex.note && <p className="text-xs text-light-brown mt-1">{ex.note}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Circuitos (semana 3) */}
                  {week.circuits && (
                    <div className="space-y-3">
                      {week.circuits.map((circuit, i) => (
                        <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                          <h4 className="font-medium text-warm-brown text-sm mb-2">{circuit.name}</h4>
                          <div className="space-y-1">
                            {circuit.exercises.map((ex, j) => (
                              <p key={j} className={`text-xs ${ex.includes('Descanso') ? 'text-terracota font-medium mt-2' : 'text-light-brown'}`}>
                                {ex.includes('Descanso') ? ex : `· ${ex}`}
                              </p>
                            ))}
                          </div>
                        </div>
                      ))}
                      {week.day21 && (
                        <div className="bg-terracota/10 rounded-2xl p-4 border border-terracota/20">
                          <p className="text-xs font-medium text-terracota mb-1">Día 21</p>
                          <p className="text-warm-brown text-sm">{week.day21}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Cierre */}
              <div className="bg-dusty-rose/10 rounded-2xl p-4 border border-dusty-rose/20">
                <p className="text-xs font-medium text-dusty-rose mb-1">De Carolina para ti</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.cierre}</p>
              </div>
            </>
          )
        })()}

        {/* Bonus 2 - Super Flex */}
        {bonus.id === 'bonus-2' && bonus.content && !Array.isArray(bonus.content) && (() => {
          const c = bonus.content
          return (
            <>
              {/* Bienvenida */}
              <div className="bg-beige rounded-2xl p-4">
                <p className="text-xs font-medium text-sage mb-1">Mensaje de Carolina</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.bienvenida}</p>
              </div>

              {/* Cómo usar */}
              <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                <h3 className="font-serif text-warm-brown font-semibold mb-3">Cómo usar este programa</h3>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-sage/10 rounded-xl p-3">
                    <p className="font-bold text-sage text-base">{c.howToUse.duration}</p>
                    <p className="text-xs text-light-brown mt-0.5">por día</p>
                  </div>
                  <div className="bg-sage/10 rounded-xl p-3">
                    <p className="font-bold text-sage text-base">{c.howToUse.modules} módulos</p>
                    <p className="text-xs text-light-brown mt-0.5">progresivos</p>
                  </div>
                  <div className="bg-sage/10 rounded-xl p-3">
                    <p className="font-bold text-sage text-base">4 semanas</p>
                    <p className="text-xs text-light-brown mt-0.5">de trabajo</p>
                  </div>
                </div>
                <p className="text-xs text-light-brown mt-3 text-center">{c.howToUse.format}</p>
              </div>

              {/* Reglas de seguridad */}
              <div>
                <h3 className="font-serif text-lg text-warm-brown font-semibold mb-3">Antes de empezar</h3>
                <div className="space-y-2">
                  {c.safetyRules.map((rule, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm flex gap-3">
                      <div className="w-7 h-7 rounded-full bg-sage/20 flex items-center justify-center text-sm font-bold text-sage flex-shrink-0">{i + 1}</div>
                      <div>
                        <p className="font-medium text-warm-brown text-sm">{rule.name}</p>
                        <p className="text-light-brown text-xs mt-0.5">{rule.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Módulos */}
              {c.modules.map(mod => (
                <div key={mod.module}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-sage flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{mod.module}</div>
                    <div>
                      <h3 className="font-serif text-warm-brown font-semibold">{mod.name}</h3>
                      <p className="text-xs text-light-brown">{mod.duration} · {mod.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {mod.exercises.map((ex, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-warm-brown text-sm">{ex.name}</p>
                          <p className="text-xs font-semibold text-sage flex-shrink-0">{ex.duration}</p>
                        </div>
                        {ex.note && <p className="text-xs text-light-brown mt-1">{ex.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Cierre */}
              <div className="bg-sage/10 rounded-2xl p-4 border border-sage/20">
                <p className="text-xs font-medium text-sage mb-1">De Carolina para ti</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.cierre}</p>
              </div>
            </>
          )
        })()}

        {/* Bonus 3 - Guía Anti-inflamación */}
        {bonus.id === 'bonus-3' && bonus.content && !Array.isArray(bonus.content) && (() => {
          const c = bonus.content
          return (
            <>
              {/* Bienvenida */}
              <div className="bg-beige rounded-2xl p-4">
                <p className="text-xs font-medium text-dusty-rose mb-1">Mensaje de Carolina</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.bienvenida}</p>
              </div>

              {/* Principios */}
              <div>
                <h3 className="font-serif text-lg text-warm-brown font-semibold mb-3">Los 3 principios</h3>
                <div className="space-y-2">
                  {c.principles.map((p, i) => (
                    <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                      <h4 className="font-medium text-warm-brown text-sm mb-0.5">{p.name}</h4>
                      <p className="text-light-brown text-xs">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Priorizar */}
              <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                <h3 className="font-serif text-warm-brown font-semibold mb-3">Prioriza estos alimentos</h3>
                <div className="space-y-3">
                  {c.prioritize.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">{item.emoji}</span>
                      <div>
                        <p className="font-medium text-warm-brown text-sm">{item.name}</p>
                        <p className="text-light-brown text-xs">{item.examples}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reducir */}
              <div className="bg-dusty-rose/10 rounded-2xl p-4 border border-dusty-rose/20">
                <h3 className="font-serif text-warm-brown font-semibold mb-3">Reduce estos 7 días</h3>
                <div className="space-y-1.5">
                  {c.reduce.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-warm-brown">
                      <span className="text-dusty-rose font-bold text-xs">✕</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hidratación */}
              <div className="bg-white rounded-2xl p-4 border border-beige shadow-sm flex gap-3">
                <span className="text-2xl flex-shrink-0">💧</span>
                <div>
                  <p className="font-medium text-warm-brown text-sm mb-0.5">Hidratación</p>
                  <p className="text-light-brown text-xs">{c.hydration}</p>
                </div>
              </div>

              {/* Plan 7 días */}
              <h3 className="font-serif text-lg text-warm-brown font-semibold">Plan de 7 días</h3>
              {c.days.map(day => (
                <div key={day.day} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-xl bg-dusty-rose/20 flex items-center justify-center text-sm font-bold text-dusty-rose">{day.day}</div>
                    <span className="font-serif text-warm-brown font-semibold">Día {day.day}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex gap-2"><span className="text-terracota font-medium w-20 flex-shrink-0">Desayuno</span><span className="text-light-brown">{day.breakfast}</span></div>
                    <div className="flex gap-2"><span className="text-terracota font-medium w-20 flex-shrink-0">Almuerzo</span><span className="text-light-brown">{day.lunch}</span></div>
                    <div className="flex gap-2"><span className="text-terracota font-medium w-20 flex-shrink-0">Cena</span><span className="text-light-brown">{day.dinner}</span></div>
                    <div className="flex gap-2"><span className="text-terracota font-medium w-20 flex-shrink-0">Snack</span><span className="text-light-brown">{day.snack}</span></div>
                  </div>
                </div>
              ))}

              {/* Cierre */}
              <div className="bg-dusty-rose/10 rounded-2xl p-4 border border-dusty-rose/20">
                <p className="text-xs font-medium text-dusty-rose mb-1">De Carolina para ti</p>
                <p className="text-warm-brown text-sm leading-relaxed">{c.cierre}</p>
              </div>
            </>
          )
        })()}
      </div>
      <Navigation />
    </div>
  )
}
