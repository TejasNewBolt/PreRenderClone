import { createClient } from '@/lib/supabase/server'
import { Site, CreateSiteInput } from '@/types/domain'

// Get all sites for the current user (multi-tenant)
export async function getUserSites(): Promise<Site[]> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Fetch sites for this user only (multi-tenant query)
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    throw error
  }
  
  return data || []
}

// Get a single site by ID (with ownership check)
export async function getSiteById(siteId: string): Promise<Site | null> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Multi-tenant query - ensure user owns this site
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('user_id', user.id) // Multi-tenant check
    .single()
  
  if (error) {
    if (error.code === 'PGRST116') {
      return null // Site not found or user doesn't own it
    }
    throw error
  }
  
  return data
}

// Create a new site for the current user
export async function createSite(input: CreateSiteInput): Promise<Site> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Check user's domain limit based on their plan
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('plan_id')
    .eq('id', user.id)
    .single()
  
  // Get plan limits
  let maxDomains = 1 // Default for free plan
  if (profile?.plan_id) {
    const { data: plan } = await supabase
      .from('plans')
      .select('max_domains')
      .eq('id', profile.plan_id)
      .single()
    
    if (plan) {
      maxDomains = plan.max_domains
    }
  }
  
  // Check current domain count
  const { count } = await supabase
    .from('sites')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_active', true)
  
  if (count && count >= maxDomains) {
    throw new Error(`Domain limit reached. Your plan allows ${maxDomains} domain(s).`)
  }
  
  // Create the site with user_id for multi-tenancy
  const { data, error } = await supabase
    .from('sites')
    .insert({
      ...input,
      user_id: user.id, // Multi-tenant field
      cache_freshness_seconds: input.cache_freshness_seconds || 86400, // 24 hours default
    })
    .select()
    .single()
  
  if (error) {
    if (error.code === '23505') {
      throw new Error('This domain is already registered')
    }
    throw error
  }
  
  // Also create cache settings for this site
  await supabase
    .from('cache_settings')
    .insert({
      site_id: data.id,
      user_id: user.id, // Multi-tenant field
      cache_freshness_seconds: input.cache_freshness_seconds || 86400,
    })
  
  return data
}

// Delete a site (with ownership check)
export async function deleteSite(siteId: string): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Multi-tenant delete - only delete if user owns the site
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', siteId)
    .eq('user_id', user.id) // Multi-tenant check
  
  if (error) {
    throw error
  }
}

// Update site verification status (with ownership check)
export async function updateSiteVerification(
  siteId: string,
  status: 'verified' | 'failed'
): Promise<void> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  const { error } = await supabase
    .from('sites')
    .update({
      verification_status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', siteId)
    .eq('user_id', user.id) // Multi-tenant check
  
  if (error) {
    throw error
  }
}
