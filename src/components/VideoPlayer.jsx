// VIDEO PLAYER - Replace videoId with real video embed ID when content is ready
// Supports YouTube, Vimeo, or custom embed URLs
export default function VideoPlayer({ videoId, platform = 'youtube', title = 'Clase del protocolo' }) {
  const getEmbedUrl = () => {
    if (!videoId || videoId.startsWith('PHASE_')) return null
    if (platform === 'youtube') return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    if (platform === 'vimeo') return `https://player.vimeo.com/video/${videoId}`
    return videoId // custom URL
  }

  const embedUrl = getEmbedUrl()

  if (!embedUrl) {
    return (
      <div className="relative bg-gradient-to-br from-terracota/10 to-dusty-rose/20 rounded-2xl overflow-hidden aspect-video flex items-center justify-center border-2 border-dashed border-terracota/30">
        <div className="text-center p-8">
          <div className="text-5xl mb-4">🎬</div>
          <p className="font-serif text-xl text-terracota font-semibold mb-2">{title}</p>
          <p className="text-light-brown text-sm">El video estará disponible pronto</p>
          <p className="text-light-brown/60 text-xs mt-2">ID: {videoId}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg">
      <iframe
        src={embedUrl}
        title={title}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
