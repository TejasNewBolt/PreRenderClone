import { NextResponse } from 'next/server'
import { getUserRepositories } from '@/lib/services/github'

// GET /api/github/repositories - Get user's GitHub repositories
export async function GET() {
  try {
    const repositories = await getUserRepositories()
    
    return NextResponse.json(repositories)
  } catch (error) {
    console.error('Error fetching repositories:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    )
  }
}
