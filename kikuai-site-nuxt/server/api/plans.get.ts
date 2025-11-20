import { prisma } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const plans = await prisma.plan.findMany({
    where: {
      status: 'active'
    },
    include: {
      product: {
        select: {
          slug: true,
          name: true
        }
      }
    },
    orderBy: {
      price: 'asc'
    }
  })
  
  return plans.map(plan => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price.toString(),
    currency: plan.currency,
    interval: plan.interval,
    paddlePriceId: plan.paddlePriceId,
    limits: plan.limits,
    features: plan.features,
    product: {
      slug: plan.product.slug,
      name: plan.product.name
    }
  }))
})

