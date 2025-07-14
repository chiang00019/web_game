'use client';

import { useState, useEffect } from 'react';
import type { Banner } from '@/types/database'; // Use the central Banner type

// Note: The Banner type from database.ts might need adjustment if it's different from the local one.
// Assuming the DB schema for banner has: banner_id, title, content, image_url, link_url, is_active, created_at

export default function EditBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    content: '',
    image_url: '',
    link_url: '',
  });

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch('/api/banners');
        if (!response.ok) throw new Error('Failed to fetch banners');
        const data = await response.json();
        setBanners(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleAddBanner = async () => {
    if (!newBanner.title.trim() || !newBanner.content.trim()) return;
    try {
      const response = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to add banner');
      }
      const addedBanner = await response.json();
      setBanners([addedBanner, ...banners]);
      setNewBanner({ title: '', content: '', image_url: '', link_url: '' });
      setShowAddForm(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBanner = async (banner_id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    try {
      const response = await fetch('/api/banners', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_id }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to delete banner');
      }
      setBanners(banners.filter(b => b.banner_id !== banner_id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const response = await fetch('/api/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banner_id: banner.banner_id, is_active: !banner.is_active }),
      });
      if (!response.ok) {
        const { error } = await response.json();
        throw new Error(error || 'Failed to update banner');
      }
      const updatedBanner = await response.json();
      setBanners(banners.map(b => b.banner_id === banner.banner_id ? updatedBanner : b));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center py-10">Loading banners...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold text-gray-800">橫幅管理</h1>
            </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">管理網站橫幅</h2>
              <p className="text-gray-600 mt-1">新增、編輯或停用橫幅通知</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              新增橫幅
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">所有橫幅</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.banner_id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-800 text-lg">{banner.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${banner.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {banner.is_active ? '啟用中' : '已停用'}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{banner.content}</p>
                        {banner.link_url && <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-sm hover:underline">{banner.link_url}</a>}
                        <p className="text-sm text-gray-500 mt-2">建立日期：{new Date(banner.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button onClick={() => handleToggleActive(banner)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${banner.is_active ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}>
                          {banner.is_active ? '停用' : '啟用'}
                        </button>
                        <button onClick={() => handleDeleteBanner(banner.banner_id)} className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors">
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && <div className="text-center py-8 text-gray-500">暫無橫幅項目</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">新增橫幅</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">橫幅標題</label>
                <input type="text" value={newBanner.title} onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="輸入橫幅標題" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">橫幅內容</label>
                <textarea value={newBanner.content} onChange={(e) => setNewBanner({ ...newBanner, content: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="輸入橫幅內容" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">圖片 URL</label>
                <input type="text" value={newBanner.image_url} onChange={(e) => setNewBanner({ ...newBanner, image_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/image.png (選填)" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">連結 URL</label>
                <input type="text" value={newBanner.link_url} onChange={(e) => setNewBanner({ ...newBanner, link_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="https://example.com/link (選填)" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddBanner} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">新增</button>
              <button onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium">取消</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}