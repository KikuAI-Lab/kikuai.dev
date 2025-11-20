export interface ProductLinks {
  docs: string | null
  github: string | null
  rapidapi: string | null
  demo: string | null
  download?: string | null
}

export interface ProductMetrics {
  p95ms_rules?: number
  p95ms_llm?: number
  fpr?: string
}

export interface ProductOG {
  title: string
  image: string
}

export interface Product {
  slug: string
  name: string
  alternateName: string
  oneLiner: string
  status: 'live' | 'beta' | 'wip' | 'soon'
  hasApi: boolean
  version: string
  license?: string
  metrics?: ProductMetrics
  links: ProductLinks
  og: ProductOG
  releaseLabel?: string
}
