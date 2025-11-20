<template>
  <div class="app">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    
    <header class="header">
      <div class="header-container">
        <NuxtLink to="/" class="logo-link" aria-label="KikuAI Lab homepage">
          <img src="/brand/kikuai-logo-optimized.png" alt="KikuAI" class="brand-logo" width="38" height="38" />
          <span class="logo-text">KIKUAI_LAB</span>
        </NuxtLink>
        <div class="header-links">
          <a 
            href="https://github.com/KikuAI-lab" 
            target="_blank" 
            rel="noopener noreferrer"
            class="header-link"
          >
            <svg class="github-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
            GitHub
          </a>
          <NuxtLink to="/about" class="header-link">About</NuxtLink>
        </div>
      </div>
    </header>
    
    <main>
      <slot />
    </main>

    <footer class="footer">
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
  </div>
</template>

<script setup lang="ts">
useHead({
  titleTemplate: (title) => title ? `${title} | KikuAI Lab` : 'KikuAI Lab',
  meta: [
    { name: 'description', content: 'KikuAI Lab — autonomous AI products built for integration, not attention.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})
</script>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #0a0a0a;
  color: #fafafa;
  font-family: 'JetBrains Mono', monospace;
}

/* Background Effects */
.grid-overlay {
  position: fixed;
  inset: 0;
  background-image: 
    linear-gradient(#222222 1px, transparent 1px),
    linear-gradient(90deg, #222222 1px, transparent 1px);
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

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(10, 10, 10, 0.85);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #222222;
  padding: 1rem 0;
}

.header-container {
  width: 100%;
  max-width: 1320px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
  padding: 0 2.75rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: #fafafa;
  transition: all 0.3s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.brand-logo {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: block;
}

.logo-text {
  font-weight: 500;
  letter-spacing: 0.05em;
  font-size: 0.875rem;
}

.header-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.header-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: #b0b0b0;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  border: 1px solid #222222;
  border-radius: 2px;
  background-color: #111111;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-family: 'JetBrains Mono', monospace;
}

.header-link:hover {
  color: #fafafa;
  border-color: #333333;
  background-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.github-icon {
  width: 16px;
  height: 16px;
}

main {
  flex: 1;
  width: 100%;
  position: relative;
  z-index: 2;
}

/* Footer */
.footer {
  border-top: 1px solid #222222;
  padding: 2rem 0;
  margin-top: auto;
  background-color: rgba(10, 10, 10, 0.5);
}

.footer-content {
  max-width: 1320px;
  margin: 0 auto;
  padding: 0 2.75rem;
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
  color: #b0b0b0;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.05em;
}

.footer-meta {
  color: #707070;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8125rem;
  color: #b0b0b0;
}

.footer-link {
  color: #b0b0b0;
  text-decoration: none;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.01em;
}

.footer-link:hover {
  color: #fafafa;
}

.footer-separator {
  color: #707070;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 1.5rem;
  }
  
  .footer-content {
    padding: 0 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-links {
    gap: 1rem;
  }
  
  .logo-text {
    font-size: 0.8125rem;
  }
}
</style>
