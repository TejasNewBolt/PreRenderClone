'use client'

import { useState, useEffect } from 'react'
import { 
  GitBranch, 
  Github, 
  Link2, 
  Unlink, 
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Lock,
  Globe
} from 'lucide-react'

interface GitHubConnection {
  id: string
  site_id: string
  repo_full_name: string
  default_branch: string
  webhook_id?: string
  is_active: boolean
  connected_at: string
  last_sync?: string
}

interface RepositoryConnectionProps {
  siteId: string
  domain: string
  isVerified: boolean
}

export default function RepositoryConnection({ 
  siteId, 
  domain,
  isVerified 
}: RepositoryConnectionProps) {
  const [connection, setConnection] = useState<GitHubConnection | null>(null)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConnection()
  }, [siteId])

  const fetchConnection = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/domains/${siteId}/repository`)
      
      if (response.ok) {
        const data = await response.json()
        if (data.connected && data.connection) {
          setConnection(data.connection)
        }
      }
    } catch (err) {
      console.error('Error fetching connection:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectGitHub = () => {
    // Redirect to GitHub OAuth with site ID in state
    window.location.href = `/api/github/oauth?siteId=${siteId}`
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this repository?')) {
      return
    }

    setDisconnecting(true)
    setError(null)

    try {
      const response = await fetch(`/api/github/connect?siteId=${siteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to disconnect repository')
      }

      setConnection(null)
    } catch (err) {
      setError('Failed to disconnect repository')
    } finally {
      setDisconnecting(false)
    }
  }

  if (!isVerified) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Repository Connection</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center space-x-3 text-yellow-700 bg-yellow-50 p-4 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">
              Please verify your domain ownership before connecting a repository.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-lg font-semibold">Repository Connection</h2>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : connection ? (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <Github className="h-6 w-6 text-gray-600 mt-0.5" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">
                      {connection.repo_full_name}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <GitBranch className="h-3 w-3" />
                      <span>{connection.default_branch}</span>
                    </span>
                    <span>
                      Connected {new Date(connection.connected_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-md"
              >
                {disconnecting ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="h-4 w-4" />
                )}
                <span>Disconnect</span>
              </button>
            </div>

            <div className="bg-gray-50 rounded-md p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Build Configuration</h4>
              <p className="text-sm text-gray-600">
                When you push to the <code className="px-1 py-0.5 bg-white rounded">{connection.default_branch}</code> branch, 
                we'll automatically build and cache your site.
              </p>
              {connection.webhook_id && (
                <div className="mt-2 flex items-center text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Webhook configured
                </div>
              )}
            </div>

            {connection.last_sync && (
              <div className="text-xs text-gray-500">
                Last synced: {new Date(connection.last_sync).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Github className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No repository connected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Connect a GitHub repository to enable automatic builds.
            </p>
            <div className="mt-6">
              <button
                onClick={handleConnectGitHub}
                className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Github className="h-4 w-4" />
                <span>Connect with GitHub</span>
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
