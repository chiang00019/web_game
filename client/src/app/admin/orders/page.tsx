'use client';

import { useState, useEffect } from 'react';
import type { Order } from '@/types/database';

// Define a more specific type for orders with joined data
type OrderWithDetails = Order & {
    game: { game_name: string; icon: string | null } | null;
    profile: { user_name: string | null; phone_no: string | null } | null;
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error || 'Failed to fetch orders');
                }
                const data = await response.json();
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (order_id: number, newStatus: string) => {
        try {
            const response = await fetch('/api/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order_id, status: newStatus }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to update order status');
            }

            const updatedOrder = await response.json();
            setOrders(orders.map(o => o.order_id === order_id ? { ...o, status: updatedOrder.status } : o));
        } catch (err: any) {
            alert(`Error updating status: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center py-10">Loading orders...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm border-b -m-8 p-8 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">訂單管理</h1>
                <p className="text-gray-600 mt-1">查看和管理所有使用者訂單</p>
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">訂單 ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">使用者</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">遊戲</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">遊戲資訊</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">狀態</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">建立時間</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(order => (
                                <tr key={order.order_id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.order_id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.profile?.user_name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.game?.game_name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>UID: {order.game_uid || '-'}</div>
                                        <div>Server: {order.game_server || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <select 
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                                            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                        >
                                            <option value="pending">待處理</option>
                                            <option value="processing">處理中</option>
                                            <option value="completed">已完成</option>
                                            <option value="failed">失敗</option>
                                            <option value="refunded">已退款</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <div className="text-center py-8 text-gray-500">暫無訂單</div>}
                </div>
            </div>
        </div>
    );
}