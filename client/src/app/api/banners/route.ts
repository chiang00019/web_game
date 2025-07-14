
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Helper to check for admin privileges
async function isAdmin(supabase: any) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();
    return !error && profile?.is_admin;
}

// GET all banners
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('banner')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST a new banner (Admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  const { title, content, image_url, link_url } = await request.json();

  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields: title and content' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('banner')
    .insert([{ title, content, image_url, link_url }])
    .select()
    .single();

  if (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH to update a banner (Admin only)
export async function PATCH(request: Request) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }
  
    const { banner_id, ...updateData } = await request.json();
  
    if (!banner_id) {
      return NextResponse.json({ error: 'Missing banner_id' }, { status: 400 });
    }
  
    const { data, error } = await supabase
      .from('banner')
      .update(updateData)
      .eq('banner_id', banner_id)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating banner:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json(data);
  }
  
// DELETE a banner (Admin only)
export async function DELETE(request: Request) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { banner_id } = await request.json();

    if (!banner_id) {
        return NextResponse.json({ error: 'Missing banner_id' }, { status: 400 });
    }

    const { error } = await supabase.from('banner').delete().eq('banner_id', banner_id);

    if (error) {
        console.error('Error deleting banner:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Banner deleted successfully' });
}
