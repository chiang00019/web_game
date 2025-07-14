'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Game } from '@/types/database';

interface TopCustomerData {
    user_id: string;
    user_name: string;
    total_spending: number;
    total_orders: number;
    avg_order_value: number;
    last_purchase: string;
}

export default function ReportsPage() {
    const [reportData, setReportData] = useState<TopCustomerData[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [selectedGame, setSelectedGame] = useState<string>('all');
    const [dateRange, setDateRange] = useState<{ from: string; to: string }>({ from: '', to: '' });

    // Fetch initial games for the filter dropdown
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await fetch('/api/games');
                if (!response.ok) throw new Error('Failed to fetch games');
                setGames(await response.json());
            } catch (err: any) {
                setError('Could not load games for filter: ' + err.message);
            }
        };
        fetchGames();
    }, []);

    // Fetch report data whenever filters change
    useEffect(() => {
        const fetchReportData = async () => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                if (selectedGame !== 'all') params.append('game_id', selectedGame);
                if (dateRange.from) params.append('start_date', dateRange.from);
                if (dateRange.to) params.append('end_date', dateRange.to);

                const response = await fetch(`/api/reports/top-customers?${params.toString()}`);
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error || 'Failed to fetch report data');
                }
                setReportData(await response.json());
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchReportData();
    }, [selectedGame, dateRange]);

    const chartData = reportData.slice(0, 10).map(d => ({ ...d, total_spending: Number(d.total_spending) }));

    return (
        <div className="space-y-8">
            <div className="bg-white shadow-sm border-b -m-8 p-8 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">報表分析</h1>
                <p className="text-gray-600 mt-1">分析高價值客戶與遊戲銷售狀況</p>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label htmlFor="gameFilter" className="block text-sm font-medium text-gray-700">遊戲</label>
                        <select id="gameFilter" value={selectedGame} onChange={e => setSelectedGame(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                            <option value="all">所有遊戲</option>
                            {games.map(game => <option key={game.game_id} value={game.game_id}>{game.game_name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">開始日期</label>
                        <input type="date" id="startDate" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">結束日期</label>
                        <input type="date" id="endDate" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                    </div>
                </div>
            </div>

            {loading && <div className="text-center py-10">Loading report...</div>}
            {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}

            {!loading && !error && (
                <>
                    {/* Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">消費總額前 10 名用戶</h3>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="user_name" />
                                <YAxis />
                                <Tooltip formatter={(value: number) => `NT$ ${value.toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="total_spending" fill="#8884d8" name="總消費金額" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 p-6">詳細數據</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">排名</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">使用者</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">總消費金額</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">總訂單數</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均訂單金額</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">最近購買日期</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {reportData.map((row, index) => (
                                        <tr key={row.user_id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.user_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">NT$ {Number(row.total_spending).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{row.total_orders}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">NT$ {Number(row.avg_order_value).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(row.last_purchase).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {reportData.length === 0 && <div className="text-center py-8 text-gray-500">此篩選條件下無資料</div>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}