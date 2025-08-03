import { createSupabaseServer } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createSupabaseServer()
    const { tagIds } = await request.json()

    // 先刪除現有的標籤關聯
    const { error: deleteError } = await supabase
      .from('game_tags')
      .delete()
      .eq('game_id', params.id)

    if (deleteError) {
      console.error('Error deleting existing tags:', deleteError)
      return NextResponse.json({ error: '刪除現有標籤失敗' }, { status: 500 })
    }

    // 如果有新標籤，則新增
    if (tagIds && tagIds.length > 0) {
      const gameTagsData = tagIds.map((tagId: number) => ({
        game_id: parseInt(params.id),
        tag_id: tagId
      }))

      const { error: insertError } = await supabase
        .from('game_tags')
        .insert(gameTagsData)

      if (insertError) {
        console.error('Error inserting new tags:', insertError)
        return NextResponse.json({ error: '新增標籤失敗' }, { status: 500 })
      }
    }

    return NextResponse.json({ message: '標籤更新成功' })
  } catch (error) {
    console.error('Tags update error:', error)
    return NextResponse.json({ error: '伺服器錯誤' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string; tag_id: string } }
) {
  const supabase = await createSupabaseServer()

  const { error } = await supabase
    .from('game_tags')
    .delete()
    .eq('game_id', params.id)
    .eq('tag_id', params.tag_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}