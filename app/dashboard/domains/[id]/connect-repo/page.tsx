'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, GitBranch, Link, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

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
  const { toast } = useToast();
  
  const siteId = params.id as string;
  const success = searchParams.get('success') === 'true';
  
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (success) {
      fetchRepositories();
    } else {
      // Redirect to domain page if not coming from OAuth
      router.push(`/dashboard/domains/${siteId}`);
    }
  }, [success, siteId]);

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
      toast({
        title: 'Error',
        description: 'Failed to fetch your repositories. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!selectedRepo) {
      toast({
        title: 'Select a repository',
        description: 'Please select a repository to connect.',
        variant: 'destructive',
      });
      return;
    }

    setIsConnecting(true);
    
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

      toast({
        title: 'Success',
        description: 'Repository connected successfully!',
      });

      // Redirect back to domain page
      router.push(`/dashboard/domains/${siteId}`);
    } catch (error) {
      console.error('Error connecting repository:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to connect repository',
        variant: 'destructive',
      });
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
      <Card>
        <CardHeader>
          <CardTitle>Connect Repository</CardTitle>
          <CardDescription>
            Select a repository to connect to your site for automatic deployments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {success && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully authenticated with GitHub</span>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Repository</label>
            <Select value={selectedRepo} onValueChange={setSelectedRepo}>
              <SelectTrigger>
                <SelectValue placeholder="Select a repository" />
              </SelectTrigger>
              <SelectContent>
                {repositories.map((repo) => (
                  <SelectItem key={repo.id} value={repo.fullName}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{repo.name}</span>
                      {repo.private && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">Private</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRepository && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Branch</label>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-gray-500" />
                  <Select 
                    value={selectedBranch || selectedRepository.defaultBranch} 
                    onValueChange={setSelectedBranch}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={selectedRepository.defaultBranch}>
                        {selectedRepository.defaultBranch}
                      </SelectItem>
                      <SelectItem value="main">main</SelectItem>
                      <SelectItem value="master">master</SelectItem>
                      <SelectItem value="develop">develop</SelectItem>
                    </SelectContent>
                  </Select>
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

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConnect}
              disabled={!selectedRepo || isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect Repository'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
