import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Admin client — uses service role key, runs server-side only
const adminSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { ids }: { ids: string[] } = await req.json();

    if (!ids || ids.length === 0) {
      return NextResponse.json({});
    }

    // Fetch all users in parallel
    const results = await Promise.allSettled(
      ids.map((id) => adminSupabase.auth.admin.getUserById(id))
    );

    const userMap: Record<string, { email: string; full_name: string }> = {};

    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value.data.user) {
        const user = result.value.data.user;
        userMap[ids[index]] = {
          email: user.email ?? '',
          full_name:
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split('@')[0] ||
            'Unknown',
        };
      }
    });

    return NextResponse.json(userMap);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
