export const ACHIEVEMENTS = [
  { id: 'first_checkin',   emoji: '🌸', name: 'Primer paso',        desc: 'Completaste tu primera práctica',        condition: (p) => p.totalCheckins >= 1 },
  { id: 'streak_3',        emoji: '🔥', name: '3 días seguidos',    desc: '3 días de práctica sin interrupciones',  condition: (p) => p.streak >= 3 },
  { id: 'streak_7',        emoji: '⭐', name: 'Una semana entera',  desc: '7 días de racha — eres constante',       condition: (p) => p.streak >= 7 },
  { id: 'streak_14',       emoji: '💪', name: 'Dos semanas',        desc: '14 días seguidos. Imparable.',           condition: (p) => p.streak >= 14 },
  { id: 'streak_21',       emoji: '💎', name: 'Hábito formado',     desc: '21 días. Ya es parte de tu rutina.',     condition: (p) => p.streak >= 21 },
  { id: 'phase_1',         emoji: '🌬️', name: 'Respiro diferente', desc: 'Fase 1 completada',                      condition: (p) => p.completedPhases.includes(1) },
  { id: 'phase_2',         emoji: '🎯', name: 'Transverso activo', desc: 'Fase 2 completada',                      condition: (p) => p.completedPhases.includes(2) },
  { id: 'phase_3',         emoji: '🔗', name: 'Conexión lograda',  desc: 'Fase 3 completada',                      condition: (p) => p.completedPhases.includes(3) },
  { id: 'phase_4',         emoji: '✨', name: 'Cierre iniciado',   desc: 'Fase 4 completada — protocolo completo', condition: (p) => p.completedPhases.includes(4) },
  { id: 'photo_before',    emoji: '📷', name: 'Foto de inicio',    desc: 'Guardaste tu foto de referencia',        condition: (p) => p.photos >= 1 },
  { id: 'checkin_10',      emoji: '🏅', name: '10 prácticas',      desc: '10 sesiones completadas',                condition: (p) => p.totalCheckins >= 10 },
  { id: 'checkin_30',      emoji: '🏆', name: '30 prácticas',      desc: '30 sesiones — eres una alumna estrella', condition: (p) => p.totalCheckins >= 30 },
]
