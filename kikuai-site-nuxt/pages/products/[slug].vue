<template>
  <div v-if="product" class="product-detail-page">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    <div class="ambient-glow"></div>
    <div class="product-header">
      <NuxtLink to="/" class="back-link">
        <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </NuxtLink>
      
      <div class="product-hero">
        <div class="product-hero-icon">
          <PatasIcon v-if="product.slug === 'patas' || product.slug === 'kaida' || product.slug === 'datafold'" class="icon" />
          <TasIcon v-else-if="product.slug === 'tas'" class="icon" />
          <ReliApiIcon v-else-if="product.slug === 'reliapi' || product.slug === 'fynx'" class="icon" />
          <RouteXIcon v-else-if="product.slug === 'routex' || product.slug === 'routellm'" class="icon" />
          <MomentumAiIcon v-else-if="product.slug === 'momentumai'" class="icon" />
          <InsightSocialIcon v-else-if="product.slug === 'insightsocial'" class="icon" />
          <PatasIcon v-else class="icon" />
        </div>
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-formula">{{ product.oneLiner }}</p>
      </div>
    </div>

    <div v-if="product.status === 'soon'" class="coming-soon-message">
      <div class="coming-soon-icon">🚧</div>
      <h2 class="coming-soon-title">Coming soon</h2>
      <p class="coming-soon-text">This product is currently under development and will be available soon.</p>
      <p v-if="product.releaseLabel" class="coming-soon-release">{{ product.releaseLabel }}</p>
    </div>
    
    <div v-else class="product-actions">
      <a
        v-if="product.links?.demo"
        :href="product.links.demo"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        Try demo
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
      </a>
      <NuxtLink
        v-else
        :to="`/products/${product.slug}#demo`"
        class="btn btn-primary"
      >
        Try demo
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
      </NuxtLink>
      <button
        v-if="product.hasApi"
        class="btn btn-secondary"
        :disabled="product.status === 'wip'"
        :title="product.status === 'wip' ? 'Coming soon' : 'Get API key'"
        @click="handleGetApiKey"
      >
        Get API key
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </button>
      <button
        v-else
        class="btn btn-secondary"
        disabled
        title="API coming soon"
      >
        Get API key
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </button>
      <a
        v-if="product.links?.docs"
        :href="product.links.docs"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
      >
        Docs
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/>
        </svg>
      </a>
      <a
        v-if="product.links?.github"
        :href="product.links.github"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-secondary"
      >
        GitHub
        <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      </a>
    </div>

    <div v-if="content" class="product-description">
      <div class="description-text">
        <p v-for="(para, idx) in content.description" :key="idx">{{ para }}</p>
      </div>
      
      <div v-if="content.problem" class="problem-section">
        <h3 class="subsection-title">Problem</h3>
        <p>{{ content.problem }}</p>
      </div>
      
      <div v-if="content.useCase" class="usecase-section">
        <h3 class="subsection-title">When to use</h3>
        <p>{{ content.useCase }}</p>
      </div>
      
      <div v-if="content.inputOutput" class="input-output-section">
        <h3 class="subsection-title">Input / Output</h3>
        <div class="io-pair">
          <div class="io-item">
            <span class="io-label">Input:</span>
            <span class="io-value">{{ content.inputOutput.input }}</span>
          </div>
          <div class="io-item">
            <span class="io-label">Output:</span>
            <span class="io-value">{{ content.inputOutput.output }}</span>
          </div>
        </div>
      </div>
      
      <div v-if="content.examples" class="examples-section">
        <h3 class="subsection-title">Example</h3>
        <div v-for="(example, idx) in content.examples" :key="idx" class="code-example">
          <div class="code-example-title">{{ example.title }}</div>
          <pre><code>{{ example.code }}</code></pre>
        </div>
      </div>
    </div>

    <div v-if="product.metrics" class="product-metrics">
      <details class="metrics-details">
        <summary class="metrics-summary">Benchmarks</summary>
        <div class="metrics-content">
          <div v-if="product.metrics.p95ms_rules" class="metric">
            <span class="metric-label">Rules P95:</span>
            <span class="metric-value">{{ product.metrics.p95ms_rules }}ms</span>
          </div>
          <div v-if="product.metrics.p95ms_llm" class="metric">
            <span class="metric-label">LLM P95:</span>
            <span class="metric-value">{{ product.metrics.p95ms_llm }}ms</span>
          </div>
          <div v-if="product.metrics.fpr" class="metric">
            <span class="metric-label">False Positive Rate:</span>
            <span class="metric-value">{{ product.metrics.fpr }}</span>
          </div>
        </div>
      </details>
    </div>

    <div v-if="product.status !== 'soon'" id="demo" class="demo-section">
      <h2 class="section-title">Try it now</h2>
      <ProductDemo :product-slug="product.slug" :endpoint="`/api/demo/${product.slug}`" />
    </div>

    <div v-if="product.links?.rapidapi" class="product-links">
      <a
        :href="product.links.rapidapi"
        target="_blank"
        rel="noopener noreferrer"
        class="product-link"
      >
        <svg class="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 9h6v6H9z"/>
        </svg>
        RapidAPI
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import productsData from '~/data/products.json'
import toolsData from '~/data/tools.json'
import type { Product } from '~/types/products'
import PatasIcon from '~/components/icons/PatasIcon.vue'
import TasIcon from '~/components/icons/TasIcon.vue'
import ReliApiIcon from '~/components/icons/ReliApiIcon.vue'
import RouteXIcon from '~/components/icons/RouteXIcon.vue'
import MomentumAiIcon from '~/components/icons/MomentumAiIcon.vue'
import InsightSocialIcon from '~/components/icons/InsightSocialIcon.vue'

const route = useRoute()
const products = productsData as Product[]
const tools = toolsData as Product[]
const allItems = [...products, ...tools]
const product = allItems.find(p => p.slug === route.params.slug as string)

if (!product) {
  throw createError({ statusCode: 404, statusMessage: 'Product not found' })
}

// Authentication removed - Supabase has been removed from the project
const isAuthenticated = computed(() => false)

const handleGetApiKey = () => {
  if (product.status === 'wip') {
    return
  }
  
  // Authentication removed - show message
  alert('API key management is currently unavailable. Supabase authentication has been removed.')
}

// Product-specific content
const productContent: Record<string, { description: string[], problem?: string, useCase?: string, examples?: Array<{ title: string, code: string }>, inputOutput?: { input: string, output: string } }> = {
  reliapi: {
    description: [
      'ReliAPI provides automatic retries, response caching, deduplication, and circuit-breaker logic for any HTTP API endpoint.',
      'It handles transient failures, reduces load on downstream services, and improves response times through intelligent caching and request deduplication.'
    ],
    problem: 'External APIs can be unreliable, slow, or rate-limited. Without proper handling, failures cascade and performance degrades.',
    useCase: 'Use ReliAPI when you need to call external APIs that may be unreliable, slow, or rate-limited. It automatically retries failed requests, caches responses, deduplicates identical requests, and prevents cascading failures with circuit breakers.',
    examples: [
      {
        title: 'cURL example',
        code: `curl -X POST https://reliapi.kikuai.dev/api/proxy \\
  -H "Content-Type: application/json" \\
  -H "X-Target-URL: https://api.example.com/data" \\
  -d '{"key": "value"}'`
      },
      {
        title: 'JavaScript example',
        code: `const response = await fetch('https://reliapi.kikuai.dev/api/proxy', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Target-URL': 'https://api.example.com/data'
  },
  body: JSON.stringify({ key: 'value' })
})
const data = await response.json()`
      }
    ],
    inputOutput: {
      input: 'HTTP request to any API endpoint',
      output: 'Cached response if available, or retried request with circuit breaker protection'
    }
  },
  routellm: {
    description: [
      'RouteLLM is a routing layer that distributes requests across multiple LLM providers based on availability, cost, and latency.',
      'It automatically switches providers when one is down or slow, balances load, tracks usage, and enforces quota limits across providers.'
    ],
    problem: 'Managing multiple LLM providers requires handling different APIs, rate limits, and failover logic. This complexity grows with each provider added.',
    useCase: 'Use RouteLLM when you need to call multiple LLM providers (OpenAI, Anthropic, etc.) and want automatic failover, cost optimization, quota control, and unified API access. It eliminates the need to manage provider-specific code and handles rate limits automatically.',
    examples: [
      {
        title: 'cURL example',
        code: `curl -X POST https://routellm.kikuai.dev/api/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "model": "gpt-4o-mini"
  }'`
      },
      {
        title: 'JavaScript example',
        code: `const response = await fetch('https://routellm.kikuai.dev/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    model: 'gpt-4o-mini'
  })
})
const data = await response.json()`
      }
    ],
    inputOutput: {
      input: 'Chat completion or text completion request',
      output: 'Response from selected provider with automatic fallback on failure'
    }
  }
}

const content = productContent[product.slug] || null

const loaded = ref(false)

onMounted(() => {
  loaded.value = true
})

const seo = useProductSeo(product)
useHead({
  ...seo,
  link: [
    ...(seo.link || []),
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})
</script>

<style scoped>
.product-detail-page {
  --bg-main: #0a0a0a;
  --bg-card: #111111;
  --bg-card-hover: #1a1a1a;
  --text-main: #fafafa;
  --text-muted: #b0b0b0;
  --text-dim: #707070;
  --line: #222222;
  --line-bright: #333333;
  --accent-glow: rgba(237, 237, 237, 0.15);
  --font-mono: 'JetBrains Mono', monospace;
  
  max-width: 900px;
  margin: 0 auto;
  padding: 4.5rem 2.75rem;
  position: relative;
  background-color: var(--bg-main);
  color: var(--text-main);
  font-family: var(--font-mono);
  min-height: 100vh;
}

/* Background Effects */
.grid-overlay {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
  animation: gridPulse 10s ease-in-out infinite;
}

@keyframes gridPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.15; }
}

.scanline {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    rgba(0, 0, 0, 0.25) 51%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 1;
  opacity: 0.06;
  animation: scanlineMove 12s linear infinite;
}

@keyframes scanlineMove {
  0% { transform: translateY(0); }
  100% { transform: translateY(100vh); }
}

.ambient-glow {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(237, 237, 237, 0.025) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
  animation: ambientFloat 25s ease-in-out infinite;
}

@keyframes ambientFloat {
  0%, 100% { transform: translate(0, 0); }
  33% { transform: translate(30px, -30px); }
  66% { transform: translate(-20px, 20px); }
}

.product-header {
  margin-bottom: 4rem;
  text-align: center;
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 3rem;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.back-link:hover {
  color: var(--text-main);
  transform: translateX(-4px);
}

.back-icon {
  width: 16px;
  height: 16px;
}

.product-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.product-hero-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-hero-icon .icon {
  width: 100%;
  height: 100%;
  color: var(--text);
}

.product-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 500;
  color: var(--text-main);
  margin: 0 0 1.5rem 0;
  letter-spacing: -0.035em;
  line-height: 1.1;
}

.product-formula {
  font-size: 1.125rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0;
  line-height: 1.85;
  letter-spacing: -0.015em;
  font-weight: 400;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

@media (min-width: 640px) {
  .product-actions {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 3rem 1.5rem;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: 2px;
  font-weight: 500;
  font-size: 0.875rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--line);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-decoration: none;
  border: 1px solid var(--line);
  cursor: pointer;
  letter-spacing: -0.01em;
  font-family: var(--font-mono);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--text-main);
  color: var(--bg-main);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--line-bright);
  background-color: #f0f0f0;
}

.btn-primary .btn-icon {
  transition: all ease-in-out 0.25s;
}

.btn-primary:hover:not(:disabled) .btn-icon {
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--bg-card);
  color: var(--text-main);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--bg-card-hover);
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--line-bright);
  border-color: var(--line-bright);
}

.btn-secondary .btn-icon {
  transition: all ease-in-out 0.25s;
}

.btn-secondary:hover:not(:disabled) .btn-icon {
  transform: translateY(-1px);
  opacity: 1.05;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.product-metrics {
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.metrics-details {
  background-color: var(--bg-card);
  border-radius: 2px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--line);
  border: 1px solid var(--line);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.metrics-details:hover {
  border-color: var(--line-bright);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--line-bright);
}

.metrics-summary {
  color: var(--text);
  font-weight: 500;
  cursor: pointer;
  list-style: none;
}

.metrics-summary::-webkit-details-marker {
  display: none;
}

.metrics-summary::before {
  content: '▶';
  display: inline-block;
  margin-right: 0.5rem;
  transition: transform 200ms ease-in-out;
}

.metrics-details[open] .metrics-summary::before {
  transform: rotate(90deg);
}

.metrics-content {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line);
}

.metric {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.metric:last-child {
  margin-bottom: 0;
}

.metric-label {
  font-weight: 500;
}

.metric-value {
  color: var(--text);
}

.demo-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 2rem;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 2;
}

.product-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.product-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-decoration: none;
  transition: all 200ms ease-in-out;
}

.product-link:hover {
  color: var(--text);
}

.link-icon {
  width: 18px;
  height: 18px;
}

.product-description {
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
}

.description-text {
  margin-bottom: 2rem;
}

.description-text p {
  color: var(--text-muted);
  line-height: 1.85;
  margin-bottom: 1.25rem;
  font-size: 1.125rem;
  letter-spacing: -0.015em;
  font-weight: 400;
}

.description-text p:last-child {
  margin-bottom: 0;
}

.problem-section,
.examples-section,
.usecase-section,
.input-output-section {
  margin-top: 3rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--line);
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 1.25rem;
  letter-spacing: -0.02em;
}

.io-pair {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.io-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.io-label {
  font-weight: 500;
  color: var(--text);
  font-size: 0.875rem;
}

.io-value {
  color: var(--text-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.code-example {
  margin-bottom: 2rem;
  background-color: var(--bg-card);
  border-radius: 2px;
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.code-example-title {
  padding: 0.75rem 1rem;
  background-color: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-example pre {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-main);
  white-space: pre-wrap;
  word-break: break-all;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

.code-example code {
  font-family: inherit;
}

.usecase-section p {
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

.coming-soon-message {
  text-align: center;
  padding: 4rem 2rem;
  margin-bottom: 4rem;
  background-color: var(--bg-card);
  border-radius: 2px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 0 0 1px var(--line);
  border: 1px solid var(--line);
  position: relative;
  z-index: 2;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.coming-soon-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.coming-soon-title {
  font-size: 1.75rem;
  font-weight: 500;
  color: var(--text-main);
  margin: 0 0 1rem 0;
  letter-spacing: -0.02em;
}

.coming-soon-text {
  font-size: 1.125rem;
  color: var(--text-muted);
  line-height: 1.85;
  margin: 0;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  letter-spacing: -0.015em;
  font-weight: 400;
}

.coming-soon-release {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  opacity: 0.8;
}
</style>
