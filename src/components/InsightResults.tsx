import { InsightResult } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PatentChart } from './PatentChart'
import { 
  TrendingUp, 
  FileText, 
  Users, 
  Calendar, 
  Target, 
  Shield, 
  DollarSign, 
  Globe, 
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Building2
} from 'lucide-react'

interface InsightResultsProps {
  result: InsightResult
}

export function InsightResults({ result }: InsightResultsProps) {
  const { query, patents, insights, summary } = result

  return (
    <div className="space-y-6">
      {/* Query Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Search Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline">{query.type.toUpperCase()}</Badge>
            <span className="font-medium">{query.value}</span>
            {query.theme && (
              <>
                <span className="text-muted-foreground">•</span>
                <Badge variant="secondary">{query.theme}</Badge>
              </>
            )}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {summary}
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium">Total Patents</span>
            </div>
            <div className="text-xl font-bold mt-1">{insights.totalPatents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">Recent Activity</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {insights.recentActivity.reduce((sum, item) => sum + item.value, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium">Competitors</span>
            </div>
            <div className="text-xl font-bold mt-1">{insights.competitiveAnalysis.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium">M&A Targets</span>
            </div>
            <div className="text-xl font-bold mt-1">{insights.maTargets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium">Risk Level</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {insights.infringementRisk.find(r => r.name === 'High Risk')?.value || 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-xs font-medium">High Value</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {insights.patentValuation.find(v => v.name.includes('High Value'))?.value || 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Analytics Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="competitive">Competitive</TabsTrigger>
          <TabsTrigger value="ma-analysis">M&A Analysis</TabsTrigger>
          <TabsTrigger value="risk-valuation">Risk & Valuation</TabsTrigger>
          <TabsTrigger value="market-intel">Market Intel</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatentChart
              title="Patent Activity Timeline"
              data={insights.recentActivity}
              type="line"
              description="Monthly patent applications and grants"
              icon={<Calendar className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Technology Distribution"
              data={insights.technologyDistribution}
              type="pie"
              description="Patent portfolio by technology area"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Innovation Trend Analysis"
              data={insights.trendAnalysis}
              type="line"
              description="5-year innovation growth patterns"
              icon={<TrendingUp className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Geographic Distribution"
              data={insights.geographicDistribution}
              type="bar"
              description="Patent filings by jurisdiction"
              icon={<Globe className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        {/* Competitive Analysis Tab */}
        <TabsContent value="competitive" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatentChart
              title="Competitive Landscape"
              data={insights.competitiveAnalysis}
              type="bar"
              description="Patent count by major competitors"
              icon={<Users className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Portfolio Similarity Analysis"
              data={insights.portfolioSimilarity}
              type="radar"
              description="Technology overlap with competitors"
              icon={<Target className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Citation Impact Analysis"
              data={insights.citationImpact}
              type="pie"
              description="Patent influence and quality metrics"
              icon={<Lightbulb className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Technology Maturity Lifecycle"
              data={insights.technologyMaturity}
              type="bar"
              description="Innovation stage distribution"
              icon={<BarChart3 className="h-4 w-4" />}
            />
          </div>
        </TabsContent>

        {/* M&A Analysis Tab */}
        <TabsContent value="ma-analysis" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatentChart
              title="M&A Target Analysis"
              data={insights.maTargets}
              type="bar"
              description="Acquisition synergy potential"
              icon={<Building2 className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Market Opportunity Analysis"
              data={insights.marketOpportunity}
              type="radar"
              description="Untapped market potential"
              icon={<Target className="h-4 w-4" />}
            />
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Strategic M&A Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {insights.maTargets.find(t => t.name === 'High Synergy')?.value || 0}%
                    </div>
                    <div className="text-sm text-blue-700">High Synergy Targets</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {insights.marketOpportunity.find(o => o.name === 'Untapped Markets')?.value || 0}%
                    </div>
                    <div className="text-sm text-green-700">Market Opportunity</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {insights.portfolioSimilarity.find(p => p.name === 'Core Technologies')?.value || 0}%
                    </div>
                    <div className="text-sm text-purple-700">Technology Overlap</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Risk & Valuation Tab */}
        <TabsContent value="risk-valuation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatentChart
              title="Patent Infringement Risk"
              data={insights.infringementRisk}
              type="pie"
              description="IP risk assessment by category"
              icon={<AlertTriangle className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Patent Valuation Distribution"
              data={insights.patentValuation}
              type="bar"
              description="Asset value categorization"
              icon={<DollarSign className="h-4 w-4" />}
            />
            
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Risk & Valuation Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {insights.infringementRisk.find(r => r.name === 'High Risk')?.value || 0}%
                    </div>
                    <div className="text-sm text-red-700">High Risk Patents</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {insights.infringementRisk.find(r => r.name === 'Medium Risk')?.value || 0}%
                    </div>
                    <div className="text-sm text-yellow-700">Medium Risk</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {insights.infringementRisk.find(r => r.name === 'Cleared')?.value || 0}%
                    </div>
                    <div className="text-sm text-green-700">Cleared Patents</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {insights.patentValuation.find(v => v.name.includes('High Value'))?.value || 0}%
                    </div>
                    <div className="text-sm text-blue-700">High Value Assets</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="market-intel" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PatentChart
              title="Technology Maturity Analysis"
              data={insights.technologyMaturity}
              type="pie"
              description="Innovation lifecycle stages"
              icon={<BarChart3 className="h-4 w-4" />}
            />
            
            <PatentChart
              title="Citation Impact Distribution"
              data={insights.citationImpact}
              type="bar"
              description="Patent influence metrics"
              icon={<Lightbulb className="h-4 w-4" />}
            />
          </div>
        </TabsContent>
      </Tabs>

      {/* Recent Patents List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent High-Value Patents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {patents.slice(0, 8).map((patent) => (
              <div key={patent.id} className="border-l-4 border-primary pl-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm mb-1">{patent.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="font-medium">{patent.assignee}</span>
                      <span>•</span>
                      <span>{patent.patentNumber}</span>
                      <span>•</span>
                      <span>{new Date(patent.publicationDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{patent.citations} citations</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {patent.abstract}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 ml-4">
                    <Badge variant="outline" className="text-xs">
                      {patent.claims} claims
                    </Badge>
                    {patent.technology.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {patent.technology[0]}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}