import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID!;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET!;

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect('/dashboard/domains?error=missing_code');
  }

  try {
    // Decode state to get siteId
    const { siteId } = JSON.parse(Buffer.from(state, 'base64').toString());
    
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token');
    }

    // Get user info and repositories
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const userData = await userResponse.json();

    // Get user's repositories
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    const repos = await reposResponse.json();

    // For now, we'll use a hardcoded user ID since auth isn't implemented yet
    // In production, this should come from authenticated session
    const userId = 'temp-user-id'; // This will be replaced with actual auth later
    
    // Store GitHub connection in database
    const { error: connectionError } = await supabase
      .from('github_connections')
      .upsert({
        site_id: siteId,
        user_id: userId, // This will be replaced with actual user ID
        installation_id: userData.id.toString(),
        is_active: true,
        connected_at: new Date().toISOString(),
      });

    if (connectionError) {
      console.error('Error storing GitHub connection:', connectionError);
      return NextResponse.redirect(`/dashboard/domains/${siteId}?error=connection_failed`);
    }

    // Store access token in session (temporarily, for repo selection)
    // In production, consider using encrypted cookies or session storage
    const response = NextResponse.redirect(`/dashboard/domains/${siteId}/connect-repo?success=true`);
    response.cookies.set('github_token', tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60, // 1 hour
    });
    response.cookies.set('github_username', userData.login, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.redirect('/dashboard/domains?error=oauth_failed');
  }
}
