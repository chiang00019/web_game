'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export interface AccessibilityOptions {
  enableFocusManagement?: boolean
  enableKeyboardNavigation?: boolean
  enableAnnouncements?: boolean
  focusReturnElement?: HTMLElement | null
}

export function useAccessibility(options: AccessibilityOptions = {}) {
  const {
    enableFocusManagement = true,
    enableKeyboardNavigation = true,
    enableAnnouncements = true,
    focusReturnElement = null
  } = options

  const [announceMessage, setAnnounceMessage] = useState('')
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const trapRef = useRef<HTMLElement | null>(null)

  // 儲存焦點並設定焦點陷阱
  const trapFocus = useCallback((element: HTMLElement) => {
    if (!enableFocusManagement) return

    // 儲存當前焦點
    previousFocusRef.current = document.activeElement as HTMLElement
    trapRef.current = element

    // 找到所有可聚焦的元素
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )

    if (focusableElements.length > 0) {
      ;(focusableElements[0] as HTMLElement).focus()
    }
  }, [enableFocusManagement])

  // 釋放焦點陷阱
  const releaseFocus = useCallback(() => {
    if (!enableFocusManagement) return

    trapRef.current = null
    
    // 恢復焦點到之前的元素或指定的元素
    const elementToFocus = focusReturnElement || previousFocusRef.current
    if (elementToFocus) {
      elementToFocus.focus()
    }
  }, [enableFocusManagement, focusReturnElement])

  // 鍵盤事件處理
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enableKeyboardNavigation || !trapRef.current) return

    const focusableElements = Array.from(
      trapRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[]

    if (focusableElements.length === 0) return

    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement)

    switch (event.key) {
      case 'Tab':
        event.preventDefault()
        if (event.shiftKey) {
          // Shift+Tab - 往前
          const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
          focusableElements[prevIndex].focus()
        } else {
          // Tab - 往後
          const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
          focusableElements[nextIndex].focus()
        }
        break

      case 'ArrowDown':
      case 'ArrowRight':
        event.preventDefault()
        const nextIndex = currentIndex >= focusableElements.length - 1 ? 0 : currentIndex + 1
        focusableElements[nextIndex].focus()
        break

      case 'ArrowUp':
      case 'ArrowLeft':
        event.preventDefault()
        const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1
        focusableElements[prevIndex].focus()
        break

      case 'Home':
        event.preventDefault()
        focusableElements[0].focus()
        break

      case 'End':
        event.preventDefault()
        focusableElements[focusableElements.length - 1].focus()
        break
    }
  }, [enableKeyboardNavigation])

  // 設定鍵盤事件監聽
  useEffect(() => {
    if (enableKeyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [enableKeyboardNavigation, handleKeyDown])

  // 螢幕閱讀器公告
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!enableAnnouncements) return

    setAnnounceMessage(message)
    
    // 清除訊息以確保重複的訊息也能被讀出
    setTimeout(() => setAnnounceMessage(''), 1000)
  }, [enableAnnouncements])

  // 取得 ARIA 屬性
  const getAriaProps = useCallback((props: {
    label?: string
    labelledBy?: string
    describedBy?: string
    expanded?: boolean
    selected?: boolean
    checked?: boolean
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    live?: 'polite' | 'assertive' | 'off'
    atomic?: boolean
    relevant?: string
  }) => {
    const ariaProps: Record<string, any> = {}

    if (props.label) ariaProps['aria-label'] = props.label
    if (props.labelledBy) ariaProps['aria-labelledby'] = props.labelledBy
    if (props.describedBy) ariaProps['aria-describedby'] = props.describedBy
    if (props.expanded !== undefined) ariaProps['aria-expanded'] = props.expanded
    if (props.selected !== undefined) ariaProps['aria-selected'] = props.selected
    if (props.checked !== undefined) ariaProps['aria-checked'] = props.checked
    if (props.disabled !== undefined) ariaProps['aria-disabled'] = props.disabled
    if (props.required !== undefined) ariaProps['aria-required'] = props.required
    if (props.invalid !== undefined) ariaProps['aria-invalid'] = props.invalid
    if (props.live) ariaProps['aria-live'] = props.live
    if (props.atomic !== undefined) ariaProps['aria-atomic'] = props.atomic
    if (props.relevant) ariaProps['aria-relevant'] = props.relevant

    return ariaProps
  }, [])

  // 產生唯一 ID
  const generateId = useCallback((prefix: string = 'a11y') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // 表單欄位無障礙屬性
  const getFormFieldProps = useCallback((options: {
    label: string
    error?: string
    description?: string
    required?: boolean
    invalid?: boolean
  }) => {
    const id = generateId('field')
    const labelId = `${id}-label`
    const errorId = options.error ? `${id}-error` : undefined
    const descId = options.description ? `${id}-desc` : undefined

    const describedBy = [descId, errorId].filter(Boolean).join(' ')

    return {
      field: {
        id,
        'aria-labelledby': labelId,
        'aria-describedby': describedBy || undefined,
        'aria-required': options.required || undefined,
        'aria-invalid': options.invalid || undefined
      },
      label: {
        id: labelId,
        htmlFor: id
      },
      error: errorId ? {
        id: errorId,
        'aria-live': 'polite' as const
      } : {},
      description: descId ? {
        id: descId
      } : {}
    }
  }, [generateId])

  return {
    trapFocus,
    releaseFocus,
    announce,
    getAriaProps,
    generateId,
    getFormFieldProps,
    announceMessage
  }
}



// 高對比度切換
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('high-contrast')
    setIsHighContrast(saved === 'true')
  }, [])

  const toggleHighContrast = () => {
    const newValue = !isHighContrast
    setIsHighContrast(newValue)
    localStorage.setItem('high-contrast', String(newValue))
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast')
    }
  }, [isHighContrast])

  return { isHighContrast, toggleHighContrast }
}

// 減少動畫偏好
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return prefersReducedMotion
} 