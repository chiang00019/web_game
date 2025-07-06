'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Banner {
  id: string;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  isActive: boolean;
  createdAt: string;
}

export default function EditBannerPage() {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      title: '系統維護通知',
      content: '資料」並選擇「付款方式」⑤ 前往官方LINE配合付款 ⑥ 等待處理完畢。',
      type: 'info',
      isActive: true,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: '儲值教學',
      content: '儲值教學：① 選擇下方儲值遊戲 ② 點擊需要的面額 將商品加入購物車',
      type: 'announcement',
      isActive: true,
      createdAt: '2024-01-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: '',
    content: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'announcement',
  });

  const handleAddBanner = () => {
    if (newBanner.title.trim() && newBanner.content.trim()) {
      const banner: Banner = {
        id: Date.now().toString(),
        title: newBanner.title,
        content: newBanner.content,
        type: newBanner.type,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setBanners([banner, ...banners]);
      setNewBanner({ title: '', content: '', type: 'info' });
      setShowAddForm(false);
    }
  };

  const handleDeleteBanner = (id: string) => {
    setBanners(banners.filter(banner => banner.id !== id));
  };

  const handleToggleActive = (id: string) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, isActive: !banner.isActive } : banner
    ));
  };

  const getBannerTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'announcement':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBannerTypeIcon = (type: string) => {
    switch (type) {
      case 'info':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'announcement':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const getTypeDisplayName = (type: string) => {
    switch (type) {
      case 'info': return '資訊';
      case 'warning': return '警告';
      case 'success': return '成功';
      case 'announcement': return '公告';
      default: return type;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 頁面頭部 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin" 
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-800">橫幅管理</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* 頁面標題與操作 */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">管理網站橫幅</h2>
              <p className="text-gray-600 mt-1">新增、編輯或停用橫幅通知</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新增橫幅
            </button>
          </div>

          {/* 橫幅預覽 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">目前顯示的橫幅</h3>
            <div className="space-y-3">
              {banners.filter(banner => banner.isActive).map((banner) => (
                <div key={banner.id} className={`p-4 rounded-lg border-l-4 ${getBannerTypeColor(banner.type)}`}>
                  <div className="flex items-start gap-3">
                    {getBannerTypeIcon(banner.type)}
                    <div className="flex-1">
                      <h4 className="font-medium">{banner.title}</h4>
                      <p className="text-sm mt-1">{banner.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {banners.filter(banner => banner.isActive).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  目前沒有啟用的橫幅
                </div>
              )}
            </div>
          </div>

          {/* 橫幅列表 */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">所有橫幅</h3>
              <p className="text-sm text-gray-600 mt-1">管理所有橫幅的狀態和內容</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-medium text-gray-800 text-lg">{banner.title}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                            banner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {banner.isActive ? '啟用中' : '已停用'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded border ${getBannerTypeColor(banner.type)}`}>
                            {getTypeDisplayName(banner.type)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{banner.content}</p>
                        <p className="text-sm text-gray-500">建立日期：{banner.createdAt}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleToggleActive(banner.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            banner.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {banner.isActive ? '停用' : '啟用'}
                        </button>
                        <button
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="px-4 py-2 bg-red-100 text-red-800 hover:bg-red-200 rounded-lg text-sm font-medium transition-colors"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {banners.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    暫無橫幅項目
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 新增橫幅表單 */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">新增橫幅</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  橫幅標題
                </label>
                <input
                  type="text"
                  value={newBanner.title}
                  onChange={(e) => setNewBanner({ ...newBanner, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入橫幅標題"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  橫幅類型
                </label>
                <select
                  value={newBanner.type}
                  onChange={(e) => setNewBanner({ ...newBanner, type: e.target.value as Banner['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="info">資訊</option>
                  <option value="warning">警告</option>
                  <option value="success">成功</option>
                  <option value="announcement">公告</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  橫幅內容
                </label>
                <textarea
                  value={newBanner.content}
                  onChange={(e) => setNewBanner({ ...newBanner, content: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="輸入橫幅內容"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddBanner}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
              >
                新增
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md font-medium transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
