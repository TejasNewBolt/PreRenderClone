'use client';

import Link from 'next/link';
import { 
  Globe, 
  Activity, 
  Database, 
  Clock, 
  GitBranch,
  BarChart3,
  Settings,
  ArrowRight,
  Plus,
  RefreshCw,
  Trash2
} from 'lucide-react';

export default function DashboardPage() {
  // This would normally come from your database
  const stats = {
    totalDomains: 2,
    totalRenders: 456,
    cacheHitRate: 87,
    monthlyQuota: { used: 456, total: 1000 }
  };

  const recentDomains = [
    { id: '1', domain: 'example.com', status: 'verified', renders: 234 },
    { id: '2', domain: 'mysite.io', status: 'pending', renders: 222 }
  ];

  const recentActivity = [
    { type: 'render', domain: 'example.com', time: '2 minutes ago', status: 'success' },
    { type: 'cache_purge', domain: 'mysite.io', time: '15 minutes ago', status: 'success' },
    { type: 'render', domain: 'example.com', time: '1 hour ago', status: 'success' },
    { type: 'github_push', domain: 'example.com', time: '2 hours ago', status: 'success' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-xl font-bold text-gray-900">
                PreRenderSaaS
              </Link>
              <nav className="hidden md:flex space-x-6">
                <Link href="/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
                <Link href="/domains" className="text-gray-600 hover:text-gray-900">Domains</Link>
                <Link href="/cache" className="text-gray-600 hover:text-gray-900">Cache</Link>
                <Link href="/renders" className="text-gray-600 hover:text-gray-900">Renders</Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/domains/add" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Domain
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your pre-rendering performance and manage your sites</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Domains</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalDomains}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Renders</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalRenders}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cache Hit Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cacheHitRate}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Quota</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyQuota.used}/{stats.monthlyQuota.total}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(stats.monthlyQuota.used / stats.monthlyQuota.total) * 100}%` }}
                  />
                </div>
              </div>
              <Database className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Domains List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Your Domains</h2>
                <Link href="/domains" className="text-blue-600 hover:text-blue-700 text-sm">
                  View all <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {recentDomains.map(domain => (
                <div key={domain.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-900">{domain.domain}</h3>
                      <div className="flex items-center space-x-4 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          domain.status === 'verified' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {domain.status}
                        </span>
                        <span className="text-sm text-gray-500">
                          {domain.renders} renders
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <RefreshCw className="h-4 w-4 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-md">
                        <Settings className="h-4 w-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <Link href="/renders" className="text-blue-600 hover:text-blue-700 text-sm">
                  View all <ArrowRight className="inline h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="divide-y">
              {recentActivity.map((activity, index) => (
                <div key={index} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        activity.type === 'render' ? 'bg-blue-100' :
                        activity.type === 'cache_purge' ? 'bg-orange-100' :
                        'bg-green-100'
                      }`}>
                        {activity.type === 'render' && <Activity className="h-4 w-4 text-blue-600" />}
                        {activity.type === 'cache_purge' && <Trash2 className="h-4 w-4 text-orange-600" />}
                        {activity.type === 'github_push' && <GitBranch className="h-4 w-4 text-green-600" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.type.replace('_', ' ').charAt(0).toUpperCase() + 
                           activity.type.replace('_', ' ').slice(1)}
                        </p>
                        <p className="text-xs text-gray-500">{activity.domain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{activity.time}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activity.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/domains/add" className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <Plus className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Add New Domain</span>
              </div>
            </Link>
            <Link href="/cache" className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <RefreshCw className="h-5 w-5 text-green-600" />
                <span className="font-medium">Manage Cache</span>
              </div>
            </Link>
            <Link href="/renders" className="bg-white p-4 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <span className="font-medium">View Analytics</span>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
