// Mapeamento de nomes de produto da Kiwify → chave interna do app
// Adicione novos produtos aqui conforme necesário
const PRODUCT_MAP = {
  'Protocolo Abdomen Plano': 'abdomen_plano',
  'Protocolo Colágeno Hormonal': 'colageno_hormonal',
}

// Eventos que indicam compra aprovada
const APPROVED_EVENTS = ['order_approved', 'paid', 'approved', 'complete', 'completed']
// Eventos que indicam reembolso ou chargeback (confirmar valores reais via logs)
const REFUND_EVENTS = ['order_refunded', 'refunded', 'chargedback', 'chargeback', 'cancelled', 'order_cancelled']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // === DEBUG TEMPORÁRIO — manter até confirmar parsing completo ===
  console.log('DEBUG headers:', JSON.stringify(req.headers))
  console.log('DEBUG query:', JSON.stringify(req.query))
  console.log('DEBUG body completo:', JSON.stringify(req.body, null, 2))
  console.log('DEBUG customer:', JSON.stringify(req.body?.Customer, null, 2))
  console.log('DEBUG product:', JSON.stringify(req.body?.Product, null, 2))
  console.log('DEBUG token env carregado:', !!process.env.KIWIFY_WEBHOOK_TOKEN)
  // ================================================================

  // TAREFA 1: token vem como query param ?signature=...
  const signature = req.query.signature

  if (signature !== process.env.KIWIFY_WEBHOOK_TOKEN) {
    console.error('Signature inválida. Recebida:', signature)
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const body = req.body

  // TAREFA 3: usar webhook_event_type para identificar o evento
  const event =
    body?.webhook_event_type ||
    body?.order_status ||
    body?.event ||
    body?.status ||
    ''

  // Email do comprador
  const email =
    body?.Customer?.email ||
    body?.customer?.email ||
    body?.buyer?.email ||
    body?.email ||
    ''

  // Nome/ID do produto
  const productName =
    body?.Product?.name ||
    body?.product?.name ||
    body?.Product?.product_id ||
    body?.product_name ||
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

  const productKey = PRODUCT_MAP[productName] || 'abdomen_plano'
  const active = isApproved

  console.log(`Upsert: email=${email} | produto=${productKey} | active=${active}`)

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
