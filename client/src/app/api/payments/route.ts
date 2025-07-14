
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

// GET all payment methods
export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('payment_method')
    .select('*')
    .order('payment_method_id', { ascending: true });

  if (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST a new payment method (Admin only)
export async function POST(request: Request) {
  const supabase = await createClient();
  if (!(await isAdmin(supabase))) {
    return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  }

  const { method } = await request.json();

  if (!method) {
    return NextResponse.json({ error: 'Missing required field: method' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('payment_method')
    .insert([{ method }])
    .select()
    .single();

  if (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a payment method (Admin only)
export async function DELETE(request: Request) {
    const supabase = await createClient();
    if (!(await isAdmin(supabase))) {
        return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
    }

    const { payment_method_id } = await request.json();

    if (!payment_method_id) {
        return NextResponse.json({ error: 'Missing payment_method_id' }, { status: 400 });
    }

    const { error } = await supabase.from('payment_method').delete().eq('payment_method_id', payment_method_id);

    if (error) {
        console.error('Error deleting payment method:', error);
        // You might want to check for specific errors, e.g., foreign key violation
        if (error.code === '23503') {
            return NextResponse.json({ error: 'Cannot delete this payment method because it is currently used in existing orders.' }, { status: 409 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Payment method deleted successfully' });
}
