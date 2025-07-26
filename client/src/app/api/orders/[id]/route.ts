import { createSupabaseServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServer()
  const { status } = await request.json()

  // Update order status
  const { data, error } = await supabase
    .from('order')
    .update({ status })
    .eq('id', params.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If status is updated to 'paid', this is where we would trigger
  // the value-adding script hook in future phases
  if (status === 'completed') {
    console.log(`Order ${params.id} marked as completed - ready for value-adding script`)
  }

  return NextResponse.json(data)
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServer()
  
  const { data: order, error } = await supabase
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
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(order)
} 