import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email } = await request.json();
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${request.headers.get('origin')}/auth/callback?next=/auth/update-password`,
  });

  if (error) {
    console.error('Error sending password reset email:', error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: 'Password reset email sent.' });
}
