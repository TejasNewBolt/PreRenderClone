import Link from 'next/link'
import { Home, Globe, Database, Activity, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-xl font-bold">PreRender SaaS</h1>
        </div>
        <nav className="px-4">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/domains"
            className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Globe className="h-5 w-5" />
            <span>Domains</span>
          </Link>
          <Link
            href="/cache"
            className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Database className="h-5 w-5" />
            <span>Cache</span>
          </Link>
          <Link
            href="/renders"
            className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Activity className="h-5 w-5" />
            <span>Renders</span>
          </Link>
          <Link
            href="/settings"
            className="flex items-center space-x-3 px-4 py-2 rounded-md hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}