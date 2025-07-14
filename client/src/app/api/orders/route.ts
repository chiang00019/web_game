
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

// GET all orders (Admin only)
export async function GET(request: Request) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    // Join with games and profiles to get more details
    const { data, error } = await supabase
        .from('order')
        .select(`
            *,
            game:game_id (game_name, icon),
            profile:user_id (user_name, phone_no)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching orders:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PATCH to update an order (e.g., change status) (Admin only)
export async function PATCH(request: Request) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { order_id, ...updateData } = await request.json();

    if (!order_id) {
        return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('order')
        .update(updateData)
        .eq('order_id', order_id)
        .select()
        .single();

    if (error) {
        console.error('Error updating order:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
