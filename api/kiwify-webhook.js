import { createHash, createHmac } from 'crypto'

// Mapeamento de nomes de produto da Kiwify → chave interna do app
const PRODUCT_MAP = {
  'Protocolo Abdomen Plano': 'abdomen_plano',
  'Protocolo Colágeno Hormonal': 'colageno_hormonal',
}

const APPROVED_EVENTS = ['order_approved', 'paid', 'approved', 'complete', 'completed']
const REFUND_EVENTS = ['order_refunded', 'refunded', 'chargedback', 'chargeback', 'cancelled', 'order_cancelled']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = process.env.KIWIFY_WEBHOOK_TOKEN || ''
  const receivedSignature = req.query.signature || ''
  const body = req.body

  // rawBody como JSON.stringify do body parseado (melhor aproximação disponível)
  // NOTA: pode diferir da string original enviada pela Kiwify se os campos vieram em ordem diferente
  const rawBody = JSON.stringify(body)
  const orderId = body?.order_id || ''

  // === DEBUG — calcular todos os candidatos de hash ===
  const candidatos = {
    sha1_token:           createHash('sha1').update(token).digest('hex'),
    sha1_token_orderId:   createHash('sha1').update(token + orderId).digest('hex'),
    sha1_orderId_token:   createHash('sha1').update(orderId + token).digest('hex'),
    sha1_token_body:      createHash('sha1').update(token + rawBody).digest('hex'),
    sha1_body_token:      createHash('sha1').update(rawBody + token).digest('hex'),
    md5_token:            createHash('md5').update(token).digest('hex'),
    md5_token_orderId:    createHash('md5').update(token + orderId).digest('hex'),
    hmac_sha1_body:       createHmac('sha1', token).update(rawBody).digest('hex'),
    hmac_sha256_body:     createHmac('sha256', token).update(rawBody).digest('hex'),
    hmac_sha1_orderId:    createHmac('sha1', token).update(orderId).digest('hex'),
    hmac_sha256_orderId:  createHmac('sha256', token).update(orderId).digest('hex'),
  }

  console.log('SIGNATURE RECEBIDA:', receivedSignature)
  console.log('ORDER_ID usado:', orderId)
  console.log('CANDIDATOS:', JSON.stringify(candidatos, null, 2))

  const match = Object.entries(candidatos).find(([, valor]) => valor === receivedSignature)
  console.log('MATCH ENCONTRADO:', match ? match[0] : 'NENHUM CANDIDATO BATEU')

  // === Manter rejeição 401 até confirmar a fórmula correta ===
  // (Substituir por validação definitiva quando MATCH for encontrado)
  console.error('Rejeitando até confirmar fórmula de validação.')
  return res.status(401).json({ error: 'Unauthorized — validação em debug' })
}
