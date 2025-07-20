'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface DraftData {
  [key: string]: any
  lastSaved: number
}

interface UseDraftSaveOptions {
  key: string // localStorage key
  expireTime?: number // 過期時間 (毫秒)，預設 24 小時
  autoSaveDelay?: number // 自動儲存延遲 (毫秒)，預設 2 秒
  onRestore?: (data: any) => void // 恢復資料時的回調
  onSave?: (data: any) => void // 儲存時的回調
}

export function useDraftSave<T extends Record<string, any>>(
  initialData: T,
  options: UseDraftSaveOptions
) {
  const {
    key,
    expireTime = 24 * 60 * 60 * 1000, // 24 小時
    autoSaveDelay = 2000, // 2 秒
    onRestore,
    onSave
  } = options

  const [data, setData] = useState<T>(initialData)
  const [hasDraft, setHasDraft] = useState(false)
  const [isAutoSaving, setIsAutoSaving] = useState(false)
  const [draftInfo, setDraftInfo] = useState<{ lastSaved: Date | null, expired: boolean }>({
    lastSaved: null,
    expired: false
  })

  const timeoutRef = useRef<NodeJS.Timeout>()
  const isInitializedRef = useRef(false)

  // 檢查草稿是否存在且有效
  const checkDraft = useCallback(() => {
    try {
      const stored = localStorage.getItem(`draft_${key}`)
      if (!stored) {
        setHasDraft(false)
        setDraftInfo({ lastSaved: null, expired: false })
        return null
      }

      const draftData: DraftData = JSON.parse(stored)
      const now = Date.now()
      const isExpired = now - draftData.lastSaved > expireTime

      setDraftInfo({
        lastSaved: new Date(draftData.lastSaved),
        expired: isExpired
      })

      if (isExpired) {
        localStorage.removeItem(`draft_${key}`)
        setHasDraft(false)
        return null
      }

      setHasDraft(true)
      return draftData
    } catch (error) {
      console.error('檢查草稿失敗:', error)
      localStorage.removeItem(`draft_${key}`)
      setHasDraft(false)
      return null
    }
  }, [key, expireTime])

  // 儲存草稿
  const saveDraft = useCallback((dataToSave: T) => {
    try {
      const draftData: DraftData = {
        ...dataToSave,
        lastSaved: Date.now()
      }
      
      localStorage.setItem(`draft_${key}`, JSON.stringify(draftData))
      setDraftInfo({
        lastSaved: new Date(draftData.lastSaved),
        expired: false
      })
      setHasDraft(true)
      onSave?.(dataToSave)
    } catch (error) {
      console.error('儲存草稿失敗:', error)
    }
  }, [key, onSave])

  // 自動儲存
  const autoSave = useCallback((dataToSave: T) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsAutoSaving(true)
    timeoutRef.current = setTimeout(() => {
      saveDraft(dataToSave)
      setIsAutoSaving(false)
    }, autoSaveDelay)
  }, [saveDraft, autoSaveDelay])

  // 恢復草稿
  const restoreDraft = useCallback(() => {
    const draftData = checkDraft()
    if (draftData) {
      const { lastSaved, ...restData } = draftData
      setData(restData as T)
      onRestore?.(restData)
      return true
    }
    return false
  }, [checkDraft, onRestore])

  // 清除草稿
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(`draft_${key}`)
      setHasDraft(false)
      setDraftInfo({ lastSaved: null, expired: false })
    } catch (error) {
      console.error('清除草稿失敗:', error)
    }
  }, [key])

  // 更新資料並觸發自動儲存
  const updateData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
    const newData = typeof updates === 'function' ? updates(data) : { ...data, ...updates }
    setData(newData)
    
    // 只有在資料有實際內容時才自動儲存
    const hasContent = Object.values(newData).some(value => {
      if (Array.isArray(value)) return value.length > 0
      if (typeof value === 'string') return value.trim() !== ''
      if (typeof value === 'number') return value !== 0
      return value != null
    })

    if (hasContent && isInitializedRef.current) {
      autoSave(newData)
    }
  }, [data, autoSave])

  // 初始化檢查
  useEffect(() => {
    if (!isInitializedRef.current) {
      checkDraft()
      isInitializedRef.current = true
    }
  }, [checkDraft])

  // 清理定時器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // 頁面離開前儲存
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        saveDraft(data)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [data, saveDraft])

  return {
    data,
    updateData,
    hasDraft,
    draftInfo,
    isAutoSaving,
    restoreDraft,
    clearDraft,
    saveDraft: () => saveDraft(data),
    checkDraft
  }
} 