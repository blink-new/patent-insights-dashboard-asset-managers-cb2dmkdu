import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ApiConfigDialog } from '@/components/ApiConfigDialog'
import { ChatMessage } from '@/components/ChatMessage'
import { InsightResults } from '@/components/InsightResults'
import { PatentApiService } from '@/services/patentApi'
import { Message, ApiConfig, InsightResult } from '@/types'
import { Send, Sparkles, TrendingUp, Search } from 'lucide-react'
import { blink } from '@/blink/client'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [apiConfig, setApiConfig] = useState<ApiConfig | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [theme, setTheme] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [currentResult, setCurrentResult] = useState<InsightResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auth state management
  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSearch = async () => {
    if (!input.trim() || !apiConfig || isSearching) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: `Search: ${input}${theme ? ` (Theme: ${theme})` : ''}`,
      timestamp: new Date()
    }

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: 'assistant',
      content: 'Analyzing patent data and generating insights...',
      timestamp: new Date(),
      isLoading: true
    }

    setMessages(prev => [...prev, userMessage, loadingMessage])
    setIsSearching(true)
    setCurrentResult(null)

    try {
      const apiService = new PatentApiService(apiConfig)
      const result = await apiService.searchPatents(input, theme || undefined)
      
      // Remove loading message and add result
      setMessages(prev => prev.slice(0, -1))
      setCurrentResult(result)
      
      const resultMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: 'assistant',
        content: `Found ${result.insights.totalPatents} patents for "${input}". Analysis complete with interactive visualizations below.`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, resultMessage])
      
    } catch (error) {
      setMessages(prev => prev.slice(0, -1))
      
      const errorMessage: Message = {
        id: (Date.now() + 3).toString(),
        type: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to search patents'}`,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsSearching(false)
      setInput('')
      setTheme('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Patent Insights Dashboard</h1>
            <p className="text-muted-foreground mb-4">
              Please sign in to access patent analytics and insights
            </p>
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                <h1 className="text-xl font-bold">Patent Insights</h1>
              </div>
              <Badge variant="secondary" className="hidden sm:inline-flex">
                Asset Manager Dashboard
              </Badge>
            </div>
            
            <div className="flex items-center gap-3">
              <ApiConfigDialog 
                config={apiConfig} 
                onConfigSave={setApiConfig} 
              />
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => blink.auth.logout()}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <Card className="border-dashed">
                <CardContent className="p-8 text-center">
                  <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Welcome to Patent Insights</h2>
                  <p className="text-muted-foreground mb-6">
                    Search for patents by company name, ISIN, URL, or technology theme. 
                    Get actionable insights with interactive visualizations.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline">Company: Apple Inc.</Badge>
                    <Badge variant="outline">ISIN: US0378331005</Badge>
                    <Badge variant="outline">Theme: Artificial Intelligence</Badge>
                    <Badge variant="outline">URL: https://company.com</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Messages */}
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Results */}
            {currentResult && (
              <div className="mt-8">
                <InsightResults result={currentResult} />
              </div>
            )}
          </div>

          {/* Input Panel */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Search Query
                    </label>
                    <Textarea
                      placeholder="Enter company name, ISIN, URL, or technology theme..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="min-h-[100px] resize-none"
                      disabled={!apiConfig || isSearching}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Theme (Optional)
                    </label>
                    <Input
                      placeholder="e.g., AI, renewable energy, biotechnology..."
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      disabled={!apiConfig || isSearching}
                    />
                  </div>

                  <Button 
                    onClick={handleSearch}
                    disabled={!input.trim() || !apiConfig || isSearching}
                    className="w-full gap-2"
                  >
                    {isSearching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Search Patents
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Examples */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Quick Examples
                </h3>
                <div className="space-y-2">
                  {[
                    'Tesla Inc.',
                    'US88160R1014',
                    'artificial intelligence',
                    'https://apple.com'
                  ].map((example) => (
                    <Button
                      key={example}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-left h-auto p-2"
                      onClick={() => setInput(example)}
                      disabled={!apiConfig || isSearching}
                    >
                      <span className="text-xs text-muted-foreground truncate">
                        {example}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-3">Status</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>API Connection</span>
                    <Badge variant={apiConfig ? "default" : "secondary"}>
                      {apiConfig ? "Connected" : "Not Configured"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>User</span>
                    <Badge variant="default">
                      {user.email}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App