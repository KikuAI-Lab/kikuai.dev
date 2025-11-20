import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Загрузить переменные окружения
config()

const prisma = new PrismaClient()

const products = [
  { slug: 'tas', name: 'TAS', description: 'Real-time commercial spam moderation' },
  { slug: 'patas', name: 'PATAS', description: 'DB analysis → spam patterns → SQL mass-marking' },
  { slug: 'reliapi', name: 'ReliAPI', description: 'API Failover & Retry Gateway' },
  { slug: 'routex', name: 'RouteX', description: 'LLM router via OpenRouter' },
  { slug: 'momentumai', name: 'MomentumAI', description: 'Crypto autotrading from pre-move patterns' },
  { slug: 'insightsocial', name: 'InsightSocial', description: 'Crypto autotrading from social/insider signals' }
]

const plans = [
  // TAS
  {
    productSlug: 'tas',
    name: 'TAS Starter',
    description: '10K requests/month',
    paddlePriceId: 'pri_tas_starter', // Replace with real Paddle Price ID
    price: 9.99,
    currency: 'USD',
    interval: 'month',
    limits: { requests: 10000, rate: 100 },
    features: { rules: true, ml: true, llm: false }
  },
  {
    productSlug: 'tas',
    name: 'TAS Pro',
    description: '100K requests/month',
    paddlePriceId: 'pri_tas_pro',
    price: 49.99,
    currency: 'USD',
    interval: 'month',
    limits: { requests: 100000, rate: 500 },
    features: { rules: true, ml: true, llm: true }
  },
  // PATAS
  {
    productSlug: 'patas',
    name: 'PATAS Starter',
    description: '5K patterns/month',
    paddlePriceId: 'pri_patas_starter',
    price: 19.99,
    currency: 'USD',
    interval: 'month',
    limits: { patterns: 5000, rate: 50 },
    features: { analysis: true, sql: true, training: false }
  },
  // ReliAPI
  {
    productSlug: 'reliapi',
    name: 'ReliAPI Starter',
    description: '50K requests/month',
    paddlePriceId: 'pri_reliapi_starter',
    price: 14.99,
    currency: 'USD',
    interval: 'month',
    limits: { requests: 50000, rate: 200 },
    features: { failover: true, retry: true, monitoring: false }
  },
  // RouteX
  {
    productSlug: 'routex',
    name: 'RouteX Starter',
    description: '10K requests/month',
    paddlePriceId: 'pri_routex_starter',
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    limits: { requests: 10000, rate: 100 },
    features: { routing: true, verification: true, cost_optimization: true }
  },
  // MomentumAI
  {
    productSlug: 'momentumai',
    name: 'MomentumAI Starter',
    description: '1K signals/month',
    paddlePriceId: 'pri_momentumai_starter',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    limits: { signals: 1000, rate: 10 },
    features: { patterns: true, alerts: true }
  },
  // InsightSocial
  {
    productSlug: 'insightsocial',
    name: 'InsightSocial Starter',
    description: '1K signals/month',
    paddlePriceId: 'pri_insightsocial_starter',
    price: 99.99,
    currency: 'USD',
    interval: 'month',
    limits: { signals: 1000, rate: 10 },
    features: { social: true, insider: true, prefilter: true }
  }
]

async function main() {
  console.log('Seeding products and plans...')
  
  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData
    })
    
    console.log(`Created/updated product: ${product.name}`)
  }
  
  for (const planData of plans) {
    const product = await prisma.product.findUnique({
      where: { slug: planData.productSlug }
    })
    
    if (!product) {
      console.error(`Product ${planData.productSlug} not found`)
      continue
    }
    
    const { productSlug, ...planFields } = planData
    
    await prisma.plan.upsert({
      where: { paddlePriceId: planData.paddlePriceId },
      update: {},
      create: {
        ...planFields,
        productId: product.id
      }
    })
    
    console.log(`Created/updated plan: ${planData.name}`)
  }
  
  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

