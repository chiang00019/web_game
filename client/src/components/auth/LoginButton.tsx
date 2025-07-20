'use client'

import Link from 'next/link'

export default function LoginButton() {
  return (
    <Link
      href="/auth"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover text-white"
    >
      登入
    </Link>
  )
} 