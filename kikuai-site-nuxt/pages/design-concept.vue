<template>
  <div class="design-concept">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    <div class="ambient-glow"></div>
    
    <main class="main-container">
      <!-- Industrial Header -->
      <header class="header" :class="{ 'header-loaded': loaded }">
        <div class="brand">
          <div class="brand-mark">
            <img src="/brand/kikuai-logo-optimized.png" alt="KikuAI" class="brand-logo" width="38" height="38" />
            <span class="brand-text">KIKUAI_LAB</span>
          </div>
          <span class="sys-status">
            <span class="status-pulse"></span>
            SYS.ONLINE
          </span>
        </div>
        <div class="header-links">
          <a 
            href="https://github.com/KikuAI-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            class="header-link"
          >
            <svg class="header-link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub
          </a>
          <NuxtLink to="/about" class="header-link">
            About
          </NuxtLink>
        </div>
      </header>

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
            <div class="stat-glow"></div>
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
            v-for="(module, index) in modules" 
            :key="module.id"
            :to="`/products/${module.slug}`"
            class="module-card" 
            :class="[module.status, { 'card-loaded': loaded }]"
            :style="{ animationDelay: `${0.2 + index * 0.1}s` }"
            @mouseenter="() => onCardHover(index)"
            @mouseleave="onCardLeave"
          >
            <div class="card-glow"></div>
            <div class="card-header">
              <span class="module-id">{{ module.id }}</span>
              <span class="status-dot" :class="module.status">
                <span class="status-ring"></span>
              </span>
            </div>
            <div class="card-body">
              <h3 class="module-name">{{ module.name }}</h3>
              <p class="module-desc">{{ module.desc }}</p>
            </div>
            <div class="card-footer">
              <span class="tech-spec">{{ module.tech }}</span>
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
            <span class="log-cursor">_</span>
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

      <!-- Site Footer -->
      <footer class="site-footer" :class="{ 'footer-loaded': loaded }">
        <div class="footer-content">
          <div class="footer-main">
            <span class="footer-tagline">© 2025 KIKUAI_LAB</span>
          </div>
          <div class="footer-links">
            <NuxtLink to="/legal/privacy" class="footer-link">Privacy</NuxtLink>
            <span class="footer-separator">·</span>
            <NuxtLink to="/legal/terms" class="footer-link">Terms</NuxtLink>
          </div>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Design Concept | KikuAI Lab',
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})

const loaded = ref(false)
const currentTime = ref('14:02:36')
const hoveredCard = ref<number | null>(null)
const hoveredStat = ref<number | null>(null)
const userInput = ref('')
const chatMessages = ref<Array<{ type: string; content: string; time: string }>>([])
const conversationHistory = ref<Array<{ role: string; content: string }>>([])
const isLoading = ref(false)
const terminalContent = ref<HTMLElement | null>(null)
const chatInput = ref<HTMLInputElement | null>(null)

const stats = [
  { label: 'MODULES', value: '04' },
  { label: 'UPTIME', value: '99.9%' }
]

// Map module names to product slugs
const moduleSlugMap: Record<string, string> = {
  'ReliAPI': 'reliapi',
  'RouteLLM': 'routellm',
  'KAIDA': 'kaida'
}

const modules = [
  {
    id: 'MOD_01',
    name: 'ReliAPI',
    desc: 'Intelligent retry & caching layer for unreliable endpoints.',
    tech: 'HTTP/REST',
    status: 'live',
    slug: 'reliapi'
  },
  {
    id: 'MOD_02',
    name: 'RouteLLM',
    desc: 'Stable routing and fallback for LLM providers.',
    tech: 'GATEWAY',
    status: 'soon',
    release: 'NOV 2025',
    slug: 'routellm'
  },
  {
    id: 'MOD_03',
    name: 'KAIDA',
    desc: 'Core analysis engine for large-scale pattern detection.',
    tech: 'CORE',
    status: 'disabled',
    release: '2026',
    slug: 'kaida'
  }
]

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
  
  return [
    { 
      time: new Date(baseTime - 3000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'INIT_SEQUENCE_STARTED', 
      type: 'info' 
    },
    { 
      time: new Date(baseTime - 2000).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }), 
      message: 'MODULES_LOADED [4/4]', 
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

const terminalLogs = ref<Array<{ time: string; message: string; type: string }>>(initializeTerminalLogs())

const sendMessage = async (e?: Event) => {
  if (e) {
    e.preventDefault()
    e.stopPropagation()
  }
  
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
    const response = await $fetch<{ success: boolean; message?: string; usage?: any }>('/api/chat/sys', {
      method: 'POST',
      body: {
        message: message,
        conversationHistory: conversationHistory.value
      }
    })

    if (response.success && response.message) {
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
    const errorMessage = error.data?.message || error.message || 'Failed to get response. Please try again.'
    chatMessages.value.push({
      type: 'error',
      content: `ERROR: ${errorMessage}`,
      time: formatTime()
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
    // Don't auto-focus - let user decide when to interact
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
  setInterval(() => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
  }, 1000)

  // Don't auto-focus - let user decide when to interact
})
</script>

<style scoped>
/* Fonts & Variables */
.design-concept {
  --bg-main: #0a0a0a;
  --bg-card: #111111;
  --bg-card-hover: #1a1a1a;
  --text-main: #fafafa;
  --text-muted: #b0b0b0;
  --text-dim: #707070;
  --accent: #ededed;
  --accent-glow: rgba(237, 237, 237, 0.12);
  --line: #222222;
  --line-bright: #353535;
  --font-mono: 'JetBrains Mono', monospace;
  --live-color: #00ff88;
  --soon-color: #ffcc00;
  --live-glow: rgba(0, 255, 136, 0.25);
  --soon-glow: rgba(255, 204, 0, 0.18);
  
  background-color: var(--bg-main);
  min-height: 100vh;
  color: var(--text-main);
  font-family: var(--font-mono);
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
  100% { transform: translateY(4px); }
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

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--line);
  padding-bottom: 1.75rem;
  margin-bottom: 5.5rem;
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1), transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-loaded {
  opacity: 1;
  transform: translateY(0);
}

.brand {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.brand-mark {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.brand-square {
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, var(--accent) 0%, rgba(237, 237, 237, 0.7) 100%);
  box-shadow: 0 0 10px var(--accent-glow);
  animation: squarePulse 4s ease-in-out infinite;
}

@keyframes squarePulse {
  0%, 100% { box-shadow: 0 0 10px var(--accent-glow); }
  50% { box-shadow: 0 0 18px var(--accent-glow), 0 0 28px rgba(237, 237, 237, 0.08); }
}

.brand-text {
  font-weight: 700;
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  color: var(--text-main);
}

.sys-status {
  font-size: 0.75rem;
  color: var(--live-color);
  border: 1px solid var(--live-color);
  padding: 5px 10px;
  position: relative;
  display: flex;
  align-items: center;
  gap: 7px;
  box-shadow: 0 0 10px var(--live-glow);
  transition: all 0.3s ease;
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

.brand-logo {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: block;
}

.header-links {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.header-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: 1px solid var(--line);
  border-radius: 2px;
  background-color: var(--bg-card);
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: var(--font-mono);
}

.header-link:hover {
  color: var(--text-main);
  border-color: var(--line-bright);
  background-color: var(--bg-card-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.header-link-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
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

.hero-desc {
  color: var(--text-muted);
  line-height: 1.9;
  max-width: 560px;
  font-size: 1.125rem;
  letter-spacing: -0.015em;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.5s both;
  margin-top: 1.75rem;
  font-weight: 400;
}

.hero-stats {
  display: flex;
  gap: 4rem;
  align-items: flex-end;
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

.stat-box:hover .stat-glow {
  opacity: 1;
}

@keyframes fadeInRight {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-weight: 500;
  transition: color 0.3s ease;
}

.stat-box:hover .stat-label {
  color: var(--text-main);
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
  color: var(--text-main);
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
  font-size: 0.875rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
}

.section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--line) 0%, var(--line-bright) 50%, var(--line) 100%);
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
  font-size: 0.75rem;
  color: var(--text-dim);
  letter-spacing: 0.1em;
  font-weight: 500;
}

.status-dot {
  width: 10px;
  height: 10px;
  background-color: var(--line);
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.status-dot.live {
  background-color: var(--live-color);
  box-shadow: 0 0 12px var(--live-glow);
}

.status-dot.soon {
  background-color: var(--soon-color);
  box-shadow: 0 0 12px var(--soon-glow);
}

.status-ring {
  position: absolute;
  inset: -4px;
  border: 1px solid;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.status-dot.live .status-ring {
  border-color: var(--live-color);
  animation: ringPulse 2s ease-in-out infinite;
}

.status-dot.soon .status-ring {
  border-color: var(--soon-color);
  animation: ringPulse 2s ease-in-out infinite 0.5s;
}

@keyframes ringPulse {
  0% {
    opacity: 0.8;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.8);
  }
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
  line-height: 1.8;
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
/* Site Footer */
.site-footer {
  border-top: 1px solid var(--line);
  padding: 2rem 0;
  margin-top: 3rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.7s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.7s;
}

.footer-loaded {
  opacity: 1;
  transform: translateY(0);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.footer-main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.footer-tagline {
  color: var(--text-muted);
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.footer-meta {
  color: var(--text-dim);
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.footer-link {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.footer-link:hover {
  color: var(--text-main);
}

.footer-separator {
  color: var(--text-dim);
  opacity: 0.5;
}

.terminal-footer {
  border-top: 1px solid var(--line);
  padding-top: 2rem;
  margin-top: 2rem;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.8s, transform 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.8s;
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
  gap: 6px;
  font-weight: 500;
}

.terminal-content {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
  line-height: 1.85;
  letter-spacing: -0.01em;
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
}

.terminal-content::-webkit-scrollbar {
  width: 4px;
}

.terminal-content::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-content::-webkit-scrollbar-thumb {
  background: var(--line);
  border-radius: 2px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: var(--line-bright);
}

.log-line {
  margin-bottom: 0.375rem;
  opacity: 0;
  transform: translateX(-10px);
  animation: logFadeIn 0.5s ease forwards;
}

@keyframes logFadeIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.log-time {
  color: var(--text-dim);
  margin-right: 0.75rem;
  font-variant-numeric: tabular-nums;
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

.log-cursor {
  animation: blink 1.2s step-end infinite;
  color: var(--live-color);
  font-weight: 700;
}

.log-line.active {
  opacity: 1;
}

.log-line.chat-message {
  opacity: 1;
  animation: none;
  margin-bottom: 0.75rem;
}

.log-user {
  color: var(--text-main);
}

.log-assistant {
  color: var(--text-muted);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.log-error {
  color: #ff4444;
}

.chat-input-form {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: 0.5rem;
}

.chat-input {
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-main);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: -0.01em;
  padding: 0;
  margin: 0;
  width: 300px;
  max-width: calc(100vw - 200px);
  caret-color: var(--live-color);
}

.chat-input::placeholder {
  color: var(--text-dim);
  opacity: 0.5;
}

.chat-input:focus {
  outline: none;
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