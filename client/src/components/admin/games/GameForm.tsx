'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"

interface GameOption {
  name: string
  icon: File | null
  price: string
}

interface Tag {
  id: number
  name: string
  display_name: string
}

interface Game {
  id?: string
  name: string
  description: string
  servers?: string[]
  options: GameOption[]
  tags?: Tag[]
  availableTags?: Tag[]
}

interface GameFormProps {
  game?: Game
  availableTags?: Tag[]
}

export default function GameForm({ game, availableTags }: GameFormProps) {
  const router = useRouter()
  const [name, setName] = useState(game ? game.name : '')
  const [description, setDescription] = useState(game ? game.description : '')
  const [isActive, setIsActive] = useState(true)
  const [icon, setIcon] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [servers, setServers] = useState<string[]>(game?.servers || [''])
  const [selectedTags, setSelectedTags] = useState<number[]>(
    game?.tags?.map(tag => tag.id) || []
  )
  const [options, setOptions] = useState<GameOption[]>(
    game && game.options && game.options.length > 0 
      ? game.options.map(opt => ({ name: opt.name, icon: null, price: opt.price.toString() }))
      : [{ name: '', icon: null, price: '' }]
  )
  const [optionIconPreviews, setOptionIconPreviews] = useState<Array<string | null>>(
    game && game.options && game.options.length > 0
      ? game.options.map(() => null) // 編輯模式下先不顯示預覽，因為圖片是從伺服器來的
      : [null]
  )

  const handlePriceChange = (index: number, value: string) => {
    // 價格欄位只允許數字和小數點，但不能以小數點開頭
    // 允許的格式：空字串、純數字、數字.數字
    if (value === '' || /^\d+\.?\d*$/.test(value)) {
      handleOptionChange(index, 'price', value)
    }
    // 如果不符合格式，就不更新值（忽略輸入）
  }

  const handleOptionChange = (index: number, field: 'icon' | 'name' | 'price', value: string | File | null) => {
    const newOptions = [...options]
    const newOptionIconPreviews = [...optionIconPreviews]

    if (field === 'icon') {
      if (value instanceof File) {
        const reader = new FileReader()
        reader.onloadend = () => {
          newOptionIconPreviews[index] = reader.result as string
          setOptionIconPreviews(newOptionIconPreviews)
        }
        reader.readAsDataURL(value)
      } else {
        newOptionIconPreviews[index] = null
        setOptionIconPreviews(newOptionIconPreviews)
      }
    }

    if (field === 'icon') {
      newOptions[index][field] = value as File | null;
    } else {
      newOptions[index][field] = value as string;
    }
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, { name: '', icon: null, price: '' }])
  }

  const addServer = () => {
    setServers([...servers, ''])
  }

  const removeServer = (index: number) => {
    if (servers.length <= 1) {
      alert('遊戲必須至少有一個伺服器，無法刪除')
      return
    }
    
    const newServers = [...servers]
    newServers.splice(index, 1)
    setServers(newServers)
  }

  const handleServerChange = (index: number, value: string) => {
    const newServers = [...servers]
    newServers[index] = value
    setServers(newServers)
  }

  const handleTagToggle = (tagId: number) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const removeOption = (index: number) => {
    // 確保至少保留一個選項
    if (options.length <= 1) {
      alert('遊戲必須至少有一個選項，無法刪除')
      return
    }
    
    const newOptions = [...options]
    const newOptionIconPreviews = [...optionIconPreviews]
    newOptions.splice(index, 1)
    newOptionIconPreviews.splice(index, 1)
    setOptions(newOptions)
    setOptionIconPreviews(newOptionIconPreviews)
  }

  const validateForm = () => {
    // 檢查遊戲名稱
    if (!name.trim()) {
      alert('遊戲名稱是必填的')
      return false
    }

    // 檢查至少要有一個伺服器
    if (servers.length === 0) {
      alert('遊戲必須要有至少一個伺服器')
      return false
    }

    // 檢查每個伺服器
    for (let i = 0; i < servers.length; i++) {
      const server = servers[i]
      
      if (!server.trim()) {
        alert(`伺服器 ${i + 1} 的名稱是必填的`)
        return false
      }
    }

    // 檢查至少要有一個選項
    if (options.length === 0) {
      alert('遊戲必須要有至少一個選項')
      return false
    }

    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      
      // 檢查選項名稱
      if (!option.name.trim()) {
        alert(`選項 ${i + 1} 的名稱是必填的`)
        return false
      }

      // 檢查選項價格
      if (!option.price.trim()) {
        alert(`選項 ${i + 1} 的價格是必填的`)
        return false
      }

      // 檢查價格格式是否正確
      if (!/^\d+(\.\d+)?$/.test(option.price)) {
        alert(`選項 ${i + 1} 的價格格式不正確，請輸入有效的數字（例如：100 或 99.99）`)
        return false
      }

      // 檢查價格是否為數字且不為負數
        const price = parseFloat(option.price)
      if (isNaN(price) || price < 0) {
        alert(`選項 ${i + 1} 的價格必須是有效的數字且不能為負數`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 執行表單驗證
    if (!validateForm()) {
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('description', description)
      formData.append('is_active', isActive.toString())
      formData.append('servers', JSON.stringify(servers.filter(server => server.trim())))
      formData.append('tags', JSON.stringify(selectedTags))
      if (icon) {
        formData.append('icon', icon)
      }
      options.forEach((option: GameOption, index: number) => {
        formData.append(`options[${index}][name]`, option.name)
        if (option.icon) {
          formData.append(`options[${index}][icon]`, option.icon)
        }
        formData.append(`options[${index}][price]`, option.price)
      })

      const method = game ? 'PUT' : 'POST'
      const url = game ? `/api/games/${game.id}` : '/api/games'
      console.log('Making request to:', url, 'with method:', method) // 調試用
      
      const res = await fetch(url, {
        method,
        body: formData,
      })

      console.log('Response status:', res.status, 'OK:', res.ok) // 調試用
      
      if (res.ok) {
        const responseData = await res.json()
        console.log('Response data:', responseData) // 調試用
        const gameId = game?.id || responseData.game?.id

        // 更新遊戲標籤 - 只有在有有效 gameId 且有選擇標籤時才執行
        if (gameId && selectedTags.length > 0) {
          console.log('Updating tags for game ID:', gameId) // 調試用
          const tagsResponse = await fetch(`/api/games/${gameId}/tags`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tagIds: selectedTags }),
          })

          if (!tagsResponse.ok) {
            console.error('Failed to update tags')
            alert('遊戲儲存成功，但標籤更新失敗')
            return
          }
        }

        alert(game ? '遊戲更新成功！' : '遊戲建立成功！')
        router.push('/admin/games')
      } else {
        const errorData = await res.text()
        console.error('Failed to save game. Status:', res.status, 'Error:', errorData)
        alert(`儲存失敗：${res.status} - ${errorData}`)
      }
    } catch (error) {
      console.error('Error saving game:', error)
      alert('發生錯誤，請稍後再試')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center">
              {game ? '編輯遊戲' : '新增遊戲'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 space-y-8">
            {/* Game Basic Info Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-blue-100 p-2 rounded-full mr-3">📝</span>
                遊戲基本資料
              </h3>
              
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-8 h-full flex flex-col justify-between">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">遊戲名稱</span>
                    </Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/70 text-black"
                    />
                  </div>
                  
                  <div className="space-y-2 flex-grow mt-4">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">遊戲描述</span>
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/70 h-[calc(100%-4rem)] resize-none text-black"
                    />
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <Label className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">遊戲狀態</span>
                    </Label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="is_active" className="text-sm text-gray-700">
                        {isActive ? '✅ 啟用' : '❌ 停用'}
                      </Label>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="icon_path" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <span className="mr-2">遊戲圖片</span>
                  </Label>
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl bg-white/50 hover:border-blue-400 transition-all duration-200 p-4 flex items-center justify-center relative overflow-hidden">
                    {iconPreview ? (
                      <Image src={iconPreview} alt="Game Icon Preview" fill className="object-cover" />
                    ) : (
                      <div className="text-gray-400 text-center">
                        <span className="block text-4xl mb-2">⬆️</span>
                        <span className="block text-sm">上傳圖片<br/>( .jpg, .png)</span>
                      </div>
                    )}
                    <Input 
                      id="icon_path" 
                      type="file" 
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setIcon(file);
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setIconPreview(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                        } else {
                          setIconPreview(null);
                        }
                      }} 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Game Tags Section */}
          <CardContent className="px-8 pb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-purple-100 p-2 rounded-full mr-3">🏷️</span>
                遊戲標籤
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(availableTags || game?.availableTags)?.map((tag) => (
                  <div
                    key={tag.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(tag.id)
                        ? 'border-purple-500 bg-purple-100 shadow-md'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-sm'
                    }`}
                    onClick={() => handleTagToggle(tag.id)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{tag.display_name}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedTags.includes(tag.id)
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedTags.includes(tag.id) && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {tag.name === '免帳密UID儲值' && '無需提供帳號密碼，僅需UID即可儲值'}
                      {tag.name === '熱門遊戲' && '目前最受歡迎的遊戲，會顯示在首頁'}
                      {tag.name === '新品上架' && '最新推出的遊戲項目'}
                    </p>
                  </div>
                ))}
              </div>
              
              {selectedTags.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    已選擇 {selectedTags.length} 個標籤：
                    {(availableTags || game?.availableTags)
                      ?.filter(tag => selectedTags.includes(tag.id))
                      .map(tag => tag.display_name)
                      .join('、')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>

          {/* Game Servers Section */}
          <CardContent className="px-8 pb-8">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-xl border border-orange-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-orange-100 p-2 rounded-full mr-3">🖥️</span>
                遊戲伺服器
              </h3>
              
              {servers.map((server, index) => (
                <div key={index} className="mb-4 p-4 bg-white rounded-lg border border-orange-200 shadow-sm">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-10">
                      <Label className="text-sm font-medium text-gray-600 mb-1 block">
                        伺服器 {index + 1} <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="例如: 台服、美服、歐服"
                        value={server}
                        onChange={(e) => handleServerChange(index, e.target.value)}
                        className="border-gray-200 focus:border-orange-400 transition-all duration-200 text-black"
                      />
                    </div>
                    
                    <div className="col-span-2">
                      <Button 
                        type="button"
                        variant="destructive" 
                        size="sm"
                        onClick={() => removeServer(index)}
                        className="w-full bg-red-500 hover:bg-red-600 transition-all duration-200 mt-6"
                      >
                        刪除
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button 
                type="button"
                onClick={addServer}
                className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 py-3"
              >
                新增伺服器
              </Button>
            </div>
          </CardContent>

          {/* Game Options Section */}
          <CardContent className="px-8 pb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">🎮</span>遊戲選項
              </h3>
              
              <div className="space-y-4">
                {options.map((option: GameOption, index: number) => (
                  <div key={index} className="bg-white/70 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-12 gap-4 items-center">
                                            
                    <div className="col-span-2">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">選項圖片</Label>
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md bg-white/50 hover:border-green-400 transition-all duration-200 flex items-center justify-center relative overflow-hidden">
                          {optionIconPreviews[index] ? (
                            <Image src={optionIconPreviews[index]!} alt="Option Icon Preview" fill className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="text-gray-400 text-center">
                              <span className="block text-lg mb-1">⬆️</span>
                              <span className="block text-xs">上傳</span>
                            </div>
                          )}
                          <Input
                            type="file"
                            onChange={(e) => handleOptionChange(index, 'icon', e.target.files?.[0] || null)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            accept="image/*"
                          />
                        </div>
                      </div>
                      

                      <div className="col-span-4">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">
                          選項名稱 <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="例如: 圓神結晶"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          className="border-gray-200 focus:border-green-400 transition-all duration-200 text-black"
                        />
                      </div>

                      <div className="col-span-4">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">
                          價格 <span className="text-red-500">*</span>
                          <span className="text-xs text-gray-500 ml-1">(僅限數字)</span>
                        </Label>
                        <Input
                          placeholder="例如: 100 或 99.99"
                          value={option.price}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          className="border-gray-200 focus:border-green-400 transition-all duration-200 text-black"
                          inputMode="decimal"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Button 
                          type="button"
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-200 mt-6"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button"
                  onClick={addOption}
                  className="w-full bg-green-500 hover:bg-green-600 transition-all duration-200 py-3"
                >
                  Add New Option
                </Button>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 rounded-b-lg p-6">
            <div className="flex justify-between w-full">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => router.push('/admin/games')}
                className="px-8 py-2 border-2 border-gray-300 hover:bg-gray-100 transition-all duration-200"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {game ? 'Update Game' : 'Create Game'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
