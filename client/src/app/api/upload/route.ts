import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { existsSync, mkdirSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: '沒有檔案' }, { status: 400 })
    }

    // 檢查檔案類型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '只能上傳圖片檔案' }, { status: 400 })
    }

    // 檢查檔案大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: '檔案大小不能超過 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 建立上傳目錄
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'banners')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // 產生唯一檔名
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${timestamp}_${originalName}`
    const filePath = join(uploadDir, fileName)

    // 儲存檔案
    await writeFile(filePath, buffer)

    // 回傳檔案 URL
    const fileUrl = `/uploads/banners/${fileName}`
    
    return NextResponse.json({ 
      url: fileUrl,
      message: '檔案上傳成功' 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: '檔案上傳失敗' },
      { status: 500 }
    )
  }
}