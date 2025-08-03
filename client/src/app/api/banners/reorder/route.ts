import { createSupabaseServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function PUT(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    const { banners } = await request.json()

    if (!banners || !Array.isArray(banners)) {
      return NextResponse.json({ error: '無效的資料格式' }, { status: 400 })
    }

    // 批量更新每個 banner 的 display_order
    const updatePromises = banners.map((banner: any) => 
      supabase
        .from('banner')
        .update({ display_order: banner.display_order })
        .eq('banner_id', banner.banner_id || banner.id)
    )

    const results = await Promise.all(updatePromises)
    
    // 檢查是否有錯誤
    const errors = results.filter(result => result.error)
    if (errors.length > 0) {
      console.error('Update errors:', errors)
      return NextResponse.json({ error: '更新順序失敗' }, { status: 500 })
    }

    return NextResponse.json({ message: '順序更新成功' })
  } catch (error) {
    console.error('Reorder error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}