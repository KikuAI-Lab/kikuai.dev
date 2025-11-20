<template>
  <div class="products-page">
    <div class="page-header">
      <h1>Our Products</h1>
      <p class="page-subtitle">Simple APIs for data analysis and automation</p>
    </div>
    
    <div class="products-grid">
      <ProductCard
        v-for="product in allProducts"
        :key="product.slug"
        :product="product"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import productsData from '~/data/products.json'
import toolsData from '~/data/tools.json'
import type { Product } from '~/types/products'

// Helper function to extract date from releaseLabel for sorting
function getReleaseDate(product: Product): Date | null {
  if (!product.releaseLabel) return null
  
  // Parse "Release: November 2025" format
  const match = product.releaseLabel.match(/(\w+)\s+(\d{4})/)
  if (!match) return null
  
  const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                      'july', 'august', 'september', 'october', 'november', 'december']
  const month = monthNames.indexOf(match[1].toLowerCase())
  const year = parseInt(match[2])
  
  if (month === -1) return null
  return new Date(year, month, 1)
}

// Combine products and tools, sorted by release date
const allProducts = computed(() => {
  const combined = [...productsData, ...toolsData] as Product[]
  
  return combined.sort((a, b) => {
    // Live products first (ReliAPI)
    if (a.status === 'live' && b.status !== 'live') return -1
    if (a.status !== 'live' && b.status === 'live') return 1
    
    // Then sort by release date
    const dateA = getReleaseDate(a)
    const dateB = getReleaseDate(b)
    
    if (!dateA && !dateB) return 0
    if (!dateA) return 1
    if (!dateB) return -1
    
    return dateA.getTime() - dateB.getTime()
  })
})

useHead({
  title: 'Products | KikuAI Lab',
  meta: [
    {
      name: 'description',
      content: 'Explore our collection of autonomous AI tools for data analysis and automation.'
    }
  ]
})
</script>

<style scoped>
.products-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: 2.425rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.6rem;
  line-height: 1.15;
}

.page-subtitle {
  font-size: 1.125rem;
  color: #b2b4b8;
  font-weight: 450;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}

</style>

