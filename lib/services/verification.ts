import { createClient } from '@/lib/supabase/server'
import { VerificationInstruction } from '@/types/domain'

// Generate verification instructions for a domain
export async function getVerificationInstructions(
  siteId: string
): Promise<VerificationInstruction[]> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Get the site with ownership check
  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
  
  if (error || !site) {
    throw new Error('Site not found')
  }
  
  const verificationToken = site.verification_token
  
  return [
    {
      method: 'dns_txt',
      instructions: `Add a TXT record to your domain's DNS settings with the following value. This may take up to 48 hours to propagate.`,
      value: `prerender-verification=${verificationToken}`
    },
    {
      method: 'meta_tag',
      instructions: `Add this meta tag to the <head> section of your homepage HTML:`,
      value: `<meta name="prerender-verification" content="${verificationToken}" />`
    },
    {
      method: 'file',
      instructions: `Create a file at the root of your domain with this exact path and content:`,
      value: `Path: /.well-known/prerender-verification.txt\nContent: ${verificationToken}`
    }
  ]
}

// Verify domain ownership using DNS TXT record
async function verifyDNS(domain: string, expectedToken: string): Promise<boolean> {
  try {
    // In production, you would use a DNS resolver library or API
    // For now, we'll simulate the check
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=TXT`)
    
    if (!response.ok) {
      return false
    }
    
    const data = await response.json()
    
    if (data.Answer) {
      for (const record of data.Answer) {
        if (record.type === 16 && record.data) {
          // Remove quotes from TXT record
          const txtValue = record.data.replace(/"/g, '')
          if (txtValue === `prerender-verification=${expectedToken}`) {
            return true
          }
        }
      }
    }
    
    return false
  } catch (error) {
    console.error('DNS verification error:', error)
    return false
  }
}

// Verify domain ownership using meta tag
async function verifyMetaTag(domain: string, expectedToken: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}`, {
      headers: {
        'User-Agent': 'PreRender-Verification-Bot/1.0'
      }
    })
    
    if (!response.ok) {
      return false
    }
    
    const html = await response.text()
    
    // Look for the meta tag in the HTML
    const metaTagRegex = new RegExp(
      `<meta\\s+name=["']prerender-verification["']\\s+content=["']${expectedToken}["']`,
      'i'
    )
    
    return metaTagRegex.test(html)
  } catch (error) {
    console.error('Meta tag verification error:', error)
    return false
  }
}

// Verify domain ownership using file
async function verifyFile(domain: string, expectedToken: string): Promise<boolean> {
  try {
    const response = await fetch(`https://${domain}/.well-known/prerender-verification.txt`, {
      headers: {
        'User-Agent': 'PreRender-Verification-Bot/1.0'
      }
    })
    
    if (!response.ok) {
      return false
    }
    
    const content = await response.text()
    return content.trim() === expectedToken
  } catch (error) {
    console.error('File verification error:', error)
    return false
  }
}

// Main verification function
export async function verifyDomain(
  siteId: string,
  method: 'dns_txt' | 'meta_tag' | 'file'
): Promise<{ success: boolean; message: string }> {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    throw new Error('Not authenticated')
  }
  
  // Get the site with ownership check
  const { data: site, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', siteId)
    .eq('user_id', user.id)
    .single()
  
  if (error || !site) {
    throw new Error('Site not found')
  }
  
  let verified = false
  let message = ''
  
  // Perform verification based on method
  switch (method) {
    case 'dns_txt':
      verified = await verifyDNS(site.domain, site.verification_token)
      message = verified 
        ? 'Domain verified successfully via DNS TXT record' 
        : 'DNS TXT record not found or does not match. Please ensure the record has propagated (can take up to 48 hours).'
      break
      
    case 'meta_tag':
      verified = await verifyMetaTag(site.domain, site.verification_token)
      message = verified 
        ? 'Domain verified successfully via meta tag' 
        : 'Meta tag not found on your homepage. Please ensure it is in the <head> section.'
      break
      
    case 'file':
      verified = await verifyFile(site.domain, site.verification_token)
      message = verified 
        ? 'Domain verified successfully via file' 
        : 'Verification file not found or content does not match. Please check the file path and content.'
      break
      
    default:
      message = 'Invalid verification method'
  }
  
  // Update the site verification status and method
  if (verified) {
    await supabase
      .from('sites')
      .update({
        verification_status: 'verified',
        verification_method: method,
        updated_at: new Date().toISOString()
      })
      .eq('id', siteId)
      .eq('user_id', user.id)
  }
  
  return { success: verified, message }
}

// Check if a domain is already verified by another user
export async function isDomainAvailable(domain: string): Promise<boolean> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('sites')
    .select('id')
    .eq('domain', domain)
    .eq('verification_status', 'verified')
    .single()
  
  // Domain is available if no verified site exists
  return !data
}
