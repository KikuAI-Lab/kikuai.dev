import { prisma } from '~/server/utils/db'
import crypto from 'crypto'

const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || ''

function verifyPaddleSignature(payload: string, signature: string): boolean {
  if (!PADDLE_WEBHOOK_SECRET) {
    console.warn('PADDLE_WEBHOOK_SECRET not set, skipping verification')
    return true
  }
  
  const hmac = crypto.createHmac('sha256', PADDLE_WEBHOOK_SECRET)
  hmac.update(payload)
  const expectedSignature = hmac.digest('hex')
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export default defineEventHandler(async (event) => {
  const rawBody = await readRawBody(event)
  if (!rawBody) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing request body'
    })
  }
  
  const signature = getHeader(event, 'paddle-signature')
  if (!signature) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing signature'
    })
  }
  
  const isValid = verifyPaddleSignature(rawBody.toString(), signature)
  
  const payload = JSON.parse(rawBody.toString())
  const eventType = payload.event_type
  
  // Log webhook
  const webhookLog = await prisma.webhookLog.create({
    data: {
      provider: 'paddle',
      eventType,
      payload: payload as any,
      signature,
      isValid,
      processed: false
    }
  })
  
  if (!isValid) {
    await prisma.webhookLog.update({
      where: { id: webhookLog.id },
      data: { error: 'Invalid signature', processed: true }
    })
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid signature'
    })
  }
  
  try {
    // Handle different event types
    // Note: Paddle API v2 uses 'transaction.completed', v1 uses 'payment.succeeded'
    if (eventType === 'transaction.completed' || eventType === 'payment.succeeded' || eventType === 'subscription.created') {
      const subscriptionId = payload.data.subscription_id
      const customerId = payload.data.customer_id
      const priceId = payload.data.items?.[0]?.price_id
      
      if (!priceId) {
        throw new Error('Missing price_id in payload')
      }
      
      const plan = await prisma.plan.findUnique({
        where: { paddlePriceId: priceId },
        include: { product: true }
      })
      
      if (!plan) {
        throw new Error(`Plan not found for price_id: ${priceId}`)
      }
      
      // Find user by email from Paddle customer
      const email = payload.data.customer_email
      if (!email) {
        throw new Error('Missing customer_email')
      }
      
      let user = await prisma.user.findUnique({
        where: { email }
      })
      
      if (!user) {
        // Create user if doesn't exist (shouldn't happen in normal flow)
        user = await prisma.user.create({
          data: {
            email,
            name: payload.data.customer_name || null,
            supabaseId: `paddle_${customerId}` // Using Paddle customer ID as identifier
          }
        })
      }
      
      // Create or update subscription
      const subscription = await prisma.subscription.upsert({
        where: { paddleSubscriptionId: subscriptionId },
        update: {
          status: 'active',
          currentPeriodStart: payload.data.current_billing_period?.starts_at
            ? new Date(payload.data.current_billing_period.starts_at)
            : null,
          currentPeriodEnd: payload.data.current_billing_period?.ends_at
            ? new Date(payload.data.current_billing_period.ends_at)
            : null,
          paddleCustomerId: customerId
        },
        create: {
          userId: user.id,
          planId: plan.id,
          paddleSubscriptionId: subscriptionId,
          paddleCustomerId: customerId,
          status: 'active',
          currentPeriodStart: payload.data.current_billing_period?.starts_at
            ? new Date(payload.data.current_billing_period.starts_at)
            : null,
          currentPeriodEnd: payload.data.current_billing_period?.ends_at
            ? new Date(payload.data.current_billing_period.ends_at)
            : null
        }
      })
      
      // Create invoice if payment succeeded
      if (eventType === 'transaction.completed' || eventType === 'payment.succeeded') {
        await prisma.invoice.create({
          data: {
            userId: user.id,
            subscriptionId: subscription.id,
            paddleInvoiceId: payload.data.id,
            paddleTransactionId: payload.data.transaction_id,
            amount: parseFloat(payload.data.totals?.total || '0'),
            currency: payload.data.currency_code || 'USD',
            status: 'paid',
            paidAt: new Date(),
            invoiceUrl: payload.data.invoice_url || null,
            receiptUrl: payload.data.receipt_url || null
          }
        })
      }
    } else if (eventType === 'subscription.updated') {
      const subscriptionId = payload.data.id
      
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: subscriptionId },
        data: {
          status: payload.data.status,
          currentPeriodStart: payload.data.current_billing_period?.starts_at
            ? new Date(payload.data.current_billing_period.starts_at)
            : null,
          currentPeriodEnd: payload.data.current_billing_period?.ends_at
            ? new Date(payload.data.current_billing_period.ends_at)
            : null,
          cancelAtPeriodEnd: payload.data.scheduled_change?.action === 'cancel'
        }
      })
    } else if (eventType === 'subscription.canceled') {
      const subscriptionId = payload.data.id
      
      await prisma.subscription.updateMany({
        where: { paddleSubscriptionId: subscriptionId },
        data: {
          status: 'canceled',
          canceledAt: new Date()
        }
      })
    }
    
    await prisma.webhookLog.update({
      where: { id: webhookLog.id },
      data: { processed: true }
    })
    
    return { success: true }
  } catch (error: any) {
    await prisma.webhookLog.update({
      where: { id: webhookLog.id },
      data: {
        error: error.message,
        processed: true
      }
    })
    
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Webhook processing failed'
    })
  }
})

