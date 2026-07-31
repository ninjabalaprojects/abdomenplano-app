import { useNavigate } from 'react-router-dom'
import { BONUSES } from '../data/bonuses'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function Bonuses() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-cream pb-nav-safe">
      <Header title="Tus Bonos" subtitle="3 programas complementarios incluidos" />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
        {BONUSES.map((bonus, i) => (
          <div
            key={bonus.id}
            onClick={() => navigate(`/bonuses/${i + 1}`)}
            style={bonus.bannerImage ? { backgroundImage: `url(${bonus.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            className="relative rounded-2xl overflow-hidden border border-pale-rose shadow-sm cursor-pointer active:scale-[0.98] transition-all"
          >
            {bonus.bannerImage && <div className="absolute inset-0 bg-warm-brown/55" />}
            <div className="relative flex items-center gap-3 p-4">
              <div className="flex-1 min-w-0">
                <span className={`text-xs font-medium ${bonus.bannerImage ? 'text-white/70' : 'text-terracota'}`}>Bono {i + 1}</span>
                <h3 className={`font-serif font-semibold ${bonus.bannerImage ? 'text-white' : 'text-warm-brown'}`}>{bonus.name}</h3>
                <p className={`text-sm mt-1 line-clamp-2 ${bonus.bannerImage ? 'text-white/70' : 'text-light-brown'}`}>{bonus.subtitle}</p>
              </div>
              <span className={`text-xl flex-shrink-0 ${bonus.bannerImage ? 'text-white' : 'text-terracota'}`}>›</span>
            </div>
          </div>
        ))}
      </div>
      <Navigation />
    </div>
  )
}
