<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Analytics />
  </div>
</template>

<script setup>
import { Analytics } from '@vercel/analytics/vue'
</script>

<style>
@import './app.css';
</style>

