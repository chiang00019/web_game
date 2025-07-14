
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

export async function GET(request: Request) {
    const supabase = await createClient();

    // Admin check
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('game_id');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Call the RPC function
    const { data, error } = await supabase.rpc('get_top_customers', {
        p_game_id: gameId ? parseInt(gameId) : null,
        p_start_date: startDate,
        p_end_date: endDate,
    });

    if (error) {
        console.error('Error fetching top customers report:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
