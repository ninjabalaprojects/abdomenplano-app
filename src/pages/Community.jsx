import { APP_CONFIG } from '../config/app.config'
import Header from '../components/Header'
import Navigation from '../components/Navigation'

export default function Community() {
  return (
    <div className="min-h-screen bg-cream pb-24">
      <Header title="Desafío Ativa 7D" subtitle="Tu comunidad de apoyo" />
      <div className="max-w-lg mx-auto px-4 py-4 space-y-5">
        <div className="bg-gradient-to-br from-beige to-cream rounded-2xl p-6 text-center">
          <div className="text-5xl mb-3">💬</div>
          <h2 className="font-serif text-xl text-warm-brown font-bold mb-2">El Desafío Ativa 7D</h2>
          <p className="text-light-brown text-sm leading-relaxed">
            7 días en vivo con {APP_CONFIG.instructorName}. Soporte diario, comunidad de mujeres en el mismo camino y correcciones personalizadas.
          </p>
        </div>

        {[
          { emoji: '📱', title: 'Acceso al grupo privado', desc: 'Un grupo exclusivo en WhatsApp con Carolina y cientos de mujeres en tu mismo proceso.' },
          { emoji: '🎥', title: 'Lives diarios por 7 días', desc: 'Carolina aparece en vivo todos los días del desafío para guiarte, responder preguntas y celebrar tus avances.' },
          { emoji: '🏆', title: 'Reconocimiento de resultados', desc: 'Las alumnas con más adherencia y resultados son destacadas ante toda la comunidad.' },
          { emoji: '🔔', title: 'Recordatorios de práctica', desc: 'El grupo envía recordatorios diarios para mantener tu hábito.' },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-pale-rose shadow-sm flex items-start gap-3">
            <span className="text-2xl">{item.emoji}</span>
            <div>
              <h3 className="font-medium text-warm-brown">{item.title}</h3>
              <p className="text-light-brown text-sm mt-1">{item.desc}</p>
            </div>
          </div>
        ))}

        <a
          href={APP_CONFIG.whatsappGroupUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-[#25D366] text-white py-4 rounded-2xl font-semibold text-base shadow-lg active:scale-95 transition-all"
        >
          💬 Unirme al grupo ahora
        </a>
        <p className="text-center text-light-brown/60 text-xs">
          Al hacer clic serás redirigida a WhatsApp. El grupo es 100% gratuito para alumnas del protocolo.
        </p>
      </div>
      <Navigation />
    </div>
  )
}
