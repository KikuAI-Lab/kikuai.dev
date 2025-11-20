<template>
  <div class="demo-container">
    <div class="demo-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="['demo-tab', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
        :aria-selected="activeTab === tab.id"
        role="tab"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="demo-content" role="tabpanel">
      <div class="demo-code-wrapper">
        <pre class="demo-code"><code>{{ currentCode }}</code></pre>
        <button
          class="copy-button"
          @click="copyCode"
          :aria-label="`Copy ${activeTab} code`"
          aria-live="polite"
        >
          <svg class="copy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span v-if="copied" aria-live="polite">Copied!</span>
          <span v-else>Copy</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  productSlug: string
  endpoint: string
}

const props = defineProps<Props>()

const activeTab = ref('curl')
const copied = ref(false)

const baseUrl = 'https://kikuai.dev'
const apiUrl = `${baseUrl}/api/demo/${props.productSlug}`

const tabs = [
  { id: 'curl', label: 'cURL' },
  { id: 'js', label: 'JavaScript' },
  { id: 'python', label: 'Python' }
]

const codeSnippets = {
  curl: `curl -X POST ${apiUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"input": "your data here"}'`,
  js: `const response = await fetch('${apiUrl}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'your data here' })
})
const data = await response.json()`,
  python: `import requests

response = requests.post(
    '${apiUrl}',
    json={'input': 'your data here'}
)
data = response.json()`
}

const currentCode = computed(() => codeSnippets[activeTab.value as keyof typeof codeSnippets])

const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(currentCode.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
.demo-container {
  margin-top: 2rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
}

.demo-tabs {
  display: flex;
  background-color: var(--bg-darker);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.demo-tab {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease-in-out;
  border-bottom: 2px solid transparent;
}

.demo-tab:hover {
  color: var(--text);
  background-color: rgba(255, 255, 255, 0.02);
}

.demo-tab.active {
  color: var(--text);
  border-bottom-color: var(--accent);
}

.demo-content {
  background-color: var(--bg-darker);
  padding: 1.5rem;
}

.demo-code-wrapper {
  position: relative;
}

.demo-code {
  margin: 0;
  padding: 1rem;
  background-color: #0a0b0d;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text);
}

.demo-code code {
  display: block;
  white-space: pre;
}

.copy-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: var(--text);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.copy-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.copy-icon {
  width: 14px;
  height: 14px;
}
</style>

