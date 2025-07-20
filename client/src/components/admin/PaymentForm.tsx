'use client'

import { useState, useEffect } from 'react'

interface PaymentMethod {
  id?: string
  name: string
  description?: string
  is_active: boolean
  instruction?: string
}

interface PaymentFormProps {
  paymentMethod?: PaymentMethod
  onSave: (paymentMethod: Omit<PaymentMethod, 'id'>) => void
  onCancel: () => void
}

export default function PaymentForm({ paymentMethod, onSave, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'id'>>({
    name: '',
    description: '',
    is_active: true,
    instruction: ''
  })

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        name: paymentMethod.name,
        description: paymentMethod.description || '',
        is_active: paymentMethod.is_active,
        instruction: paymentMethod.instruction || ''
      })
    }
  }, [paymentMethod])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 text-center mb-4">
            {paymentMethod ? '編輯付款方式' : '新增付款方式'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                付款方式名稱
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="例如：銀行轉帳、超商代碼"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                描述 (選填)
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="付款方式的詳細說明"
              />
            </div>

            <div>
              <label htmlFor="instruction" className="block text-sm font-medium text-gray-700">
                付款說明 (選填)
              </label>
              <textarea
                id="instruction"
                name="instruction"
                value={formData.instruction}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="詳細的付款步驟說明，例如轉帳帳戶資訊等"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                啟用此付款方式
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="submit"
                className="flex-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                儲存
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 