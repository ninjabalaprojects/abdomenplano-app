// Endpoint para consultar entitlements de um email
// Chamado pelo frontend ao fazer login com email
export default async function handler(req, res) {
  // CORS para permitir chamadas do frontend
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const email = req.query.email
  if (!email) return res.status(400).json({ error: 'Email is required' })

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis SUPABASE_URL ou SUPABASE_PUBLISHABLE_KEY não configuradas')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const normalizedEmail = email.toLowerCase().trim()
    const url = `${supabaseUrl}/rest/v1/entitlements?email=eq.${encodeURIComponent(normalizedEmail)}&active=eq.true&select=product`

    const response = await fetch(url, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
      },
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Erro Supabase entitlements:', response.status, errText)
      return res.status(500).json({ error: 'Database error' })
    }

    const data = await response.json()
    const products = Array.isArray(data) ? data.map(row => row.product) : []

    return res.status(200).json({ products })
  } catch (err) {
    console.error('Erro ao consultar entitlements:', err.message)
    return res.status(500).json({ error: 'Connection error' })
  }
}
