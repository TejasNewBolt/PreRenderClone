import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify GitHub webhook signature
function verifyWebhookSignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature) return false;
  
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  
  // Use timingSafeEqual to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    const payload = await request.text();

    if (!event) {
      return NextResponse.json({ error: 'Missing event header' }, { status: 400 });
    }

    // Parse the payload
    const data = JSON.parse(payload);
    
    // Get repository info
    const repoFullName = data.repository?.full_name;
    
    if (!repoFullName) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Find the site by repository
    const { data: connection, error: connectionError } = await supabase
      .from('github_connections')
      .select('*, sites(*)')
      .eq('repo_full_name', repoFullName)
      .eq('is_active', true)
      .single();

    if (connectionError || !connection) {
      console.error('No active connection found for repository:', repoFullName);
      return NextResponse.json({ error: 'Repository not connected' }, { status: 404 });
    }

    // Verify webhook signature
    if (connection.webhook_secret) {
      const isValid = verifyWebhookSignature(payload, signature, connection.webhook_secret);
      if (!isValid) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const site = connection.sites;
    const userId = connection.user_id;

    // Handle different GitHub events
    switch (event) {
      case 'push':
        // Handle push event
        const branch = data.ref?.replace('refs/heads/', '');
        
        // Only process pushes to the default branch
        if (branch !== connection.default_branch) {
          return NextResponse.json({ 
            message: `Ignored push to non-default branch: ${branch}` 
          });
        }

        // Create a new build record
        const buildId = data.after || crypto.randomBytes(16).toString('hex');
        
        const { error: buildError } = await supabase
          .from('builds')
          .insert({
            id: buildId,
            site_id: site.id,
            user_id: userId,
            status: 'queued',
            uploaded_by: data.pusher?.name || 'github',
            created_at: new Date().toISOString(),
          });

        if (buildError) {
          console.error('Error creating build:', buildError);
          return NextResponse.json(
            { error: 'Failed to create build' },
            { status: 500 }
          );
        }

        // Log the render event
        await supabase
          .from('render_logs')
          .insert({
            site_id: site.id,
            user_id: userId,
            build_id: buildId,
            url: site.domain,
            trigger_type: 'webhook',
            queue_type: 'normal',
            status: 'success',
            timestamp: new Date().toISOString(),
          });

        // Update last sync time
        await supabase
          .from('github_connections')
          .update({ last_sync: new Date().toISOString() })
          .eq('site_id', site.id);

        // Here you would trigger the actual build process
        // For now, we'll just mark it as processing
        setTimeout(async () => {
          await supabase
            .from('builds')
            .update({ status: 'processing' })
            .eq('id', buildId);
        }, 1000);

        return NextResponse.json({ 
          success: true,
          message: 'Build triggered',
          buildId,
        });

      case 'pull_request':
        // Handle pull request events (optional)
        const action = data.action;
        
        if (action === 'opened' || action === 'synchronize') {
          // Could trigger preview builds here
          console.log('Pull request event:', action, data.pull_request?.number);
        }
        
        return NextResponse.json({ 
          success: true,
          message: 'Pull request event processed',
        });

      case 'ping':
        // GitHub sends a ping event when webhook is created
        return NextResponse.json({ 
          success: true,
          message: 'Webhook configured successfully',
        });

      default:
        return NextResponse.json({ 
          message: `Event ${event} not handled` 
        });
    }
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
