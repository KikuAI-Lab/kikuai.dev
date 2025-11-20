<template>
  <div class="debug-page">
    <h1>Debug Token Generator</h1>
    <div class="error">
      <p>Supabase authentication has been removed from this project.</p>
      <p>This debug page is no longer available.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false
})
</script>

<style scoped>
.debug-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #111315;
  color: #EDEDED;
}

.error {
  color: #ef4444;
  padding: 1rem;
  background-color: rgba(239, 68, 68, 0.1);
  border-radius: 4px;
}
</style>
