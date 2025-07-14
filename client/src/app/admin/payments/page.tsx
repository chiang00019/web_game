'use client';

import { useState, useEffect } from 'react';
import type { PaymentMethod } from '@/types/database';

export default function PaymentsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newMethodName, setNewMethodName] = useState('');

    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const response = await fetch('/api/payments');
                if (!response.ok) throw new Error('Failed to fetch payment methods');
                const data = await response.json();
                setMethods(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchMethods();
    }, []);

    const handleAddMethod = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMethodName.trim()) return;

        try {
            const response = await fetch('/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ method: newMethodName }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to add method');
            }

            const addedMethod = await response.json();
            setMethods([...methods, addedMethod]);
            setNewMethodName('');
        } catch (err: any) {
            alert(`Error adding method: ${err.message}`);
        }
    };

    const handleDeleteMethod = async (payment_method_id: number) => {
        if (!confirm('Are you sure you want to delete this payment method? It might be used in existing orders.')) return;

        try {
            const response = await fetch('/api/payments', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payment_method_id }),
            });

            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error || 'Failed to delete method');
            }

            setMethods(methods.filter(m => m.payment_method_id !== payment_method_id));
        } catch (err: any) {
            alert(`Error deleting method: ${err.message}`);
        }
    };

    if (loading) return <div className="text-center py-10">Loading payment methods...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="bg-white shadow-sm border-b -m-8 p-8 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">支付方式管理</h1>
                <p className="text-gray-600 mt-1">新增或刪除網站支援的支付方式</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Add new method form */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">新增支付方式</h3>
                    <form onSubmit={handleAddMethod} className="flex items-center gap-3">
                        <input
                            type="text"
                            value={newMethodName}
                            onChange={(e) => setNewMethodName(e.target.value)}
                            className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例如：信用卡、LINE Pay"
                            required
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors">
                            新增
                        </button>
                    </form>
                </div>

                {/* List of existing methods */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">現有支付方式</h3>
                    <div className="space-y-3">
                        {methods.map(method => (
                            <div key={method.payment_method_id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                <span className="text-gray-800">{method.method}</span>
                                <button 
                                    onClick={() => handleDeleteMethod(method.payment_method_id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                >
                                    刪除
                                </button>
                            </div>
                        ))}
                        {methods.length === 0 && <div className="text-center py-4 text-gray-500">暫無支付方式</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}