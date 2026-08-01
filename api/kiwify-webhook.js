// Mapeamento de nomes de produto da Kiwify → chave interna do app
// Adicione novos produtos aqui conforme necesário
const PRODUCT_MAP = {
  'Protocolo Abdomen Plano': 'abdomen_plano',
  'Protocolo Colágeno Hormonal': 'colageno_hormonal',
}

// Eventos que indicam compra aprovada
const APPROVED_EVENTS = ['paid', 'approved', 'complete', 'completed', 'order_approved']
// Eventos que indicam reembolso ou chargeback
const REFUND_EVENTS = ['refunded', 'chargedback', 'chargeback', 'cancelled', 'order_refunded']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Validar token (Kiwify envia via query param ou campo no body)
  const token =
    req.query.token ||
    req.headers['x-kiwify-token'] ||
    req.body?.webhook_token

  if (token !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    console.error('Webhook token inválido:', token)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const body = req.body

  // LOG COMPLETO — consulte os logs da Vercel após o primeiro teste real
  // para identificar os campos corretos do payload da Kiwify
  console.log('=== KIWIFY WEBHOOK PAYLOAD ===')
  console.log(JSON.stringify(body, null, 2))
  console.log('==============================')

  // Extrair campos — tentamos múltiplos caminhos pois o formato pode variar
  const event =
    body?.order_status ||
    body?.event ||
    body?.status ||
    body?.type ||
    ''

  const email =
    body?.Customer?.email ||
    body?.customer?.email ||
    body?.buyer?.email ||
    body?.email ||
    ''

  const productName =
    body?.Product?.name ||
    body?.product?.name ||
    body?.product_name ||
    body?.order?.product?.name ||
    ''

  console.log('Evento:', event, '| Email:', email, '| Produto:', productName)

  if (!email) {
    console.error('Nenhum email encontrado no payload')
    return res.status(200).json({ received: true, warning: 'no_email_found' })
  }

  const normalizedEvent = String(event).toLowerCase()
  const isApproved = APPROVED_EVENTS.includes(normalizedEvent)
  const isRefund = REFUND_EVENTS.includes(normalizedEvent)

  if (!isApproved && !isRefund) {
    console.log('Evento ignorado:', event)
    return res.status(200).json({ received: true, ignored: true, event })
  }

  // Mapear nome do produto para chave interna
  const productKey = PRODUCT_MAP[productName] || 'abdomen_plano'
  const active = isApproved

  console.log(`Upsert: email=${email} | produto=${productKey} | active=${active}`)

  // Upsert no Supabase via REST API
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/entitlements`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Prefer': 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        product: productKey,
        active,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Erro Supabase:', response.status, errText)
      return res.status(500).json({ error: 'Database error', detail: errText })
    }

    console.log('Supabase upsert OK:', productKey, active)
    return res.status(200).json({ received: true, product: productKey, active })
  } catch (err) {
    console.error('Erro ao conectar Supabase:', err.message)
    return res.status(500).json({ error: 'Connection error' })
  }
}
