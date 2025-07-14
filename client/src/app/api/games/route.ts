
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET all games
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('game')
    .select('*')
    .order('game_id', { ascending: true });

  if (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST a new game (Admin only)
export async function POST(request: Request) {
  const supabase = await createClient();

  // Check if user is an admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile?.is_admin) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  // If admin, proceed to create game
  const { name, category, icon } = await request.json();

  if (!name || !category) {
    return NextResponse.json({ error: 'Missing required fields: name and category' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('game')
    .insert([{ game_name: name, category, icon }])
    .select()
    .single();

  if (error) {
    console.error('Error creating game:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PATCH to update a game (e.g., toggle active status) (Admin only)
export async function PATCH(request: Request) {
    const supabase = await createClient();
  
    // Admin check (similar to POST)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile, error: profileError } = await supabase.from('profiles').select('is_admin').eq('user_id', user.id).single();
    if (profileError || !profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  
    const { game_id, ...updateData } = await request.json();
  
    if (!game_id) {
      return NextResponse.json({ error: 'Missing game_id' }, { status: 400 });
    }
  
    const { data, error } = await supabase
      .from('game')
      .update(updateData)
      .eq('game_id', game_id)
      .select()
      .single();
  
    if (error) {
      console.error('Error updating game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json(data);
  }
  
  // DELETE a game (Admin only)
  export async function DELETE(request: Request) {
    const supabase = await createClient();
  
    // Admin check (similar to POST)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { data: profile, error: profileError } = await supabase.from('profiles').select('is_admin').eq('user_id', user.id).single();
    if (profileError || !profile?.is_admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  
    const { game_id } = await request.json();
  
    if (!game_id) {
      return NextResponse.json({ error: 'Missing game_id' }, { status: 400 });
    }
  
    const { error } = await supabase.from('game').delete().eq('game_id', game_id);
  
    if (error) {
      console.error('Error deleting game:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Game deleted successfully' });
  }
