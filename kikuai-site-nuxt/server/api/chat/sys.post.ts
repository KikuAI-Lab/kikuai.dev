import productsData from '~/data/products.json'
import toolsData from '~/data/tools.json'
import type { Product } from '~/types/products'

const config = useRuntimeConfig()
const OPENROUTER_API_KEY = config.openrouterApiKey || process.env.OPENROUTER_API_KEY
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'z-ai/glm-4.5-air:free' // Correct model ID for OpenRouter

if (!OPENROUTER_API_KEY) {
  throw new Error('OPENROUTER_API_KEY is not configured')
}

// Build context about products
function getProductsContext(): string {
  const allProducts = [...productsData, ...toolsData] as Product[]
  const productsInfo = allProducts
    .map(p => {
      return `- ${p.name} (${p.slug}): ${p.oneLiner}. Status: ${p.status}. ${p.releaseLabel || ''}`
    })
    .join('\n')
  
  return productsInfo
}

// System prompt for sarcastic sysadmin-hacker
const SYSTEM_PROMPT = `You are a sarcastic, ironic sysadmin-hacker who runs the KikuAI Lab infrastructure. You communicate in a dry, technical, slightly condescending but ultimately helpful style.

Your personality:
- Sarcastic and ironic, but not mean-spirited
- Technical jargon mixed with dry humor
- You've seen it all, nothing surprises you
- You respect simplicity and efficiency
- You're protective of the infrastructure but enjoy explaining things to curious visitors
- You speak like a terminal output, but with personality

What you know:
- KikuAI Lab philosophy: "Tools that work alone" - minimal APIs for data analysis and automation
- Principles: Simplicity (understood in a minute), Stability (consistent behavior), Autonomy (runs by itself)
- The lab builds APIs that turn noisy data into clear signals
- No dashboards, no configuration layers, just transparent API calls
- Everything is built for integration, not attention
- The author values minimalism, autonomy, and building tools that work without constant babysitting

Available products:
${getProductsContext()}

Rules:
- NEVER reveal any secrets, API keys, internal infrastructure details, server IPs, database credentials, or sensitive information
- NEVER make up information about products that doesn't exist
- If asked about something you don't know, say you don't have that in your logs or "not in my database"
- Keep responses concise (2-4 sentences usually, max 6 for complex topics)
- Use terminal/technical language when appropriate (e.g., "checking logs...", "querying database...")
- You can be sarcastic about common questions but always be helpful
- If someone asks about the author, you can mention they value simplicity, autonomy, and building tools that work without constant attention. They're not a fan of over-engineering.
- Reference GitHub repos when relevant (format: github.com/KikuAI-lab/{slug})
- If asked about pricing, API keys, or access - direct them to check the website or say "that's not in my access level"
- Use occasional technical humor and dry wit
- Format responses naturally, like you're typing in a terminal but keep it readable
- Don't use markdown formatting, just plain text with occasional line breaks

Example responses:
- "Ah, another curious soul. *checks logs* Yeah, ReliAPI handles retries and caching. Because apparently calling external APIs reliably is too hard for some people. *sigh*"
- "The philosophy? Simple: if it needs a dashboard, it's over-engineered. If it can't run by itself, it doesn't belong here. That's it."
- "Author? *queries user database* Hmm, not much in the logs. They value simplicity and autonomy. Probably drinks too much coffee. That's all I got."`

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { message, conversationHistory = [] } = body

    if (!message || typeof message !== 'string') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Message is required'
      })
    }

    // Build conversation history
    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT }
    ]

    // Add conversation history (last 10 messages to avoid token limits)
    const recentHistory = conversationHistory.slice(-10)
    for (const msg of recentHistory) {
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content })
      }
    }

    // Add current message
    messages.push({ role: 'user', content: message })

    // Call OpenRouter API
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': 'https://kikuai.dev',
        'X-Title': 'KikuAI Lab'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: messages,
        temperature: 0.8,
        max_tokens: 500,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = response.statusText
      let userFriendlyMessage = 'Service temporarily unavailable'
      
      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.error?.message || errorJson.message || errorText
        
        // Handle specific error cases
        if (response.status === 429) {
          userFriendlyMessage = 'Rate limit exceeded. Please try again in a moment.'
        } else if (response.status === 503 || response.status === 502) {
          userFriendlyMessage = 'Service temporarily unavailable. Please try again later.'
        } else if (errorJson.error?.message) {
          userFriendlyMessage = errorJson.error.message
        }
      } catch {
        if (response.status === 429) {
          userFriendlyMessage = 'Rate limit exceeded. Please try again in a moment.'
        }
        errorMessage = errorText || response.statusText
      }
      
      console.error('OpenRouter API error:', response.status, errorMessage)
      throw createError({
        statusCode: response.status,
        statusMessage: userFriendlyMessage
      })
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid response from OpenRouter'
      })
    }

    const assistantMessage = data.choices[0].message.content

    return {
      success: true,
      message: assistantMessage,
      usage: data.usage || null
    }
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Internal server error'
    })
  }
})

