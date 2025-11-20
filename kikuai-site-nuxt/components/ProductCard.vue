<template>
  <div
    v-if="product.status === 'soon'"
    class="product-card product-card-soon"
    :class="{ 'product-card-tool': isTool }"
  >
    <div class="product-icon">
      <component :is="iconComponent" v-if="iconComponent" />
    </div>
    <h3 class="product-name">{{ product.name }}</h3>
    <p class="product-oneliner">{{ product.oneLiner }}</p>
    <div class="coming-soon-badge">
      Coming soon
    </div>
    <p v-if="product.releaseLabel" class="product-release-label">{{ product.releaseLabel }}</p>
  </div>
  <NuxtLink
    v-else
    :to="`/products/${product.slug}`"
    class="product-card"
    :class="{ 'product-card-tool': isTool }"
  >
    <div class="product-icon">
      <component :is="iconComponent" v-if="iconComponent" />
    </div>
    <h3 class="product-name">{{ product.name }}</h3>
    <p class="product-oneliner">{{ product.oneLiner }}</p>
    <p v-if="product.releaseLabel" class="product-release-label">{{ product.releaseLabel }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types/products'
import { 
  Network, 
  Binary, 
  ShieldCheck, 
  Gauge, 
  Workflow as Nodes, 
  Layers, 
  Filter, 
  RotateCcw as Loop, 
  Route 
} from 'lucide-vue-next'

interface Props {
  product: Product
  isTool?: boolean
}

const props = defineProps<Props>()

const iconMap: Record<string, any> = {
  kaida: Network,
  patas: Binary,
  tas: ShieldCheck,
  momentumai: Gauge,
  insightsocial: Nodes,
  datafold: Layers,
  fynx: Filter,
  reliapi: Loop,
  routellm: Route
}

const iconComponent = computed(() => {
  return iconMap[props.product.slug.toLowerCase()] || null
})
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2.75rem;
  background-color: #111111;
  border-radius: 2px;
  text-decoration: none;
  color: #fafafa;
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid #222222;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.02);
  position: relative;
  overflow: hidden;
  min-height: 280px;
  justify-content: space-between;
}

.product-card::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, transparent, rgba(237, 237, 237, 0.15), transparent);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
  filter: blur(24px);
}

.product-card:hover::before,
.product-card:focus::before {
  opacity: 1;
}

.product-card:hover,
.product-card:focus {
  background-color: #1a1a1a;
  transform: translateY(-10px) scale(1.012);
  border-color: #333333;
  box-shadow: 
    0 20px 56px rgba(0, 0, 0, 0.65),
    0 0 0 1px #333333,
    0 0 36px rgba(237, 237, 237, 0.06);
}

.product-card-tool {
  opacity: 0.9;
}

.product-card-tool .product-name {
  font-size: 0.9375rem;
  color: var(--text-muted);
}

.product-card-tool .product-oneliner {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.product-icon {
  width: 64px;
  height: 64px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fafafa;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover .product-icon,
.product-card:focus .product-icon {
  transform: translateY(-4px) scale(1.05);
  opacity: 1.1;
}

.product-name {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fafafa;
  margin: 0 0 1.5rem 0;
  text-align: center;
  letter-spacing: -0.045em;
  line-height: 1.25;
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.product-card:hover .product-name,
.product-card:focus .product-name {
  transform: translateX(4px);
  letter-spacing: -0.035em;
}

.product-oneliner {
  font-size: 0.96875rem;
  color: #b0b0b0;
  margin: 0;
  text-align: center;
  line-height: 1.8;
  letter-spacing: -0.015em;
  margin-top: 0.875rem;
  font-weight: 400;
}

.product-card-soon {
  opacity: 0.7;
  cursor: default;
  pointer-events: none;
}

.product-card-soon:hover {
  transform: none;
  background-color: var(--bg-card);
}

.coming-soon-badge {
  margin-top: 0.75rem;
  padding: 0.375rem 0.75rem;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.product-release-label {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .product-card {
    padding: 1.5rem 1rem;
  }
  
  .product-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 1rem;
  }
  
  .product-name {
    font-size: 1rem;
  }
  
  .product-oneliner {
    font-size: 0.8125rem;
  }
}
</style>
