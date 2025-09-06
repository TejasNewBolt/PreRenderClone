import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// GitHub OAuth App configuration
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;
const GITHUB_REDIRECT_URI = process.env.NEXT_PUBLIC_API_URL + '/api/github/callback';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const siteId = searchParams.get('siteId');
  
  if (!siteId) {
    return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
  }

  // Store siteId in state parameter for callback
  const state = Buffer.from(JSON.stringify({ siteId })).toString('base64');
  
  // GitHub OAuth authorization URL
  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
  githubAuthUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI);
  githubAuthUrl.searchParams.append('scope', 'repo webhook');
  githubAuthUrl.searchParams.append('state', state);

  return NextResponse.redirect(githubAuthUrl.toString());
}
