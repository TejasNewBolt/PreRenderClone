import { NextRequest, NextResponse } from 'next/server'
import { 
  connectRepository, 
  disconnectRepository, 
  getRepositoryConnection,
  getUserRepositories 
} from '@/lib/services/github'

// GET /api/domains/[id]/repository - Get repository connection
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const connection = await getRepositoryConnection(params.id)
    
    if (!connection) {
      return NextResponse.json(
        { connected: false },
        { status: 200 }
      )
    }
    
    return NextResponse.json({
      connected: true,
      connection
    })
  } catch (error) {
    console.error('Error fetching repository connection:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch repository connection' },
      { status: 500 }
    )
  }
}

// POST /api/domains/[id]/repository - Connect repository
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    if (!body.repo_full_name) {
      return NextResponse.json(
        { error: 'Repository name is required' },
        { status: 400 }
      )
    }
    
    const connection = await connectRepository(
      params.id,
      body.repo_full_name,
      body.default_branch || 'main'
    )
    
    return NextResponse.json(connection, { status: 201 })
  } catch (error) {
    console.error('Error connecting repository:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Not authenticated') {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        )
      }
      
      if (error.message === 'Site not found or access denied') {
        return NextResponse.json(
          { error: 'Domain not found' },
          { status: 404 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to connect repository' },
      { status: 500 }
    )
  }
}

// DELETE /api/domains/[id]/repository - Disconnect repository
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await disconnectRepository(params.id)
    
    return NextResponse.json(
      { message: 'Repository disconnected successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error disconnecting repository:', error)
    
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to disconnect repository' },
      { status: 500 }
    )
  }
}
