'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import PaymentForm from '@/components/admin/PaymentForm'

interface PaymentMethod {
  payment_method_id: number
  method: string
}

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/payments')
      const data = await response.json()
      setPaymentMethods(data)
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (paymentData: Omit<PaymentMethod, 'payment_method_id'>) => {
    try {
      if (selectedPayment) {
        // Update existing payment method
        const response = await fetch(`/api/payments/${selectedPayment.payment_method_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        })
        if (!response.ok) throw new Error('Failed to update payment method')
      } else {
        // Create new payment method
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentData),
        })
        if (!response.ok) throw new Error('Failed to create payment method')
      }
      
      fetchPaymentMethods()
      setIsFormOpen(false)
      setSelectedPayment(null)
    } catch (error) {
      console.error('Error saving payment method:', error)
      alert('儲存失敗，請重試')
    }
  }

  const handleDelete = async (paymentMethodId: number) => {
    if (!confirm('確定要刪除這個付款方式嗎？')) return

    try {
      const response = await fetch(`/api/payments/${paymentMethodId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to delete payment method')
      fetchPaymentMethods()
    } catch (error) {
      console.error('Error deleting payment method:', error)
      alert('刪除失敗，請重試')
    }
  }

  const openForm = (payment?: PaymentMethod) => {
    setSelectedPayment(payment || null)
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedPayment(null)
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">付款方式管理</h1>
                  <p className="mt-1 text-sm text-gray-600">
                    管理網站支援的付款方式
                  </p>
                </div>
                <button
                  onClick={() => openForm()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  新增付款方式
                </button>
              </div>
            </div>
          </div>

          {/* Payment Methods List */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">尚未建立任何付款方式</p>
                    </div>
                  ) : (
                    paymentMethods.map((payment) => (
                      <div key={payment.payment_method_id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{payment.method}</h3>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => openForm(payment)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              編輯
                            </button>
                            <button
                              onClick={() => handleDelete(payment.payment_method_id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              刪除
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Form Modal */}
        {isFormOpen && (
          <PaymentForm
            paymentMethod={selectedPayment || undefined}
            onSave={handleSave}
            onCancel={closeForm}
          />
        )}
      </div>
    </AdminGuard>
  )
} 