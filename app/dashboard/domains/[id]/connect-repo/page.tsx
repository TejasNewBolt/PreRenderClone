'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Loader2, GitBranch, Link, CheckCircle } from 'lucide-react';

interface Repository {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  private: boolean;
  defaultBranch: string;
  url: string;
  language: string | null;
  owner: {
    login: string;
    avatarUrl: string;
  };
}

export default function ConnectRepoPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const siteId = params.id as string;
  const success = searchParams.get('success') === 'true';
  
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (success) {
      fetchRepositories();
    } else {
      // Redirect to domain page if not coming from OAuth
      router.push(`/dashboard/domains/${siteId}`);
    }
  }, [success, siteId, router]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/github/repos');
      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }
      
      const data = await response.json();
      setRepositories(data.repositories);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      setError('Failed to fetch your repositories. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedRepo) {
      setError('Please select a repository to connect.');
      return;
    }

    setIsConnecting(true);
    setError(null);
    
    try {
      const repo = repositories.find(r => r.fullName === selectedRepo);
      if (!repo) return;

      const response = await fetch('/api/github/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siteId,
          repoFullName: selectedRepo,
          defaultBranch: selectedBranch || repo.defaultBranch,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect repository');
      }

      // Redirect back to domain page
      router.push(`/dashboard/domains/${siteId}`);
    } catch (error) {
      console.error('Error connecting repository:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect repository');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/dashboard/domains/${siteId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const selectedRepository = repositories.find(r => r.fullName === selectedRepo);

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">Connect Repository</h2>
          <p className="text-gray-600 mt-2">
            Select a repository to connect to your site for automatic deployments
          </p>
        </div>
        
        <div className="p-6 space-y-6">
          {success && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-md">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully authenticated with GitHub</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Repository
            </label>
            <select
              value={selectedRepo}
              onChange={(e) => setSelectedRepo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a repository</option>
              {repositories.map((repo) => (
                <option key={repo.id} value={repo.fullName}>
                  {repo.name} {repo.private && '(Private)'}
                </option>
              ))}
            </select>
          </div>

          {selectedRepository && (
            <>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Default Branch
                </label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-500" />
                  <select
                    value={selectedBranch || selectedRepository.defaultBranch}
                    onChange={(e) => setSelectedBranch(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={selectedRepository.defaultBranch}>
                      {selectedRepository.defaultBranch}
                    </option>
                    <option value="main">main</option>
                    <option value="master">master</option>
                    <option value="develop">develop</option>
                  </select>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedRepository.owner.avatarUrl} 
                    alt={selectedRepository.owner.login}
                    className="h-6 w-6 rounded-full"
                  />
                  <span className="text-sm text-gray-600">
                    {selectedRepository.owner.login} / {selectedRepository.name}
                  </span>
                </div>
                {selectedRepository.description && (
                  <p className="text-sm text-gray-600">{selectedRepository.description}</p>
                )}
                {selectedRepository.language && (
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-gray-600">{selectedRepository.language}</span>
                  </div>
                )}
                <a 
                  href={selectedRepository.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                >
                  <Link className="h-3 w-3" />
                  View on GitHub
                </a>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <button
              onClick={handleCancel}
              disabled={isConnecting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConnect}
              disabled={!selectedRepo || isConnecting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Repository'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
