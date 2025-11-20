<template>
  <main aria-label="About page" class="about-page">
    <div class="grid-overlay"></div>
    <div class="scanline"></div>
    <div class="ambient-glow"></div>
    
    <section class="about-content" :class="{ 'content-loaded': loaded }">
      <div class="about-image-container">
        <div class="about-image-wrapper">
          <img src="/about.png" alt="KikuAI Lab" class="about-image" />
          <div class="about-image-gradient"></div>
        </div>
      </div>

      <h1 class="about-heading">
        <span class="prefix">>></span>
        ABOUT
      </h1>

      <div class="about-text">
        <p>KikuAI Lab builds APIs that turn noisy data into clear, actionable signals.</p>

        <div class="about-section-divider"></div>

        <p>Our tools process unstructured information, analyze it with lightweight AI modules, and return clean, structured outputs that can be used directly in products, automation pipelines, and analytics systems.</p>

        <p>Each tool solves one task and works fully autonomously.</p>

        <p>Minimal inputs, predictable behavior, stable performance.</p>

        <p>No dashboards, no configuration layers, no unnecessary complexity — just transparent API calls.</p>

        <div class="about-section-divider"></div>

        <h2 class="about-section-title">
          <span class="section-prefix">>></span>
          PRINCIPLES
        </h2>

        <ul class="about-principles">
          <li><strong>Simplicity</strong> — a tool should be understood in a minute</li>
          <li><strong>Stability</strong> — consistent behavior under any load</li>
          <li><strong>Autonomy</strong> — if it cannot run by itself, it doesn't belong here</li>
        </ul>

        <div class="about-section-divider"></div>

        <p>Our APIs help remove noise, reduce manual work, and free developers from repetitive tasks.</p>

        <p>Everything else is just overhead.</p>
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
  title: 'About',
  meta: [
    { name: 'description', content: 'KikuAI Lab builds APIs that turn noisy data into clear, actionable signals. Our tools process unstructured information and return clean, structured outputs.' },
    { property: 'og:title', content: 'About | KikuAI Lab' },
    { property: 'og:description', content: 'KikuAI Lab builds APIs that turn noisy data into clear, actionable signals. Our tools process unstructured information and return clean, structured outputs.' },
    { property: 'og:image', content: 'https://kikuai.dev/about.png' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://kikuai.dev/about' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'About | KikuAI Lab' },
    { name: 'twitter:description', content: 'KikuAI Lab builds APIs that turn noisy data into clear, actionable signals. Our tools process unstructured information and return clean, structured outputs.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap' }
  ]
})
</script>

<style scoped>
.about-page {
  --bg-main: #0a0a0a;
  --text-main: #fafafa;
  --text-muted: #b0b0b0;
  --text-dim: #707070;
  --line: #222222;
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

.about-content {
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

.about-image-container {
  margin-bottom: 4rem;
  display: flex;
  justify-content: center;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.2s both;
  position: relative;
  padding: 2rem;
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

.about-image-wrapper {
  position: relative;
  max-width: 70%;
  width: 70%;
  border-radius: 2px;
  overflow: hidden;
}

.about-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 2px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.about-image-gradient {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: 
    linear-gradient(to top, var(--bg-main) 0%, transparent 15%),
    linear-gradient(to bottom, var(--bg-main) 0%, transparent 15%),
    linear-gradient(to left, var(--bg-main) 0%, transparent 12%),
    linear-gradient(to right, var(--bg-main) 0%, transparent 12%);
  border-radius: 2px;
}

.about-heading {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 500;
  color: var(--text-main);
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;
  opacity: 0;
  animation: fadeInUp 0.9s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both;
}

.prefix {
  color: var(--text-muted);
  font-size: 0.9em;
}

.about-text {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-text p {
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.85;
  color: var(--text-muted);
  margin: 0;
  text-align: left;
  letter-spacing: -0.015em;
}

.about-section-divider {
  height: 1px;
  background: linear-gradient(to right, transparent, var(--line), transparent);
  margin: 1rem 0;
}

.about-section-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text-main);
  margin: 1rem 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.02em;
}

.section-prefix {
  color: var(--text-muted);
  font-size: 0.9em;
}

.about-principles {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.about-principles li {
  font-size: 1.125rem;
  line-height: 1.85;
  color: var(--text-muted);
  padding-left: 0;
  font-weight: 400;
  letter-spacing: -0.015em;
}

.about-principles li strong {
  color: var(--text-main);
  font-weight: 500;
}

@media (min-width: 640px) {
  .about-text p {
    font-size: 1.25rem;
  }

  .about-principles li {
    font-size: 1.25rem;
  }

  .about-section-title {
    font-size: 1.375rem;
  }
}

@media (max-width: 768px) {
  .about-content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  .about-image {
    max-width: 90%;
    width: 90%;
  }
}
</style>
