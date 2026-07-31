import { useNavigate } from 'react-router-dom'

export default function Header({ title, subtitle, showBack = false, action }) {
  const navigate = useNavigate()
  return (
    <div className="bg-cream pt-safe-top pb-4 px-4 border-b border-beige sticky top-0 z-40">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="text-terracota text-2xl p-1">‹</button>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-xl text-warm-brown font-semibold leading-tight">{title}</h1>
            {subtitle && <p className="text-light-brown text-sm mt-0.5">{subtitle}</p>}
          </div>
          {action && action}
        </div>
      </div>
    </div>
  )
}
