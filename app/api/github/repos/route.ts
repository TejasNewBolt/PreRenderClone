import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// This route needs to be dynamic because it uses cookies
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Get GitHub token from cookie
    const cookieStore = cookies();
    const githubToken = cookieStore.get('github_token')?.value;
    
    if (!githubToken) {
      return NextResponse.json({ error: 'Not authenticated with GitHub' }, { status: 401 });
    }

    // Fetch user's repositories from GitHub
    const reposResponse = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        'Authorization': `Bearer ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    if (!reposResponse.ok) {
      throw new Error('Failed to fetch repositories');
    }

    const repos = await reposResponse.json();

    // Format repository data
    const formattedRepos = repos.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      fullName: repo.full_name,
      description: repo.description,
      private: repo.private,
      defaultBranch: repo.default_branch,
      url: repo.html_url,
      cloneUrl: repo.clone_url,
      language: repo.language,
      updatedAt: repo.updated_at,
      owner: {
        login: repo.owner.login,
        avatarUrl: repo.owner.avatar_url,
      },
    }));

    return NextResponse.json({ repositories: formattedRepos });
  } catch (error) {
    console.error('Error fetching repositories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch repositories' },
      { status: 500 }
    );
  }
}
