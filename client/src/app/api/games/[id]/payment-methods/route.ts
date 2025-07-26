import { createSupabaseServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createSupabaseServer()
  
  const { data: paymentMethods, error } = await supabase
    .from('allow_payment_method')
    .select(`
      payment_method:payment_method_id(
        payment_method_id,
        method
      )
    `)
    .eq('game_id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 扁平化結果
  const activePaymentMethods = paymentMethods
    ?.map(item => item.payment_method)
    .filter(method => method !== null)

  return NextResponse.json(activePaymentMethods)
} 