import { NextRequest, NextResponse } from 'next/server'
import { getUserSites, createSite } from '@/lib/services/domain'
import { CreateSiteInput } from '@/types/domain'

// GET /api/domains - Get all domains for current user
export async function GET() {
  try {
    const sites = await getUserSites()
    return NextResponse.json(sites)
  } catch (error) {
    console.error('Error fetching sites:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch domains' },
      { status: 500 }
    )
  }
}

// POST /api/domains - Create a new domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    if (!body.domain) {
      return NextResponse.json(
        { error: 'Domain is required' },
        { status: 400 }
      )
    }
    
    // Clean up domain (remove protocol if provided)
    let domain = body.domain.toLowerCase().trim()
    domain = domain.replace(/^https?:\/\//, '')
    domain = domain.replace(/\/$/, '')
    
    // Basic domain validation
    const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/
    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: 'Invalid domain format' },
        { status: 400 }
      )
    }
    
    const input: CreateSiteInput = {
      domain,
      origin: body.origin || `https://${domain}`,
      cache_freshness_seconds: body.cache_freshness_seconds
    }
    
    const site = await createSite(input)
    
    return NextResponse.json(site, { status: 201 })
  } catch (error) {
    console.error('Error creating site:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (error.message.includes('Domain limit reached')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        )
      }
      
      if (error.message === 'This domain is already registered') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create domain' },
      { status: 500 }
    )
  }
}
