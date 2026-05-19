import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use a raw Supabase client without user auth context
// This allows reading public trees regardless of who owns them

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // Query without any user session — uses anon role
  const { data, error } = await supabaseAdmin
    .from('trees')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: 'Tree not found or is private' },
      { status: 404 }
    );
  }

  const tree = {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    is_public: data.is_public,
    persons: (data.data as any).persons || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };

  return NextResponse.json(tree);
}
