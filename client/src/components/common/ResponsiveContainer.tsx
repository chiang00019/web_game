'use client'

import { ReactNode } from 'react'

interface ResponsiveContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  background?: 'none' | 'dark' | 'darker'
}

export default function ResponsiveContainer({
  children,
  className = '',
  maxWidth = 'lg',
  padding = 'md',
  background = 'none'
}: ResponsiveContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    '2xl': 'max-w-7xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: 'px-3 py-2 sm:px-4 sm:py-3',
    md: 'px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8',
    lg: 'px-6 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12'
  }

  const backgroundClasses = {
    none: '',
    dark: 'bg-[#2a2d4e]',
    darker: 'bg-[#1a1b2e]'
  }

  return (
    <div 
      className={`
        mx-auto w-full 
        ${maxWidthClasses[maxWidth]} 
        ${paddingClasses[padding]} 
        ${backgroundClasses[background]}
        ${className}
      `}
    >
      {children}
    </div>
  )
} 