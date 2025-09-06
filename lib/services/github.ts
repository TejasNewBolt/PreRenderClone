import { createClient } from '@/lib/supabase/server'

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  private: boolean
  html_url: string
  description: string | null
  default_branch: string
  language: string | null
  updated_at: string
}

export interface GitHubConnection {
  id: string
  site_id: string
  user_id: string
  installation_id: string
  repo_full_name: string
  default_branch: string
  webhook_id: string | null
  webhook_secret: string | null
  connected_at: string
  last_sync: string | null
  is_active: boolean
}

// Connect a repository to a site
export async function connectRepository(
  siteId: string,
  repoFullName: string,
  defaultBranch: string = 'main'
): Promise<GitHubConnection> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Verify site ownership
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('id')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
  
  if (siteError || !site) {
    throw new Error('Site not found or access denied')
  }
  
  // Check if a connection already exists
  const { data: existingConnection } = await supabase
    .from('github_connections')
    .select('*')
    .eq('site_id', siteId)
    .single()
  
  if (existingConnection) {
    // Update existing connection
    const { data, error } = await supabase
      .from('github_connections')
      .update({
        repo_full_name: repoFullName,
        default_branch: defaultBranch,
        last_sync: new Date().toISOString(),
        is_active: true
      })
      .eq('site_id', siteId)
      .eq('user_id', user.id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } else {
    // Create new connection
    const { data, error } = await supabase
      .from('github_connections')
      .insert({
        site_id: siteId,
        user_id: user.id,
        installation_id: 'pending', // Will be updated when GitHub App is installed
        repo_full_name: repoFullName,
        default_branch: defaultBranch,
        webhook_secret: generateWebhookSecret()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Also update the site with repo info
    await supabase
      .from('sites')
      .update({
        repo_url: `https://github.com/${repoFullName}`,
        repo_branch: defaultBranch,
        updated_at: new Date().toISOString()
      })
      .eq('id', siteId)
      .eq('user_id', user.id)
    
    return data
  }
}

// Disconnect a repository from a site
export async function disconnectRepository(siteId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Update connection to inactive
  await supabase
    .from('github_connections')
    .update({
      is_active: false,
      last_sync: new Date().toISOString()
    })
    .eq('site_id', siteId)
    .eq('user_id', user.id)
  
  // Clear repo info from site
  await supabase
    .from('sites')
    .update({
      repo_url: null,
      repo_branch: 'main',
      github_installation_id: null,
      updated_at: new Date().toISOString()
    })
    .eq('id', siteId)
    .eq('user_id', user.id)
}

// Get repository connection for a site
export async function getRepositoryConnection(
  siteId: string
): Promise<GitHubConnection | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  const { data, error } = await supabase
    .from('github_connections')
    .select('*')
    .eq('site_id', siteId)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // No connection found
    }
    throw error
  }
  
  return data
}

// Generate a secure webhook secret
function generateWebhookSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Mock function to get user's GitHub repositories
// In production, this would use GitHub API with OAuth token
export async function getUserRepositories(): Promise<GitHubRepo[]> {
  // For now, return mock data
  // In production, this would call GitHub API
  return [
    {
      id: 1,
      name: 'my-nextjs-site',
      full_name: 'user/my-nextjs-site',
      private: false,
      html_url: 'https://github.com/user/my-nextjs-site',
      description: 'My Next.js website',
      default_branch: 'main',
      language: 'TypeScript',
      updated_at: new Date().toISOString()
    },
    {
      id: 2,
      name: 'blog',
      full_name: 'user/blog',
      private: false,
      html_url: 'https://github.com/user/blog',
      description: 'Personal blog built with Gatsby',
      default_branch: 'main',
      language: 'JavaScript',
      updated_at: new Date().toISOString()
    },
    {
      id: 3,
      name: 'landing-page',
      full_name: 'user/landing-page',
      private: true,
      html_url: 'https://github.com/user/landing-page',
      description: 'Company landing page',
      default_branch: 'master',
      language: 'HTML',
      updated_at: new Date().toISOString()
    }
  ]
}
