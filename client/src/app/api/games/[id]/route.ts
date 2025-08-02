import { createSupabaseServer } from '@/utils/supabase/server'

import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params
  const supabase = await createSupabaseServer()
  const { data: game, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(game)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params
  const supabase = await createSupabaseServer()
  
  try {
    const formData = await request.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const isActive = formData.get('is_active') === 'true'
    
    // 更新遊戲基本資料
    const { data: gameData, error: gameError } = await supabase
      .from('games')
      .update({ 
        name, 
        description,
        is_active: isActive 
      })
      .eq('id', resolvedParams.id)
      .select()

    if (gameError) {
      return NextResponse.json({ error: gameError.message }, { status: 500 })
    }

    // 處理選項更新
    // 先刪除現有的選項
    await supabase
      .from('game_options')
      .delete()
      .eq('game_id', resolvedParams.id)

    // 添加新的選項
    const options = []
    let index = 0
    while (formData.get(`options[${index}][name]`)) {
      const optionName = formData.get(`options[${index}][name]`) as string
      const optionPrice = formData.get(`options[${index}][price]`) as string
      
      options.push({
        game_id: parseInt(resolvedParams.id),
        name: optionName,
        price: parseFloat(optionPrice)
      })
      index++
    }

    if (options.length > 0) {
      const { error: optionsError } = await supabase
        .from('game_options')
        .insert(options)

      if (optionsError) {
        return NextResponse.json({ error: optionsError.message }, { status: 500 })
      }
    }

    return NextResponse.json(gameData)
  } catch (error) {
    console.error('Error updating game:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const resolvedParams = await params
  const supabase = await createSupabaseServer()
  const { error } = await supabase.from('games').delete().eq('id', resolvedParams.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(null, { status: 204 })
}