import { createHmac, timingSafeEqual } from 'crypto'

// Desabilitar o parse automático do body para poder ler o raw string
// necessário para calcular o HMAC sobre a string exata enviada pela Kiwify
export const config = {
  api: {
    bodyParser: false,
  },
}

// Mapeamento produto → entitlement_key
// Usar product_name como chave (confirmar se product_id é mais estável após testes)
const PRODUCT_MAP = {
  'Protocolo Abdomen Plano': 'abdomen_plano',
  'Protocolo Colágeno Hormonal': 'colageno_hormonal',
}

// Eventos confirmados pelo teste real
const EVENTOS_LIBERACAO = ['order_approved']
// ATENÇÃO: valores de reembolso/chargeback ainda precisam ser confirmados
// com um teste real na Kiwify — adicionar os valores corretos quando confirmado
const EVENTOS_REVOGACAO = ['order_refunded', 'chargeback', 'order_chargeback']

async function lerRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Ler body cru (string), necessário para validar HMAC corretamente
  let rawBody
  let body
  try {
    rawBody = await lerRawBody(req)
    body = JSON.parse(rawBody)
  } catch (err) {
    console.error('Erro ao ler/parsear body:', err.message)
    return res.status(400).json({ error: 'Invalid body' })
  }

  // Validação HMAC-SHA1 com comparação resistente a timing attack
  const token = process.env.KIWIFY_WEBHOOK_TOKEN || ''
  const receivedSig = req.query.signature || ''
  const expectedSig = createHmac('sha1', token).update(rawBody).digest('hex')

  let valid = false
  try {
    valid = timingSafeEqual(
      Buffer.from(expectedSig, 'hex'),
      Buffer.from(receivedSig.padEnd(expectedSig.length, '0'), 'hex').slice(0, Buffer.from(expectedSig, 'hex').length)
    )
  } catch {
    valid = false
  }

  if (!valid) {
    console.error('Assinatura inválida. Esperada:', expectedSig, '| Recebida:', receivedSig)
    return res.status(401).json({ error: 'Assinatura inválida' })
  }

  // Campos confirmados pelo payload real da Kiwify
  const evento = body?.webhook_event_type || ''
  const email = body?.Customer?.email || ''
  const productName = body?.Product?.product_name || body?.Product?.name || ''

  console.log('Webhook validado. Evento:', evento, '| Email:', email, '| Produto:', productName)

  if (!email) {
    console.error('Email não encontrado no payload')
    return res.status(200).json({ received: true, warning: 'no_email_found' })
  }

  const normalizedEvento = String(evento).toLowerCase()
  const isLiberacao = EVENTOS_LIBERACAO.includes(normalizedEvento)
  const isRevogacao = EVENTOS_REVOGACAO.includes(normalizedEvento)

  if (!isLiberacao && !isRevogacao) {
    console.log('Evento ignorado (não é compra nem reembolso):', evento)
    return res.status(200).json({ received: true, ignored: true, evento })
  }

  const productKey = PRODUCT_MAP[productName] || 'abdomen_plano'
  const active = isLiberacao

  console.log(`Upsert Supabase: email=${email} | produto=${productKey} | active=${active}`)

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.error('Variáveis SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  try {
    // on_conflict=email,product é obrigatório para o upsert funcionar corretamente
    const response = await fetch(`${supabaseUrl}/rest/v1/entitlements?on_conflict=email,product`, {
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
      return res.status(500).json({ error: 'Database error' })
    }

    console.log('Supabase OK:', productKey, active ? 'LIBERADO' : 'REVOGADO')
    return res.status(200).json({ received: true, product: productKey, active })
  } catch (err) {
    console.error('Erro ao conectar Supabase:', err.message)
    return res.status(500).json({ error: 'Connection error' })
  }
}
