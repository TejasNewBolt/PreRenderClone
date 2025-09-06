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
import { GitHubRepo, GitHubConnection } from '@/lib/services/github'

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
  const [repositories, setRepositories] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [disconnecting, setDisconnecting] = useState(false)
  const [showConnectModal, setShowConnectModal] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState<string>('')
  const [selectedBranch, setSelectedBranch] = useState<string>('main')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchConnection()
  }, [siteId])

  const fetchConnection = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/domains/${siteId}/repository`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch repository connection')
      }
      
      const data = await response.json()
      
      if (data.connected && data.connection) {
        setConnection(data.connection)
      }
    } catch (err) {
      console.error('Error fetching connection:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/github/repositories')
      
      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }
      
      const data = await response.json()
      setRepositories(data)
    } catch (err) {
      console.error('Error fetching repositories:', err)
      setError('Failed to load repositories')
    }
  }

  const handleConnect = async () => {
    if (!selectedRepo) {
      setError('Please select a repository')
      return
    }

    setConnecting(true)
    setError(null)

    try {
      const response = await fetch(`/api/domains/${siteId}/repository`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repo_full_name: selectedRepo,
          default_branch: selectedBranch
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to connect repository')
      }

      const data = await response.json()
      setConnection(data)
      setShowConnectModal(false)
      setSelectedRepo('')
      setSelectedBranch('main')
    } catch (err) {
      setError('Failed to connect repository')
    } finally {
      setConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect this repository?')) {
      return
    }

    setDisconnecting(true)
    setError(null)

    try {
      const response = await fetch(`/api/domains/${siteId}/repository`, {
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

  const openConnectModal = () => {
    setShowConnectModal(true)
    fetchRepositories()
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
    <>
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
              </div>
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
                  onClick={openConnectModal}
                  className="inline-flex items-center space-x-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Link2 className="h-4 w-4" />
                  <span>Connect Repository</span>
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

      {/* Connect Repository Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Connect GitHub Repository</h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Repository
                  </label>
                  
                  {repositories.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No repositories found.</p>
                      <p className="text-sm mt-2">
                        Make sure you have granted access to your repositories.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                      {repositories.map((repo) => (
                        <label
                          key={repo.id}
                          className={`flex items-start space-x-3 p-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                            selectedRepo === repo.full_name ? 'bg-blue-50 border-blue-200' : 'border border-gray-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="repository"
                            value={repo.full_name}
                            checked={selectedRepo === repo.full_name}
                            onChange={(e) => {
                              setSelectedRepo(e.target.value)
                              setSelectedBranch(repo.default_branch)
                            }}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {repo.name}
                              </span>
                              {repo.private && (
                                <Lock className="h-3 w-3 text-gray-500" />
                              )}
                            </div>
                            {repo.description && (
                              <p className="text-sm text-gray-500 mt-1">
                                {repo.description}
                              </p>
                            )}
                            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                              {repo.language && (
                                <span>{repo.language}</span>
                              )}
                              <span className="flex items-center space-x-1">
                                <GitBranch className="h-3 w-3" />
                                <span>{repo.default_branch}</span>
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {selectedRepo && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Branch
                    </label>
                    <input
                      type="text"
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="main"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      We'll build your site when you push to this branch
                    </p>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConnectModal(false)
                  setSelectedRepo('')
                  setSelectedBranch('main')
                  setError(null)
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={connecting}
              >
                Cancel
              </button>
              <button
                onClick={handleConnect}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                disabled={connecting || !selectedRepo}
              >
                {connecting ? 'Connecting...' : 'Connect Repository'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
