import { NextRequest, NextResponse } from 'next/server'
import { getVerificationInstructions, verifyDomain } from '@/lib/services/verification'

// GET /api/domains/[id]/verify - Get verification instructions
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const instructions = await getVerificationInstructions(params.id)
    
    return NextResponse.json({
      instructions,
      siteId: params.id
    })
  } catch (error) {
    console.error('Error fetching verification instructions:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (error.message === 'Site not found') {
        return NextResponse.json(
          { error: 'Domain not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch verification instructions' },
      { status: 500 }
    )
  }
}

// POST /api/domains/[id]/verify - Trigger domain verification
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validate verification method
    const validMethods = ['dns_txt', 'meta_tag', 'file']
    if (!body.method || !validMethods.includes(body.method)) {
      return NextResponse.json(
        { error: 'Invalid verification method' },
        { status: 400 }
      )
    }
    
    const result = await verifyDomain(params.id, body.method)
    
    return NextResponse.json(result, { 
      status: result.success ? 200 : 422 
    })
  } catch (error) {
    console.error('Error verifying domain:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (error.message === 'Site not found') {
        return NextResponse.json(
          { error: 'Domain not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to verify domain' },
      { status: 500 }
    )
  }
}
