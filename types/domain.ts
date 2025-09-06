export interface Site {
  id: string
  user_id: string
  domain: string
  latest_build_id: string | null
  origin: string | null
  cache_freshness_seconds: number
  repo_url: string | null
  repo_branch: string
  github_installation_id: string | null
  webhook_secret: string | null
  verification_status: 'pending' | 'verified' | 'failed'
  verification_method: 'dns_txt' | 'meta_tag' | 'file' | null
  verification_token: string
  is_active: boolean
  created_at: string
  updated_at: string
  account_id: string | null
}

export interface CreateSiteInput {
  domain: string
  origin?: string
  cache_freshness_seconds?: number
}

export interface VerificationInstruction {
  method: 'dns_txt' | 'meta_tag' | 'file'
  instructions: string
  value: string
}
