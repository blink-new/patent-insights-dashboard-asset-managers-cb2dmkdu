export interface ApiConfig {
  baseUrl: string
  bearerToken: string
}

export interface SearchQuery {
  type: 'company' | 'isin' | 'url' | 'theme'
  value: string
  theme?: string
}

export interface ChartData {
  name: string
  value: number
}

export interface PatentData {
  id: string
  title: string
  assignee: string
  publicationDate: string
  applicationDate: string
  patentNumber: string
  abstract: string
  claims: number
  citations: number
  familySize: number
  technology: string[]
}

export interface Insights {
  totalPatents: number
  recentActivity: ChartData[]
  technologyDistribution: ChartData[]
  competitiveAnalysis: ChartData[]
  trendAnalysis: ChartData[]
  // Enhanced insights for asset managers and M&A
  portfolioSimilarity: ChartData[]
  maTargets: ChartData[]
  infringementRisk: ChartData[]
  marketOpportunity: ChartData[]
  patentValuation: ChartData[]
  technologyMaturity: ChartData[]
  geographicDistribution: ChartData[]
  citationImpact: ChartData[]
}

export interface InsightResult {
  query: SearchQuery
  patents: PatentData[]
  insights: Insights
  summary: string
}

export interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  isLoading?: boolean
}