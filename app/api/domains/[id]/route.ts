import { NextRequest, NextResponse } from 'next/server'
import { getSiteById, deleteSite, updateSiteVerification } from '@/lib/services/domain'

// GET /api/domains/[id] - Get a single domain
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const site = await getSiteById(params.id)
    
    if (!site) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(site)
  } catch (error) {
    console.error('Error fetching site:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch domain' },
      { status: 500 }
    )
  }
}

// DELETE /api/domains/[id] - Delete a domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteSite(params.id)
    
    return NextResponse.json(
      { message: 'Domain deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting site:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to delete domain' },
      { status: 500 }
    )
  }
}

// PATCH /api/domains/[id] - Update domain (currently only verification status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // For now, we only support updating verification status
    if (body.verification_status) {
      if (!['verified', 'failed'].includes(body.verification_status)) {
        return NextResponse.json(
          { error: 'Invalid verification status' },
          { status: 400 }
        )
      }
      
      await updateSiteVerification(params.id, body.verification_status)
    }
    
    // Get updated site
    const site = await getSiteById(params.id)
    
    if (!site) {
      return NextResponse.json(
        { error: 'Domain not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(site)
  } catch (error) {
    console.error('Error updating site:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update domain' },
      { status: 500 }
    )
  }
}
