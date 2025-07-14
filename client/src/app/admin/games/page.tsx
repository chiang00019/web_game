'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';
import type { Game } from '@/types/database'; // Use the central Game type

export default function EditGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGame, setNewGame] = useState({
    name: '',
    category: 'uid',
    icon: '',
  });

  // Fetch initial data
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/games');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data = await response.json();
        setGames(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  const handleAddGame = async () => {
    if (!newGame.name.trim()) return;

    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGame),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to add game');
      }

      const addedGame = await response.json();
      setGames([...games, addedGame]);
      setNewGame({ name: '', category: 'uid', icon: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteGame = async (game_id: number) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const response = await fetch('/api/games', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_id }),
      });

      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to delete game');
      }

      setGames(games.filter(game => game.game_id !== game_id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (game: Game) => {
    try {
        const response = await fetch('/api/games', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ game_id: game.game_id, is_active: !game.is_active }),
        });

        if (!response.ok) {
            const { error } = await response.json();
            throw new Error(error || 'Failed to update game');
        }

        const updatedGame = await response.json();
        setGames(games.map(g => g.game_id === game.game_id ? updatedGame : g));
    } catch (err: any) {
        setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Loading games...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">遊戲管理</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">管理所有遊戲</h2>
              <p className="text-gray-600 mt-1">新增、編輯或停用遊戲項目</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增遊戲
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <GameCategoryList 
                title="UID免帳密儲值遊戲"
                description="使用 UID 進行免帳密快速儲值的遊戲"
                games={games.filter(g => g.category === 'uid')}
                onToggleActive={handleToggleActive}
                onDelete={handleDeleteGame}
            />
            <GameCategoryList 
                title="手機遊戲"
                description="一般手機遊戲儲值項目"
                games={games.filter(g => g.category === 'mobile')}
                onToggleActive={handleToggleActive}
                onDelete={handleDeleteGame}
            />
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">新增遊戲</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">遊戲名稱</label>
                <input
                  type="text"
                  value={newGame.name}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入遊戲名稱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">遊戲分類</label>
                <select
                  value={newGame.category}
                  onChange={(e) => setNewGame({ ...newGame, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="uid">UID免帳密儲值</option>
                  <option value="mobile">手機遊戲</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">遊戲圖標 URL</label>
                <input
                  type="text"
                  value={newGame.icon}
                  onChange={(e) => setNewGame({ ...newGame, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入圖標 URL（選填）"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddGame} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors">新增</button>
              <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium transition-colors">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface GameCategoryListProps {
    title: string;
    description: string;
    games: Game[];
    onToggleActive: (game: Game) => void;
    onDelete: (game_id: number) => void;
}

function GameCategoryList({ title, description, games, onToggleActive, onDelete }: GameCategoryListProps) {
    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-orange-500">{title}</h3>
                <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
            <div className="p-6">
                <div className="space-y-3">
                    {games.map((game) => (
                        <div key={game.game_id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {game.icon ? (
                                        <Image src={game.icon} alt={game.game_name} className="w-10 h-10 rounded object-cover" width={48} height={48} />
                                    ) : (
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </div>
                                <div>
                                    <span className="font-medium text-gray-800 text-lg">{game.game_name}</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${game.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {game.is_active ? '啟用中' : '已停用'}
                                        </span>
                                        <span className="text-xs text-gray-500">{game.category === 'uid' ? 'UID 儲值' : '手機遊戲'}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onToggleActive(game)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${game.is_active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>
                                    {game.is_active ? '停用' : '啟用'}
                                </button>
                                <button onClick={() => onDelete(game.game_id)} className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors">
                                    刪除
                                </button>
                            </div>
                        </div>
                    ))}
                    {games.length === 0 && (
                        <div className="text-center py-8 text-gray-500">此分類暫無遊戲項目</div>
                    )}
                </div>
            </div>
        </div>
    );
}