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
  
  // 檢查用戶認證
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: '未授權：請先登入' }, { status: 401 })
  }

  try {
    const orderData = await request.json()
    
    // 驗證必要欄位
    const { game_id, package_id, payment_method_id, game_uid, game_server } = orderData
    if (!game_id || !package_id || !payment_method_id || !game_uid) {
      return NextResponse.json({ 
        error: '缺少必要欄位：game_id, package_id, payment_method_id, game_uid' 
      }, { status: 400 })
    }

    // 準備訂單資料，確保使用當前用戶的ID
    const newOrderData = {
      user_id: user.id,
      game_id: parseInt(game_id),
      package_id: parseInt(package_id),
      payment_method_id: parseInt(payment_method_id),
      game_uid,
      game_server: game_server || null,
      game_username: orderData.game_username || null,
      note: orderData.note || null,
      status: 'pending'
    }

    const { data, error } = await supabase
      .from('order')
      .insert(newOrderData)
      .select(`
        *,
        game_packages!order_package_id_fkey(
          name,
          price,
          game!game_packages_game_id_fkey(game_name)
        ),
        payment_method!order_payment_method_id_fkey(method)
      `)
      .single()

    if (error) {
      console.error('Order creation error:', error)
      return NextResponse.json({ error: '訂單建立失敗' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
    
  } catch (error) {
    console.error('Order API error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}
