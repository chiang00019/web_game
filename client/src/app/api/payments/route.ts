import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: paymentMethods, error } = await supabase
    .from('payment_method')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(paymentMethods)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const paymentMethod = await request.json()

  const { data, error } = await supabase
    .from('payment_method')
    .insert(paymentMethod)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
} 