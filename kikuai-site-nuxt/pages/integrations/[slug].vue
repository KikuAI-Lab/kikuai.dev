<template>
  <div v-if="integration" class="integration-detail">
    <NuxtLink to="/integrations" class="back-link">
      <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      Back to Integrations
    </NuxtLink>
    
    <h1 class="integration-title">{{ integration.name }}</h1>
    
    <div class="integration-content">
      <div v-html="integration.content"></div>
      
      <div class="code-examples">
        <h2>Code Examples</h2>
        <div v-for="(example, index) in integration.examples" :key="index" class="code-block">
          <h3>{{ example.title }}</h3>
          <pre><code>{{ example.code }}</code></pre>
        </div>
      </div>
      
      <div class="related-products">
        <h2>Related Products</h2>
        <div class="products-list">
          <NuxtLink
            v-for="productSlug in integration.relatedProducts"
            :key="productSlug"
            :to="`/products/${productSlug}`"
            class="product-link"
          >
            {{ getProductName(productSlug) }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const integrations: Record<string, any> = {
  nodejs: {
    name: 'Node.js',
    content: '<p>Integrate KikuAI products into your Node.js applications using native fetch or axios.</p><p>All endpoints support standard HTTP methods and return JSON responses.</p>',
    examples: [
      {
        title: 'Basic Request',
        code: `const response = await fetch('https://kikuai.dev/api/demo/tas', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'your data' })
})
const data = await response.json()`
      }
    ],
    relatedProducts: ['tas', 'patas', 'kaida']
  },
  python: {
    name: 'Python',
    content: '<p>Use KikuAI APIs with Python using requests or httpx libraries.</p><p>All endpoints are RESTful and return JSON data.</p>',
    examples: [
      {
        title: 'Using requests',
        code: `import requests

response = requests.post(
    'https://kikuai.dev/api/demo/tas',
    json={'input': 'your data'}
)
data = response.json()`
      }
    ],
    relatedProducts: ['tas', 'patas']
  },
  curl: {
    name: 'cURL',
    content: '<p>Quick integration examples using cURL for testing and automation.</p>',
    examples: [
      {
        title: 'Basic cURL',
        code: `curl -X POST https://kikuai.dev/api/demo/tas \\
  -H "Content-Type: application/json" \\
  -d '{"input": "your data"}'`
      }
    ],
    relatedProducts: ['tas']
  }
}

const integration = integrations[slug]

if (!integration) {
  throw createError({ statusCode: 404, statusMessage: 'Integration not found' })
}

const products = await import('~/data/products.json').then(m => m.default)

const getProductName = (slug: string) => {
  const product = products.find((p: any) => p.slug === slug)
  return product?.name || slug
}

useHead({
  title: integration.name,
  meta: [
    { name: 'description', content: `How to integrate KikuAI products with ${integration.name}` }
  ]
})
</script>

<style scoped>
.integration-detail {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 2rem;
  text-decoration: none;
  transition: all 200ms ease-in-out;
}

.back-link:hover {
  color: var(--text);
}

.back-icon {
  width: 16px;
  height: 16px;
}

.integration-title {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 2rem;
}

.integration-content {
  line-height: 1.7;
  color: var(--text-muted);
}

.integration-content :deep(p) {
  margin-bottom: 1rem;
}

.code-examples {
  margin-top: 3rem;
}

.code-examples h2,
.related-products h2 {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.code-block {
  margin-bottom: 2rem;
}

.code-block h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.code-block pre {
  background-color: #0a0b0d;
  border-radius: 4px;
  padding: 1rem;
  overflow-x: auto;
}

.code-block code {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  color: var(--text);
}

.related-products {
  margin-top: 3rem;
}

.products-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.product-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--bg-darker);
  border-radius: 4px;
  color: var(--text);
  text-decoration: none;
  transition: all 200ms ease-in-out;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.product-link:hover {
  background-color: var(--hover);
  transform: scale(1.02);
}
</style>

