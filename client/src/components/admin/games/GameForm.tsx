'use client'

import { useState, useEffect } from 'react'
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

interface Game {
  id?: string
  name: string
  description: string
  options: GameOption[]
}

interface GameFormProps {
  game?: Game
}

export default function GameForm({ game }: GameFormProps) {
  const router = useRouter()
  const [name, setName] = useState(game ? game.name : '')
  const [description, setDescription] = useState(game ? game.description : '')
  const [icon, setIcon] = useState<File | null>(null)
  const [options, setOptions] = useState<GameOption[]>(game ? game.options : [{ name: '', icon: null, price: '' }])

  const handleOptionChange = (index: number, field: 'name' | 'icon' | 'price', value: string | File | null) => {
    const newOptions = [...options]
    newOptions[index][field] = value as any
    setOptions(newOptions)
  }

  const addOption = () => {
    setOptions([...options, { name: '', icon: null, price: '' }])
  }

  const removeOption = (index: number) => {
    const newOptions = [...options]
    newOptions.splice(index, 1)
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
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
    const res = await fetch(url, {
      method,
      body: formData,
    })

    if (res.ok) {
      router.push('/admin/games')
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
                      <span className="mr-2">🏷️</span>遊戲名稱
                    </Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/70"
                    />
                  </div>
                  
                  <div className="space-y-2 flex-grow mt-4">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700 flex items-center">
                      <span className="mr-2">📄</span>遊戲描述
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-2 border-gray-200 focus:border-blue-400 transition-all duration-200 bg-white/70 h-[calc(100%-2rem)] resize-none"
                    />
                  </div>
                </div>
                
                <div className="col-span-4">
                  <Label htmlFor="icon_path" className="text-sm font-medium text-gray-700 flex items-center mb-2">
                    <span className="mr-2">🖼️</span>Game Icon
                  </Label>
                  <div className="aspect-square border-2 border-dashed border-gray-300 rounded-xl bg-white/50 hover:border-blue-400 transition-all duration-200 p-4">
                    <Input 
                      id="icon_path" 
                      type="file" 
                      onChange={(e) => setIcon(e.target.files?.[0] || null)} 
                      className="h-full w-full border-0 bg-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          {/* Game Options Section */}
          <CardContent className="px-8 pb-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-full mr-3">⚙️</span>
                Game Options
              </h3>
              
              <div className="space-y-4">
                {options.map((option: GameOption, index: number) => (
                  <div key={index} className="bg-white/70 p-4 rounded-lg border border-gray-200 shadow-sm">
                    <div className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">Option Name</Label>
                        <Input
                          placeholder="e.g., Basic Package"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, 'name', e.target.value)}
                          className="border-gray-200 focus:border-green-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">Icon</Label>
                        <Input
                          type="file"
                          onChange={(e) => handleOptionChange(index, 'icon', e.target.files?.[0] || null)}
                          className="border-gray-200 focus:border-green-400 transition-all duration-200 file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-green-50 file:text-green-700"
                          accept="image/*"
                        />
                      </div>
                      
                      <div className="col-span-3">
                        <Label className="text-sm font-medium text-gray-600 mb-1 block">Price</Label>
                        <Input
                          placeholder="$0.00"
                          value={option.price}
                          onChange={(e) => handleOptionChange(index, 'price', e.target.value)}
                          className="border-gray-200 focus:border-green-400 transition-all duration-200"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <Button 
                          type="button"
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="w-full bg-red-500 hover:bg-red-600 transition-all duration-200"
                        >
                          🗑️ Remove
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
                  ➕ Add New Option
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
                {game ? '💾 Update Game' : '🚀 Create Game'}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
