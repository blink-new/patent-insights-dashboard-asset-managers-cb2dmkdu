import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Settings, Key } from 'lucide-react'
import { ApiConfig } from '@/types'

interface ApiConfigDialogProps {
  config: ApiConfig | null
  onConfigSave: (config: ApiConfig) => void
}

export function ApiConfigDialog({ config, onConfigSave }: ApiConfigDialogProps) {
  const [open, setOpen] = useState(false)
  const [bearerToken, setBearerToken] = useState(config?.bearerToken || '')
  const [baseUrl, setBaseUrl] = useState(config?.baseUrl || 'https://api.patents.com/v1')

  const handleSave = () => {
    if (bearerToken.trim()) {
      onConfigSave({
        bearerToken: bearerToken.trim(),
        baseUrl: baseUrl.trim()
      })
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={config ? "outline" : "default"} 
          size="sm"
          className="gap-2"
        >
          <Key className="h-4 w-4" />
          {config ? 'API Connected' : 'Configure API'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            API Configuration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bearer-token">Bearer Token</Label>
            <Input
              id="bearer-token"
              type="password"
              placeholder="Enter your API bearer token"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="base-url">API Base URL</Label>
            <Input
              id="base-url"
              placeholder="https://api.patents.com/v1"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleSave} 
            className="w-full"
            disabled={!bearerToken.trim()}
          >
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}