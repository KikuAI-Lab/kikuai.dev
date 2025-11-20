<template>
  <div class="integrations-page">
    <h1 class="page-title">Integrations</h1>
    <p class="page-description">
      Connect KikuAI products with your existing tools and workflows.
    </p>
    
    <div class="integrations-grid">
      <NuxtLink
        v-for="integration in integrations"
        :key="integration.slug"
        :to="`/integrations/${integration.slug}`"
        class="integration-card"
      >
        <h3>{{ integration.name }}</h3>
        <p>{{ integration.description }}</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const integrations = [
  {
    slug: 'nodejs',
    name: 'Node.js',
    description: 'Integrate KikuAI products into your Node.js applications'
  },
  {
    slug: 'python',
    name: 'Python',
    description: 'Use KikuAI APIs with Python requests or httpx'
  },
  {
    slug: 'curl',
    name: 'cURL',
    description: 'Quick integration examples using cURL'
  }
]

useHead({
  title: 'Integrations',
  meta: [
    { name: 'description', content: 'Integrate KikuAI products with your tools and workflows' }
  ]
})
</script>

<style scoped>
.integrations-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 1rem;
  text-align: center;
}

.page-description {
  font-size: 1.125rem;
  color: var(--text-muted);
  text-align: center;
  margin-bottom: 3rem;
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.integration-card {
  background-color: var(--bg-darker);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
  transition: all 200ms ease-in-out;
  text-decoration: none;
  color: inherit;
}

.integration-card:hover {
  transform: scale(1.02);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06),
              0 8px 24px rgba(0, 0, 0, 0.45);
}

.integration-card h3 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.integration-card p {
  color: var(--text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}
</style>

