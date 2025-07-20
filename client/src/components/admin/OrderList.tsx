'use client'

import { useState } from 'react'

interface Order {
  id: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded'
  created_at: string
  character_id: string
  profiles: {
    user_name: string
  }
  game_packages: {
    name: string
    price: number
    game: {
      name: string
    }
  }
}

interface OrderListProps {
  orders: Order[]
  onStatusUpdate: (orderId: string, status: string) => void
}

export default function OrderList({ orders, onStatusUpdate }: OrderListProps) {
  const [filter, setFilter] = useState<string>('all')

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true
    return order.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    if (confirm(`確定要將訂單狀態更改為 ${newStatus} 嗎？`)) {
      onStatusUpdate(orderId, newStatus)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex space-x-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">所有訂單</option>
          <option value="pending">待處理</option>
          <option value="processing">處理中</option>
          <option value="completed">已完成</option>
          <option value="failed">失敗</option>
          <option value="refunded">已退款</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                訂單ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用者
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                遊戲/商品
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                角色ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                金額
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                狀態
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                建立時間
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.profiles?.user_name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div>
                    <div className="font-medium">{order.game_packages?.game?.name}</div>
                    <div className="text-gray-500">{order.game_packages?.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.character_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${order.game_packages?.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.created_at).toLocaleString('zh-TW')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'processing')}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      處理中
                    </button>
                  )}
                  {order.status === 'processing' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className="text-green-600 hover:text-green-900"
                    >
                      完成
                    </button>
                  )}
                  {order.status !== 'completed' && order.status !== 'refunded' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'failed')}
                      className="text-red-600 hover:text-red-900"
                    >
                      失敗
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">沒有找到訂單</p>
        </div>
      )}
    </div>
  )
} 