import { useNavigate } from 'react-router-dom'
import { BONUSES } from '../data/bonuses'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function Bonuses() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-cream pb-24">
      <Header title="Tus Bonos" subtitle="3 programas complementarios incluidos" />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {BONUSES.map((bonus, i) => (
          <div
            key={bonus.id}
            onClick={() => navigate(`/bonuses/${i + 1}`)}
            className="bg-white rounded-2xl p-4 border border-pale-rose shadow-sm cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-xl bg-beige flex items-center justify-center text-3xl flex-shrink-0">{bonus.icon}</div>
              <div className="flex-1">
                <span className="text-xs font-medium text-terracota">Bono {i + 1}</span>
                <h3 className="font-serif text-warm-brown font-semibold">{bonus.name}</h3>
                <p className="text-light-brown text-sm mt-1 line-clamp-2">{bonus.subtitle}</p>
              </div>
              <span className="text-terracota text-xl mt-2">›</span>
            </div>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  )
}
