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
        <div className="bg-beige rounded-2xl p-4">
          <p className="text-light-brown text-sm leading-relaxed">{bonus.description}</p>
        </div>

        {/* Bonus 1 - Queima 21 */}
        {bonus.id === 'bonus-1' && Array.isArray(bonus.content) && bonus.content.map(week => (
          <div key={week.week} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
            <h3 className="font-serif text-warm-brown font-semibold mb-3">Semana {week.week}: {week.name}</h3>
            <div className="space-y-2">
              {week.days.map((day, i) => (
                <div key={i} className="flex items-center gap-3 py-1">
                  <span className="text-xs font-medium text-light-brown w-6">{['L','M','X','J','V','S','D'][i]}</span>
                  <span className="text-sm text-warm-brown">{day}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Bonus 2 - Super Flex */}
        {bonus.id === 'bonus-2' && Array.isArray(bonus.content) && bonus.content.map(module => (
          <div key={module.module} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-sage/20 flex items-center justify-center text-sm font-bold text-sage flex-shrink-0">{module.module}</div>
              <div>
                <h3 className="font-serif text-warm-brown font-semibold">{module.name}</h3>
                <p className="text-light-brown text-sm mt-1">{module.description}</p>
              </div>
            </div>
          </div>
        ))}

        {/* Bonus 3 - Guide */}
        {bonus.id === 'bonus-3' && !Array.isArray(bonus.content) && (
          <>
            <p className="text-light-brown text-sm leading-relaxed">{bonus.content.intro}</p>
            <div className="space-y-3">
              {bonus.content.principles.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-beige shadow-sm">
                  <h4 className="font-medium text-warm-brown mb-1">{p.name}</h4>
                  <p className="text-light-brown text-sm">{p.description}</p>
                </div>
              ))}
            </div>
            <h3 className="font-serif text-lg text-warm-brown font-semibold">Plan de 7 días</h3>
            {bonus.content.days.map(day => (
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
          </>
        )}
      </div>
      <Navigation />
    </div>
  )
}
