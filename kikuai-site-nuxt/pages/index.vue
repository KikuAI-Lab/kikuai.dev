<template>
  <div class="homepage">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    <div class="ambient-glow"></div>
    
    <main class="main-container">
      <!-- Hero Section -->
      <section class="hero" :class="{ 'hero-loaded': loaded }">
        <div class="hero-content">
          <h1 class="hero-title">
            <span class="prefix">>></span>
            <span class="title-line">AUTONOMOUS</span><br/>
            <span class="highlight">INTELLIGENCE</span>
          </h1>
          <p class="hero-desc">
            Minimalist APIs for data analysis and automation.
            <br/>Built for integration. No noise.
          </p>
        </div>
        <div class="hero-stats">
          <div 
            class="stat-box" 
            v-for="(stat, index) in stats" 
            :key="index" 
            :style="{ animationDelay: `${index * 0.1}s` }"
            @mouseenter="() => onStatHover(index)"
            @mouseleave="onStatLeave"
          >
            <div class="stat-glow" :style="{ opacity: hoveredStat === index ? 1 : 0 }"></div>
            <span class="stat-label">{{ stat.label }}</span>
            <span class="stat-value">{{ stat.value }}</span>
          </div>
        </div>
      </section>

      <!-- Active Modules Grid -->
      <section class="modules-section" :class="{ 'modules-loaded': loaded }">
        <div class="section-header">
          <h2 class="section-title">ACTIVE_MODULES</h2>
          <div class="section-line"></div>
    </div>
    
        <div class="modules-grid">
          <NuxtLink
            v-for="(product, index) in allProducts" 
          :key="product.slug"
            :to="`/products/${product.slug}`"
            class="module-card" 
            :class="[product.status, { 'card-loaded': loaded }]"
            :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
            @mouseenter="() => onCardHover(index)"
            @mouseleave="onCardLeave"
          >
            <div class="card-glow" :style="{ opacity: hoveredCard === index ? 1 : 0 }"></div>
            <div class="card-header">
              <span class="module-id">MOD_{{ String(index + 1).padStart(2, '0') }}</span>
              <span class="status-dot" :class="product.status">
                <span class="status-ring"></span>
              </span>
            </div>
            <div class="card-body">
              <h3 class="module-name">{{ product.name }}</h3>
              <p class="module-desc">{{ product.oneLiner }}</p>
            </div>
            <div class="card-footer">
              <span class="tech-spec">{{ product.hasApi ? 'API' : 'TOOL' }}</span>
              <span class="action-arrow">→</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <!-- Terminal Footer -->
      <footer class="terminal-footer" :class="{ 'terminal-loaded': loaded }">
        <div class="terminal-header">
          <span class="term-title">SYS.LOG</span>
          <span class="term-status">
            <span class="status-pulse"></span>
            LIVE
          </span>
        </div>
        <div class="terminal-content" ref="terminalContent">
          <div 
            v-for="(log, index) in terminalLogs" 
            :key="`log-${index}`"
            class="log-line" 
            :class="log.type"
            :style="{ animationDelay: `${0.5 + index * 0.2}s` }"
          >
            <span class="log-time">{{ log.time }}</span>
            <span :class="`log-${log.type}`">{{ log.message }}</span>
          </div>
          <div 
            v-for="(msg, index) in chatMessages" 
            :key="`chat-${index}`"
            class="log-line chat-message"
            :class="msg.type"
          >
            <span class="log-time">{{ msg.time }}</span>
            <span :class="`log-${msg.type}`">{{ msg.content }}</span>
          </div>
          <div v-if="isLoading" class="log-line active">
            <span class="log-time">{{ currentTime }}</span>
            <span class="log-info">PROCESSING...</span>
          </div>
          <div v-else class="log-line active">
            <span class="log-time">{{ currentTime }}</span>
            <span class="log-info">Type your question here →</span>
            <form @submit.prevent="sendMessage" class="chat-input-form">
              <input
                v-model="userInput"
                type="text"
                class="chat-input"
                placeholder=""
                :disabled="isLoading"
                ref="chatInput"
              />
            </form>
      </div>
    </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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
  
  return filtered.sort((a, b) => {
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

const loaded = ref(false)
const currentTime = ref('')
const hoveredCard = ref<number | null>(null)
const hoveredStat = ref<number | null>(null)
const userInput = ref('')
const chatMessages = ref<Array<{ type: string; content: string; time: string }>>([])
const conversationHistory = ref<Array<{ role: string; content: string }>>([])
const isLoading = ref(false)
const terminalContent = ref<HTMLElement | null>(null)
const chatInput = ref<HTMLInputElement | null>(null)

const stats = computed(() => [
  { label: 'MODULES', value: String(allProducts.value.length).padStart(2, '0') },
  { label: 'UPTIME', value: '99.9%' }
])

const formatTime = () => {
  const now = new Date()
  return now.toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  })
}

// Initialize terminal logs with staggered times
const initializeTerminalLogs = () => {
  const now = new Date()
  const baseTime = now.getTime()
  
  terminalLogs.value = [
    { 
      time: new Date(baseTime - 3000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'INIT_SEQUENCE_STARTED', 
      type: 'info' 
    },
    { 
      time: new Date(baseTime - 2000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: `MODULES_LOADED [${allProducts.value.length}/${allProducts.value.length}]`, 
      type: 'success' 
    },
    { 
      time: new Date(baseTime - 1500).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'SYS_CHAT_INITIALIZING...', 
      type: 'info' 
    },
    { 
      time: new Date(baseTime - 1000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'LLM_MODEL_CONNECTED [GLM-4.5-AIR]', 
      type: 'success' 
    },
    { 
      time: new Date(baseTime - 500).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'CHAT_INTERFACE_READY', 
      type: 'success' 
    }
  ]
}

const terminalLogs = ref<Array<{ time: string; message: string; type: string }>>([])

const sendMessage = async (event: Event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!userInput.value.trim() || isLoading.value) return

  const message = userInput.value.trim()
  userInput.value = ''

  // Add user message to chat
  chatMessages.value.push({
    type: 'user',
    content: `> ${message}`,
    time: formatTime()
  })

  // Add to conversation history
  conversationHistory.value.push({
    role: 'user',
    content: message
  })

  isLoading.value = true
  scrollToBottom()

  try {
    const response = await $fetch('/api/chat/sys', {
      method: 'POST',
      body: {
        message: message,
        conversationHistory: conversationHistory.value
      }
    })

    if (response.success && 'message' in response && typeof response.message === 'string') {
      // Add assistant response
      chatMessages.value.push({
        type: 'assistant',
        content: response.message,
        time: formatTime()
      })

      // Add to conversation history
      conversationHistory.value.push({
        role: 'assistant',
        content: response.message
      })
    } else {
      throw new Error('Invalid response')
    }
  } catch (error: any) {
    console.error('Chat error:', error)
    let displayMessage = 'Failed to get response. Check console.'
    if (error.statusCode === 429) {
      displayMessage = 'Rate limit exceeded. Please try again in a moment.'
    } else if (error.statusMessage) {
      displayMessage = `ERROR: ${error.statusMessage}`
    } else if (error.message) {
      displayMessage = `ERROR: ${error.message}`
    }
    chatMessages.value.push({
      type: 'error',
      content: displayMessage,
      time: formatTime()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (terminalContent.value) {
      terminalContent.value.scrollTop = terminalContent.value.scrollHeight
    }
  }, 100)
}

const onCardHover = (index: number) => {
  hoveredCard.value = index
}

const onCardLeave = () => {
  hoveredCard.value = null
}

const onStatHover = (index: number) => {
  hoveredStat.value = index
}

const onStatLeave = () => {
  hoveredStat.value = null
}

onMounted(() => {
  // Prevent auto-scroll on page load
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0)
  }
  
  // Trigger animations after mount
  setTimeout(() => {
    loaded.value = true
  }, 100)
  
  // Update time every second
  currentTime.value = formatTime()
  setInterval(() => {
    currentTime.value = formatTime()
  }, 1000)

  initializeTerminalLogs()
})

useHead({
  title: '',
  meta: [
    { name: 'description', content: 'Minimal, stable, and built to integrate. Simple APIs for data analysis and automation.' },
    { property: 'og:title', content: 'KikuAI Lab — Autonomous Intelligence' },
    { property: 'og:description', content: 'Minimal, stable, and built to integrate. Simple APIs for data analysis and automation.' },
    { property: 'og:image', content: 'https://kikuai.dev/brand/kikuai-k-mark.svg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://kikuai.dev' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'KikuAI Lab — Autonomous Intelligence' },
    { name: 'twitter:description', content: 'Minimal, stable, and built to integrate. Simple APIs for data analysis and automation.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'KikuAI Lab',
        url: 'https://kikuai.dev',
        logo: 'https://kikuai.dev/brand/kikuai-k-mark.svg',
        sameAs: ['https://github.com/KikuAI-lab']
      })
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'KikuAI Lab',
        url: 'https://kikuai.dev',
        publisher: {
          '@type': 'Organization',
          name: 'KikuAI Lab',
          logo: 'https://kikuai.dev/brand/kikuai-k-mark.svg'
        }
      })
    }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})
</script>

<style scoped>
/* Fonts & Variables */
.homepage {
  --bg-main: #0a0a0a;
  --bg-card: #111111;
  --bg-card-hover: #1a1a1a;
  --text-main: #f8f8f8;
  --text-muted: #a0a0a0;
  --text-dim: #666666;
  --accent: #ededed;
  --accent-glow: rgba(237, 237, 237, 0.15);
  --line: #222222;
  --line-bright: #353535;
  --font-mono: 'JetBrains Mono', monospace;
  --live-color: #00ff88;
  --soon-color: #ffcc00;
  --live-glow: rgba(0, 255, 136, 0.3);
  --soon-glow: rgba(255, 204, 0, 0.2);
  
  background-color: var(--bg-main);
  min-height: 100vh;
  color: var(--text-main);
  font-family: var(--font-mono);
  position: relative;
  overflow-x: hidden;
  scroll-behavior: auto;
}

/* Global Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
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

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes logFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
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
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(2%, -2%) scale(1.05); }
  66% { transform: translate(-2%, 2%) scale(0.95); }
}

/* Layout */
.main-container {
  max-width: 1320px;
  margin: 0 auto;
  padding: 4.5rem 2.75rem;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 9rem);
}

/* Hero */
.hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 7.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
}

.hero-loaded {
  opacity: 1;
  transform: translateY(0);
}

.hero-content {
  flex: 1;
  max-width: 65%;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.08;
  margin-bottom: 2.25rem;
  font-weight: 500;
  letter-spacing: -0.035em;
}

.title-line {
  display: inline-block;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.highlight {
  color: var(--text-main);
  display: inline-block;
  position: relative;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.4s both;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent-glow), transparent);
  opacity: 0.4;
  animation: underlineFadeIn 1s ease 0.6s both;
  pointer-events: none;
  z-index: -1;
}

@keyframes underlineFadeIn {
  from { width: 0; opacity: 0; }
  to { width: 100%; opacity: 0.4; }
}

.prefix {
  color: var(--text-muted);
  margin-right: 0.75rem;
  font-size: 0.9em;
  animation: fadeIn 0.6s ease 0.1s both;
}

.hero-desc {
  color: var(--text-muted);
  line-height: 1.85;
  max-width: 540px;
  font-size: 1.125rem;
  letter-spacing: -0.015em;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
  margin-top: 1.5rem;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  gap: 4rem;
  animation: fadeIn 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.6s both;
}

.stat-box {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--line);
  padding-left: 2rem;
  padding-right: 1.25rem;
  position: relative;
  opacity: 0;
  transform: translateX(-10px);
  animation: fadeInRight 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  cursor: default;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-box:hover {
  border-left-color: var(--line-bright);
  transform: translateX(5px);
  padding-left: 2.25rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.stat-glow {
  position: absolute;
  left: -2px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--accent-glow), transparent);
  opacity: 0;
  transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-dim);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.stat-box:hover .stat-label {
  color: var(--text-muted);
}

.stat-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.035em;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

.stat-box:hover .stat-value {
  transform: scale(1.06);
}

/* Modules Section */
.modules-section {
  flex: 1;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
}

.modules-loaded {
  opacity: 1;
  transform: translateY(0);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1.75rem;
  margin-bottom: 4rem;
}

.section-title {
    font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-main);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--line-bright), transparent);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2.25rem;
  margin-bottom: 6.5rem;
}

/* Cards */
.module-card {
  background-color: var(--bg-card);
  border: 1px solid var(--line);
  padding: 2.75rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 280px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(20px) scale(0.98);
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 2px;
  text-decoration: none;
  color: inherit;
}

.card-loaded {
  animation: cardFadeIn 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.card-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, transparent, var(--accent-glow), transparent);
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: -1;
  filter: blur(24px);
}

.module-card:hover {
  border-color: var(--line-bright);
  transform: translateY(-10px) scale(1.012);
  box-shadow: 
    0 20px 56px rgba(0, 0, 0, 0.65),
    0 0 0 1px var(--line-bright),
    0 0 36px rgba(237, 237, 237, 0.06);
  background-color: var(--bg-card-hover);
}

.module-card:hover .card-glow {
  opacity: 1;
}

.module-card.live:hover {
  border-color: var(--live-color);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px var(--live-color),
    0 0 24px var(--live-glow);
}

.module-card.soon:hover {
  border-color: var(--soon-color);
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px var(--soon-color),
    0 0 24px var(--soon-glow);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.module-id {
  font-size: 0.875rem;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot.live {
  background-color: var(--live-color);
  box-shadow: 0 0 10px var(--live-glow);
}

.status-dot.soon {
  background-color: var(--soon-color);
  box-shadow: 0 0 10px var(--soon-glow);
}

.status-dot.disabled {
  background-color: var(--text-dim);
  box-shadow: none;
}

.status-ring {
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0;
  animation: statusRingPulse 2s infinite;
}

.status-dot.live .status-ring {
  border-color: var(--live-color);
  animation-delay: 0.2s;
}

.status-dot.soon .status-ring {
  border-color: var(--soon-color);
  animation-delay: 0.2s;
}

@keyframes statusRingPulse {
  0% { transform: scale(0.5); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.module-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  letter-spacing: -0.045em;
  color: var(--text-main);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  line-height: 1.25;
}

.module-card:hover .module-name {
  color: var(--text-main);
  transform: translateX(4px);
  letter-spacing: -0.035em;
}

.module-desc {
  font-size: 0.96875rem;
  color: var(--text-muted);
  line-height: 1.75;
  letter-spacing: -0.015em;
  margin-top: 0.875rem;
  font-weight: 400;
}

.card-footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-top: 2rem;
  border-top: 1px solid var(--line);
  transition: border-color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.module-card:hover .card-footer {
  border-top-color: var(--line-bright);
}

.tech-spec {
  border: 1px solid var(--line);
  padding: 4px 10px;
  font-size: 0.75rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
}

.module-card:hover .tech-spec {
  border-color: var(--line-bright);
  color: var(--text-main);
}

.action-arrow {
  opacity: 0;
  transform: translateX(-10px) scale(0.75);
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 1.5rem;
  color: var(--text-main);
  font-weight: 300;
}

.module-card:hover .action-arrow {
  opacity: 1;
  transform: translateX(8px) scale(1);
}

.module-card.disabled {
  opacity: 0.4;
  pointer-events: none;
  border-style: dashed;
  filter: grayscale(0.5);
}

/* Terminal Footer */
.terminal-footer {
  border-top: 1px solid var(--line);
  padding-top: 2rem;
  margin-top: auto;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.6s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
}

.terminal-loaded {
  opacity: 1;
  transform: translateY(0);
}

.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.75rem;
}

.term-title {
  color: var(--text-muted);
  letter-spacing: 0.1em;
  font-weight: 500;
}

.term-status {
  color: var(--live-color);
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-pulse {
  width: 6px;
  height: 6px;
  background: var(--live-color);
  border-radius: 50%;
  animation: statusPulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow: 0 0 10px var(--live-color);
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}

.terminal-content {
  background-color: #000000;
  border: 1px solid var(--line);
  padding: 1rem;
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.6;
  max-height: 300px;
  overflow-y: auto;
  scroll-behavior: auto;
  border-radius: 2px;
}

.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.log-line {
  margin-bottom: 0.375rem;
  opacity: 0;
  transform: translateX(-10px);
  animation: logFadeIn 0.5s ease forwards;
  display: flex;
  align-items: baseline;
}

.log-line.active {
  opacity: 1;
  transform: translateX(0);
}

.log-time {
  color: var(--text-dim);
  margin-right: 0.75rem;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.log-info {
  color: var(--text-muted);
}

.log-success {
  color: var(--live-color);
  text-shadow: 0 0 8px var(--live-glow);
}

.log-warn {
  color: var(--soon-color);
}

.log-error {
  color: #ff4444;
}

.chat-message.user .log-user {
  color: var(--text-main);
}

.chat-message.assistant .log-assistant {
  color: var(--accent);
}

.chat-input-form {
  display: flex;
  flex: 1;
}

.chat-input {
  background: transparent;
  border: none;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  flex: 1;
  padding: 0;
  outline: none;
  margin-left: 0.5rem;
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 3rem;
  }
  
  .hero-content {
    max-width: 100%;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-stats {
    gap: 2rem;
  }
  
  .modules-grid {
    grid-template-columns: 1fr;
  }
  
  .main-container {
    padding: 2rem 1.5rem;
  }
}
</style>
