import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { siteId, repoFullName, defaultBranch } = body;

    if (!siteId || !repoFullName) {
      return NextResponse.json(
        { error: 'Site ID and repository name are required' },
        { status: 400 }
      );
    }

    // Get GitHub token from cookie
    const cookieStore = cookies();
    const githubToken = cookieStore.get('github_token')?.value;
    
    if (!githubToken) {
      return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 });
    }

    // Get current user from Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Verify user owns the site
    const { data: site, error: siteError } = await supabase
      .from('sites')
      .select('*')
      .eq('id', siteId)
      .eq('user_id', user.id)
      .single();

    if (siteError || !site) {
      return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }

    // Generate webhook secret
    const webhookSecret = crypto.randomBytes(32).toString('hex');

    // Create webhook on GitHub repository
    const webhookResponse = await fetch(
      `https://api.github.com/repos/${repoFullName}/hooks`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'web',
          active: true,
          events: ['push', 'pull_request'],
          config: {
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/github`,
            content_type: 'json',
            secret: webhookSecret,
            insecure_ssl: '0',
          },
        }),
      }
    );

    let webhookId = null;
    if (webhookResponse.ok) {
      const webhookData = await webhookResponse.json();
      webhookId = webhookData.id.toString();
    }

    // Update GitHub connection in database
    const { error: updateError } = await supabase
      .from('github_connections')
      .upsert({
        site_id: siteId,
        user_id: user.id,
        repo_full_name: repoFullName,
        default_branch: defaultBranch || 'main',
        webhook_id: webhookId,
        webhook_secret: webhookSecret,
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
      });

    if (updateError) {
      console.error('Error updating GitHub connection:', updateError);
      return NextResponse.json(
        { error: 'Failed to save repository connection' },
        { status: 500 }
      );
    }

    // Update site with repo information
    const { error: siteUpdateError } = await supabase
      .from('sites')
      .update({
        repo_url: `https://github.com/${repoFullName}`,
        repo_branch: defaultBranch || 'main',
        webhook_secret: webhookSecret,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId);

    if (siteUpdateError) {
      console.error('Error updating site:', siteUpdateError);
    }

    // Clear GitHub token cookie after successful connection
    const response = NextResponse.json({ 
      success: true,
      message: 'Repository connected successfully',
      webhookConfigured: !!webhookId,
    });
    
    response.cookies.delete('github_token');
    response.cookies.delete('github_username');

    return response;
  } catch (error) {
    console.error('Error connecting repository:', error);
    return NextResponse.json(
      { error: 'Failed to connect repository' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!siteId) {
      return NextResponse.json({ error: 'Site ID is required' }, { status: 400 });
    }

    // Get current user from Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // Get GitHub connection
    const { data: connection, error: connectionError } = await supabase
      .from('github_connections')
      .select('*')
      .eq('site_id', siteId)
      .eq('user_id', user.id)
      .single();

    if (connectionError || !connection) {
      return NextResponse.json({ error: 'Connection not found' }, { status: 404 });
    }

    // Get GitHub token (may need to re-authenticate)
    const cookieStore = cookies();
    const githubToken = cookieStore.get('github_token')?.value;

    // Try to remove webhook if we have a token and webhook ID
    if (githubToken && connection.webhook_id && connection.repo_full_name) {
      try {
        await fetch(
          `https://api.github.com/repos/${connection.repo_full_name}/hooks/${connection.webhook_id}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${githubToken}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
      } catch (error) {
        console.error('Error removing webhook:', error);
      }
    }

    // Delete GitHub connection
    const { error: deleteError } = await supabase
      .from('github_connections')
      .delete()
      .eq('site_id', siteId)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: 'Failed to disconnect repository' },
        { status: 500 }
      );
    }

    // Clear repo info from site
    await supabase
      .from('sites')
      .update({
        repo_url: null,
        repo_branch: 'main',
        webhook_secret: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId);

    return NextResponse.json({ 
      success: true,
      message: 'Repository disconnected successfully',
    });
  } catch (error) {
    console.error('Error disconnecting repository:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect repository' },
      { status: 500 }
    );
  }
}
