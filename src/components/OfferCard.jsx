// OFFER CARD - Reusable upsell component
// New offers: edit src/config/offers.json only, no need to touch this component
export default function OfferCard({ offer }) {
  if (!offer?.active) return null

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-pale-rose overflow-hidden">
      {offer.imageUrl ? (
        <img src={offer.imageUrl} alt={offer.name} className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-32 bg-gradient-to-r from-terracota/20 to-dusty-rose/30 flex items-center justify-center">
          <span className="text-4xl">✨</span>
        </div>
      )}
      <div className="p-4">
        {offer.badge && (
          <span className="inline-block bg-terracota text-white text-xs font-medium px-2 py-1 rounded-full mb-2">
            {offer.badge}
          </span>
        )}
        <h3 className="font-serif text-lg text-warm-brown font-semibold">{offer.name}</h3>
        <p className="text-light-brown text-sm mt-1 mb-3">{offer.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-terracota font-bold text-xl">{offer.price}</span>
          <a
            href={offer.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-terracota text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-terracota/90 transition-colors"
          >
            Quiero esto →
          </a>
        </div>
      </div>
    </div>
  )
}
