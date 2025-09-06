export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sites: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          domain: string
          latest_build_id?: string | null
          origin?: string | null
          cache_freshness_seconds?: number
          repo_url?: string | null
          repo_branch?: string
          github_installation_id?: string | null
          webhook_secret?: string | null
          verification_status?: 'pending' | 'verified' | 'failed'
          verification_method?: 'dns_txt' | 'meta_tag' | 'file' | null
          verification_token?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          account_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          domain?: string
          latest_build_id?: string | null
          origin?: string | null
          cache_freshness_seconds?: number
          repo_url?: string | null
          repo_branch?: string
          github_installation_id?: string | null
          webhook_secret?: string | null
          verification_status?: 'pending' | 'verified' | 'failed'
          verification_method?: 'dns_txt' | 'meta_tag' | 'file' | null
          verification_token?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
          account_id?: string | null
        }
      }
      builds: {
        Row: {
          id: string
          site_id: string
          user_id: string
          artifact_path: string | null
          route_count: number
          manifest_url: string | null
          status: 'queued' | 'processing' | 'uploaded' | 'failed'
          uploaded_by: string | null
          error_message: string | null
          created_at: string
          uploaded_at: string | null
        }
        Insert: {
          id: string
          site_id: string
          user_id: string
          artifact_path?: string | null
          route_count?: number
          manifest_url?: string | null
          status?: 'queued' | 'processing' | 'uploaded' | 'failed'
          uploaded_by?: string | null
          error_message?: string | null
          created_at?: string
          uploaded_at?: string | null
        }
        Update: {
          id?: string
          site_id?: string
          user_id?: string
          artifact_path?: string | null
          route_count?: number
          manifest_url?: string | null
          status?: 'queued' | 'processing' | 'uploaded' | 'failed'
          uploaded_by?: string | null
          error_message?: string | null
          created_at?: string
          uploaded_at?: string | null
        }
      }
      plans: {
        Row: {
          id: string
          name: string
          price_monthly: number | null
          price_annual: number | null
          render_quota_monthly: number
          max_domains: number
          min_cache_freshness_hours: number
          max_cache_freshness_hours: number
          features: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          price_monthly?: number | null
          price_annual?: number | null
          render_quota_monthly: number
          max_domains: number
          min_cache_freshness_hours: number
          max_cache_freshness_hours: number
          features?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          price_monthly?: number | null
          price_annual?: number | null
          render_quota_monthly?: number
          max_domains?: number
          min_cache_freshness_hours?: number
          max_cache_freshness_hours?: number
          features?: Json
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_monthly_usage: {
        Args: { p_user_id: string }
        Returns: {
          total_renders: number
          quota_limit: number
          remaining: number
          percentage_used: number
        }[]
      }
      check_user_quota: {
        Args: { p_user_id: string; p_renders_needed?: number }
        Returns: boolean
      }
      increment_usage: {
        Args: {
          p_user_id: string
          p_site_id: string
          p_renders?: number
          p_cache_hits?: number
          p_cache_misses?: number
        }
        Returns: void
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}