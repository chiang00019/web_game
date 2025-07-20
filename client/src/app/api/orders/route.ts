import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Get orders with related data (user profile, game info, game packages)
  const { data: orders, error } = await supabase
    .from('order')
    .select(`
      *,
      profiles!order_user_id_fkey(user_name),
      game_packages!order_package_id_fkey(
        name,
        price,
        game!game_packages_game_id_fkey(name)
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(orders)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const orderData = await request.json()

  const { data, error } = await supabase
    .from('order')
    .insert(orderData)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
