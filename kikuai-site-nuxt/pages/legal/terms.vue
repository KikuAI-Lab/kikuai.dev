<template>
  <main aria-label="Terms of Service" class="legal-page">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    <div class="ambient-glow"></div>
    
    <section class="legal-content" :class="{ 'content-loaded': loaded }">
      <h1 class="legal-heading">
        <span class="prefix">>></span>
        TERMS_OF_SERVICE
      </h1>
      <p class="legal-updated">Last updated: November 13, 2025</p>

      <div class="legal-text">
        <details class="legal-section" open>
          <summary>1. Acceptance of Terms</summary>
          <div class="legal-section-content">
            <p>By accessing or using this website or any related services, you agree to these Terms of Service. If you do not agree, do not use the site.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>2. Content Provided "As Is"</summary>
          <div class="legal-section-content">
            <p>All content, APIs, documentation, and materials on this website are provided "as is" without any warranties, express or implied.</p>
            <p>KikuAI Lab makes no representations regarding accuracy, completeness, reliability, or availability.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>3. No Warranties</summary>
          <div class="legal-section-content">
            <p>To the fullest extent permitted by law, KikuAI Lab disclaims all warranties, including but not limited to:</p>
            <ul class="legal-list">
              <li>implied warranties of merchantability</li>
              <li>fitness for a particular purpose</li>
              <li>non-infringement</li>
            </ul>
            <p>We do not warrant that the website or APIs will be uninterrupted, error-free, or secure.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>4. Limitation of Liability</summary>
          <div class="legal-section-content">
            <p>KikuAI Lab shall not be liable for any direct, indirect, incidental, consequential, or special damages arising from the use of the website or services, including but not limited to:</p>
            <ul class="legal-list">
              <li>loss of data</li>
              <li>downtime</li>
              <li>lost profits or business interruption</li>
              <li>system errors or latency</li>
            </ul>
            <p>You use this site and its services at your own risk.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>5. External Links</summary>
          <div class="legal-section-content">
            <p>This website may include links to third-party websites or services.</p>
            <p>KikuAI Lab is not responsible for the content, availability, privacy practices, or terms of any external sites. Access to external links is at your own discretion.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>6. API Usage and Abuse</summary>
          <div class="legal-section-content">
            <p>Use of our APIs is subject to rate limits, automated abuse protection, and traffic monitoring.</p>
            <p>We may throttle, restrict, or terminate access to prevent system overload, malicious usage, or violations of our policies.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>7. Modifications</summary>
          <div class="legal-section-content">
            <p>KikuAI Lab may update these Terms at any time. Continued use of the website constitutes acceptance of the updated Terms.</p>
          </div>
        </details>

        <details class="legal-section">
          <summary>8. Contact</summary>
          <div class="legal-section-content">
            <p>For any questions regarding these Terms, contact: <a href="mailto:admin@kikuai.dev" class="legal-link">admin@kikuai.dev</a></p>
          </div>
        </details>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loaded = ref(false)

onMounted(() => {
  loaded.value = true
})

useHead({
  title: 'Terms of Service',
  meta: [
    { name: 'description', content: 'Terms of Service for KikuAI Lab. Last updated: November 13, 2025.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})
</script>

<style scoped>
.legal-page {
  --bg-main: #0a0a0a;
  --bg-card: #111111;
  --text-main: #fafafa;
  --text-muted: #b0b0b0;
  --text-dim: #707070;
  --line: #222222;
  --line-bright: #333333;
  --accent-glow: rgba(237, 237, 237, 0.15);
  --font-mono: 'JetBrains Mono', monospace;
  
  background-color: var(--bg-main);
  padding-top: 4rem;
  padding-bottom: 6rem;
  min-height: 100vh;
  position: relative;
  font-family: var(--font-mono);
  color: var(--text-main);
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

.legal-content {
  max-width: 720px;
  width: 100%;
  margin: 0 auto;
  padding-left: 2.75rem;
  padding-right: 2.75rem;
  text-align: left;
  position: relative;
  z-index: 2;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1), transform 0.9s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-loaded {
  opacity: 1;
  transform: translateY(0);
}

.legal-heading {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;
}

.prefix {
  color: var(--text-muted);
  font-size: 0.9em;
}

.legal-updated {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 3rem;
  font-weight: 400;
  letter-spacing: -0.01em;
}

.legal-text {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.legal-section {
  border: 1px solid var(--line);
  border-radius: 2px;
  padding: 0;
  background-color: var(--bg-card);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.legal-section:hover {
  border-color: var(--line-bright);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.legal-section summary {
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--text-main);
  padding: 1.5rem 2rem;
  cursor: pointer;
  list-style: none;
  user-select: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: -0.02em;
}

.legal-section summary:hover {
  color: var(--text-main);
}

.legal-section summary::-webkit-details-marker {
  display: none;
}

.legal-section summary::before {
  content: '▶';
  display: inline-block;
  font-size: 0.75rem;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--text-muted);
  flex-shrink: 0;
}

.legal-section[open] summary::before {
  transform: rotate(90deg);
}

.legal-section-content {
  padding: 0 2rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legal-text p {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.85;
  color: var(--text-muted);
  margin: 0;
  text-align: left;
  letter-spacing: -0.015em;
}

.legal-list {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-left: 1.5rem;
}

.legal-list li {
  font-size: 1rem;
  line-height: 1.85;
  color: var(--text-muted);
  position: relative;
  letter-spacing: -0.015em;
}

.legal-list li::before {
  content: '•';
  position: absolute;
  left: -1.5rem;
  color: var(--text-muted);
}

.legal-link {
  color: var(--text-main);
  text-decoration: none;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid var(--text-muted);
}

.legal-link:hover {
  opacity: 0.8;
  border-bottom-color: var(--text-main);
}

@media (min-width: 640px) {
  .legal-text p {
    font-size: 1.125rem;
  }

  .legal-list li {
    font-size: 1.125rem;
  }
}

@media (max-width: 768px) {
  .legal-content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .legal-section summary {
    padding: 1.25rem 1.5rem;
    font-size: 1rem;
  }
  
  .legal-section-content {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }
}
</style>
