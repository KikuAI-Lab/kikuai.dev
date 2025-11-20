<template>
  <div class="test-login-page">
    <div class="test-login-container">
      <h1>🧪 Test Login</h1>
      <p class="subtitle">Development only - bypasses real authentication</p>
      
      <div class="test-users">
        <h2>Test Users</h2>
        <div
          v-for="user in testUsers"
          :key="user.id"
          class="test-user-card"
          @click="loginAs(user)"
        >
          <div class="user-info">
            <p class="user-name">{{ user.name }}</p>
            <p class="user-email">{{ user.email }}</p>
            <p class="user-plan">{{ user.plan }}</p>
          </div>
          <button class="btn-login">Login as {{ user.name }}</button>
        </div>
      </div>
      
      <div v-if="loading" class="loading">
        <p>Logging in...</p>
      </div>
      
      <div v-if="error" class="error">
        <p>{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false
})

const loading = ref(false)
const error = ref<string | null>(null)

const testUsers = [
  {
    id: 'test-user-1',
    name: 'Test User (Free)',
    email: 'test@kikuai.dev',
    plan: 'Free Plan',
    subscription: null,
    usage: {
      today: 45,
      limit: 100,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    keys: [
      {
        id: 'key-1',
        name: 'Development Key',
        displayKey: 'kiku_test_••••abcd',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        isActive: true
      }
    ],
    invoices: []
  },
  {
    id: 'test-user-2',
    name: 'Test User (Pro)',
    email: 'test-pro@kikuai.dev',
    plan: 'Pro Plan',
    subscription: {
      plan: {
        name: 'Pro Plan',
        description: 'Professional features with higher limits',
        price: 29.99,
        interval: 'month'
      },
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      paddleCustomerId: 'test-customer-123'
    },
    usage: {
      today: 1250,
      limit: 10000,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    keys: [
      {
        id: 'key-2',
        name: 'Production Key',
        displayKey: 'kiku_prod_••••efgh',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        isActive: true
      },
      {
        id: 'key-3',
        name: 'Staging Key',
        displayKey: 'kiku_stage_••••ijkl',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: null,
        isActive: true
      }
    ],
    invoices: [
      {
        id: 'inv-1',
        amount: 29.99,
        currency: 'USD',
        status: 'paid',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        invoiceUrl: 'https://example.com/invoice/1',
        receiptUrl: 'https://example.com/receipt/1'
      }
    ]
  },
  {
    id: 'test-user-3',
    name: 'Test User (High Usage)',
    email: 'test-high@kikuai.dev',
    plan: 'Pro Plan',
    subscription: {
      plan: {
        name: 'Pro Plan',
        description: 'Professional features with higher limits',
        price: 29.99,
        interval: 'month'
      },
      currentPeriodEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      paddleCustomerId: 'test-customer-456'
    },
    usage: {
      today: 9800,
      limit: 10000,
      resetAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    },
    keys: [
      {
        id: 'key-4',
        name: 'High Traffic Key',
        displayKey: 'kiku_high_••••mnop',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        lastUsedAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
        isActive: true
      }
    ],
    invoices: []
  }
]

const loginAs = async (user: any) => {
  loading.value = true
  error.value = null
  
  try {
    // Store test user data in sessionStorage
    sessionStorage.setItem('test-user', JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name
    }))
    
    // Store test dashboard data
    sessionStorage.setItem('test-dashboard-data', JSON.stringify({
      subscription: user.subscription,
      usage: user.usage,
      usageData: generateUsageData(),
      keys: user.keys,
      invoices: user.invoices
    }))
    
    // Navigate to dashboard
    await navigateTo('/dashboard')
  } catch (err: any) {
    error.value = err.message || 'Failed to login'
    console.error('Test login error:', err)
  } finally {
    loading.value = false
  }
}

const generateUsageData = () => {
  const data = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split('T')[0],
      requests: Math.floor(Math.random() * 500) + 100,
      errors: Math.floor(Math.random() * 10)
    })
  }
  return data
}
</script>

<style scoped>
.test-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--bg);
}

.test-login-container {
  max-width: 600px;
  width: 100%;
  background-color: var(--bg-card);
  border-radius: 14px;
  padding: 2rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.04);
}

.test-login-container h1 {
  font-size: 2rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.test-users h2 {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 1rem;
}

.test-user-card {
  background-color: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.test-user-card:hover {
  background-color: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.1);
}

.user-info {
  margin-bottom: 1rem;
}

.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.user-plan {
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
}

.btn-login {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: var(--text);
  color: var(--bg);
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

.btn-login:hover {
  transform: scale(1.02);
}

.loading,
.error {
  text-align: center;
  padding: 1rem;
  color: var(--text-muted);
}

.error {
  color: #ef4444;
}
</style>

