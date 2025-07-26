import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    const [size, color, bgColor, text] = params.params
    
    // 解析尺寸
    const [width, height] = size.split('x').map(Number)
    
    // 解析顏色
    const textColor = color || 'FFFFFF'
    const backgroundColor = bgColor || '000000'
    
    // 解析文字
    const displayText = text ? decodeURIComponent(text) : `${width}x${height}`
    
    // 生成 SVG 圖片
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#${backgroundColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" 
              fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">
          ${displayText}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder API error:', error)
    return new NextResponse('Error generating placeholder', { status: 500 })
  }
} 