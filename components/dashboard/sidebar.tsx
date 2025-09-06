'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Globe,
  HardDrive,
  History,
  BarChart3,
  Settings,
  CreditCard,
  FileText,
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Domains', href: '/domains', icon: Globe },
  { name: 'Cache', href: '/cache', icon: HardDrive },
  { name: 'Renders', href: '/renders', icon: History },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Billing', href: '/billing', icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gray-900">
      <div className="flex h-16 items-center px-6">
        <h1 className="text-xl font-semibold text-white">PreRender SaaS</h1>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                group flex items-center rounded-md px-3 py-2 text-sm font-medium
                ${isActive
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}
                `}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-gray-800 p-4">
        <div className="rounded-md bg-gray-800 px-3 py-2">
          <p className="text-xs text-gray-400">Current Plan</p>
          <p className="text-sm font-medium text-white">Free</p>
          <p className="text-xs text-gray-400">0 / 1,000 renders</p>
        </div>
      </div>
    </div>
  )
}