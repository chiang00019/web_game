'use client'

import { useState, useEffect } from 'react'

interface PaymentMethod {
  payment_method_id?: number
  method: string
}

interface PaymentFormProps {
  paymentMethod?: PaymentMethod
  onSave: (paymentMethod: Omit<PaymentMethod, 'payment_method_id'>) => void
  onCancel: () => void
}

export default function PaymentForm({ paymentMethod, onSave, onCancel }: PaymentFormProps) {
  const [formData, setFormData] = useState<Omit<PaymentMethod, 'payment_method_id'>>({
    method: ''
  })

  useEffect(() => {
    if (paymentMethod) {
      setFormData({
        method: paymentMethod.method
      })
    }
  }, [paymentMethod])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
              <label htmlFor="method" className="block text-sm font-medium text-gray-700">
                付款方式名稱
              </label>
              <input
                type="text"
                id="method"
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
                placeholder="例如：銀行轉帳、超商代碼、線上支付"
              />
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