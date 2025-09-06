'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  Globe, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  Settings,
  Trash2
} from 'lucide-react'

interface Site {
  id: string
  domain: string
  origin: string
  verification_status: string
  created_at: string
  cache_freshness_seconds: number
  verification_token: string
  verification_method: string
}

interface VerificationInstruction {
  method: string
  instructions: string
  value: string
}

export default function DomainDetailPage() {
  const params = useParams()
  const router = useRouter()
  const siteId = params.id as string
  
  const [site, setSite] = useState<Site | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [verificationInstructions, setVerificationInstructions] = useState<VerificationInstruction[]>([])
  const [selectedMethod, setSelectedMethod] = useState<'dns_txt' | 'meta_tag' | 'file'>('dns_txt')
  const [verifying, setVerifying] = useState(false)
  const [verificationMessage, setVerificationMessage] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  useEffect(() => {
    fetchSiteDetails()
    fetchVerificationInstructions()
  }, [siteId])

  const fetchSiteDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/domains/${siteId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/domains')
          return
        }
        throw new Error('Failed to fetch domain details')
      }
      
      const data = await response.json()
      setSite(data)
    } catch (err) {
      console.error('Error fetching site:', err)
      setError('Failed to load domain details')
    } finally {
      setLoading(false)
    }
  }

  const fetchVerificationInstructions = async () => {
    try {
      const response = await fetch(`/api/domains/${siteId}/verify`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch verification instructions')
      }
      
      const data = await response.json()
      setVerificationInstructions(data.instructions)
    } catch (err) {
      console.error('Error fetching verification instructions:', err)
    }
  }

  const handleVerify = async () => {
    setVerifying(true)
    setVerificationMessage(null)
    setError(null)

    try {
      const response = await fetch(`/api/domains/${siteId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ method: selectedMethod }),
      })

      const data = await response.json()
      setVerificationMessage(data.message)

      if (data.success) {
        // Refresh site details to show updated status
        await fetchSiteDetails()
      }
    } catch (err) {
      setError('Failed to verify domain')
    } finally {
      setVerifying(false)
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this domain? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/domains/${siteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete domain')
      }

      router.push('/domains')
    } catch (err) {
      setError('Failed to delete domain')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <AlertCircle className="h-6 w-6 text-yellow-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium"
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`
      default:
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!site) {
    return null
  }

  const currentInstruction = verificationInstructions.find(i => i.method === selectedMethod)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/domains')}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Globe className="h-8 w-8 text-gray-400" />
              <span>{site.domain}</span>
            </h1>
            <p className="text-gray-500 mt-1">{site.origin}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
            title="Delete domain"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push(`/domains/${siteId}/settings`)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
            title="Domain settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Domain Status</h2>
          <span className={getStatusBadge(site.verification_status)}>
            {site.verification_status.charAt(0).toUpperCase() + site.verification_status.slice(1)}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Created:</span>
            <span className="ml-2 font-medium">
              {new Date(site.created_at).toLocaleDateString()}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Cache TTL:</span>
            <span className="ml-2 font-medium">
              {site.cache_freshness_seconds / 3600} hours
            </span>
          </div>
        </div>
      </div>

      {/* Verification Section */}
      {site.verification_status !== 'verified' && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Verify Domain Ownership</h2>
            <p className="text-sm text-gray-500 mt-1">
              Choose a verification method and follow the instructions below
            </p>
          </div>
          
          <div className="p-6">
            {/* Method Selector */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setSelectedMethod('dns_txt')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedMethod === 'dns_txt'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                DNS TXT Record
              </button>
              <button
                onClick={() => setSelectedMethod('meta_tag')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedMethod === 'meta_tag'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                HTML Meta Tag
              </button>
              <button
                onClick={() => setSelectedMethod('file')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  selectedMethod === 'file'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                File Upload
              </button>
            </div>

            {/* Instructions */}
            {currentInstruction && (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    {currentInstruction.instructions}
                  </p>
                  
                  <div className="bg-white rounded-md p-3 font-mono text-sm break-all">
                    {currentInstruction.value.split('\n').map((line, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span>{line}</span>
                        {index === 0 && (
                          <button
                            onClick={() => handleCopy(
                              selectedMethod === 'file' 
                                ? site.verification_token 
                                : currentInstruction.value,
                              index
                            )}
                            className="ml-2 p-1 hover:bg-gray-100 rounded"
                          >
                            {copiedIndex === index ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-gray-500" />
                            )}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Help */}
                {selectedMethod === 'dns_txt' && (
                  <div className="text-sm text-gray-600">
                    <p>ℹ️ DNS changes can take up to 48 hours to propagate worldwide.</p>
                    <p>Common DNS providers: Cloudflare, GoDaddy, Namecheap, Route 53</p>
                  </div>
                )}
                
                {selectedMethod === 'meta_tag' && (
                  <div className="text-sm text-gray-600">
                    <p>ℹ️ Add the meta tag to your homepage's HTML head section.</p>
                    <p>The tag must be accessible without authentication.</p>
                  </div>
                )}
                
                {selectedMethod === 'file' && (
                  <div className="text-sm text-gray-600">
                    <p>ℹ️ Create the file at the exact path shown above.</p>
                    <p>The file must be publicly accessible.</p>
                  </div>
                )}

                {/* Verification Button */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleVerify}
                    disabled={verifying}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {verifying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <span>Verify Domain</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Verification Message */}
                {verificationMessage && (
                  <div className={`p-4 rounded-md ${
                    verificationMessage.includes('successfully') 
                      ? 'bg-green-50 text-green-800' 
                      : 'bg-yellow-50 text-yellow-800'
                  }`}>
                    {verificationMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Verified Success Message */}
      {site.verification_status === 'verified' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold text-green-900">Domain Verified</h3>
              <p className="text-green-700 mt-1">
                Your domain ownership has been verified. You can now configure caching and connect your repository.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}