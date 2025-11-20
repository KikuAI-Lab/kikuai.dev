export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  
  // Realistic mock responses per product
  const mockResponses: Record<string, any> = {
    kaida: {
      success: true,
      patterns: ['pattern_abc123', 'pattern_xyz789'],
      insights: { total: 150, confidence: 0.92 }
    },
    datafold: {
      success: true,
      comparison: { drift: 0.03, structural_changes: 2 },
      validation: { passed: true, warnings: 1 }
    },
    fynx: {
      success: true,
      clusters: ['cluster_1', 'cluster_2'],
      quality_score: 0.87
    },
    routellm: {
      success: true,
      model: 'gpt-4o-mini',
      cost: 0.00015,
      latency: 320,
      verified: true
    },
    tas: {
      success: true,
      isSpam: false,
      confidence: 0.95,
      reason: 'Passed all rule checks',
      pipeline: ['rules', 'ml', 'llm']
    },
    patas: {
      success: true,
      patterns: ['pattern_abc123', 'pattern_xyz789'],
      sqlRules: ['UPDATE messages SET is_spam = 1 WHERE pattern_id IN (1, 2)'],
      trainingData: { rules: 5, ml: 120, llm: 8 }
    },
    reliapi: {
      success: true,
      endpoint: 'https://api.example.com/data',
      attempts: 1,
      latency: 45,
      status: 'success'
    },
    routex: {
      success: true,
      model: 'gpt-4o-mini',
      cost: 0.00015,
      latency: 320,
      verified: true
    },
    momentumai: {
      success: true,
      signal: 'pre_move_detected',
      confidence: 0.82,
      pattern: 'volume_spike'
    },
    insightsocial: {
      success: true,
      signal: 'insider_activity',
      confidence: 0.78,
      prefilter: 'passed'
    }
  }
  
  const response = mockResponses[slug || ''] || {
    success: false,
    error: 'Product not found'
  }
  
  setHeader(event, 'Content-Type', 'application/json')
  setHeader(event, 'Access-Control-Allow-Origin', '*')
  setHeader(event, 'Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  
  return response
})
