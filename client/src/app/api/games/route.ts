import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createSupabaseServer()
  const { data: games, error } = await supabase.from('games').select('*')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(games)
}

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServer()
    
    // 檢查用戶是否已登入且為管理員
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: '未授權' }, { status: 401 })
    }

    // 檢查是否為管理員
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: '需要管理員權限' }, { status: 403 })
    }
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const isActiveStr = formData.get('is_active') as string
    const isActive = isActiveStr === 'true'
    const iconFile = formData.get('icon') as File | null
    const serversStr = formData.get('servers') as string
    const servers = serversStr ? JSON.parse(serversStr) : []
    
    // 處理遊戲圖片上傳
    let icon_path = null
    if (iconFile) {
      // 這裡需要實作檔案上傳邏輯，暫時設為 null
      // 可以上傳到 Supabase Storage 或其他檔案服務
      icon_path = `/uploads/games/${Date.now()}_${iconFile.name}`
    }
    
    // 創建遊戲
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .insert([{ 
        name, 
        description,
        icon_path,
        servers,
        is_active: isActive 
      }])
      .select()
      .single()

    if (gameError) {
      return NextResponse.json({ error: gameError.message }, { status: 500 })
    }

    // 處理遊戲選項
    const options = []
    let optionIndex = 0
    
    while (formData.get(`options[${optionIndex}][name]`)) {
      const optionName = formData.get(`options[${optionIndex}][name]`) as string
      const optionPrice = formData.get(`options[${optionIndex}][price]`) as string
      const optionIcon = formData.get(`options[${optionIndex}][icon]`) as File | null
      
      let option_icon_path = null
      if (optionIcon) {
        // 處理選項圖片上傳
        option_icon_path = `/uploads/options/${Date.now()}_${optionIcon.name}`
      }
      
      if (optionName && optionPrice) {
        options.push({
          game_id: gameData.id,
          name: optionName,
          price: parseFloat(optionPrice),
          icon_path: option_icon_path
        })
      }
      
      optionIndex++
    }
    
    // 批量插入遊戲選項
    if (options.length > 0) {
      const { error: optionsError } = await supabase
        .from('game_options')
        .insert(options)
      
      if (optionsError) {
        // 如果選項插入失敗，刪除已創建的遊戲
        await supabase.from('games').delete().eq('id', gameData.id)
        return NextResponse.json({ error: optionsError.message }, { status: 500 })
      }
    }

    console.log('Created game data:', gameData) // 調試用
    return NextResponse.json({ 
      message: 'Game created successfully',
      game: gameData 
    })
    
  } catch (error) {
    console.error('Error creating game:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}