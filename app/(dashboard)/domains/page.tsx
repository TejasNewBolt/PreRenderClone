'use client'

import { Plus } from 'lucide-react'

export default function DomainsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Domains</h1>
        <button className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          <span>Add Domain</span>
        </button>
      </div>
      
      <div className="rounded-lg border bg-white">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Your Domains</h2>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-semibold text-gray-900">No domains yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding your first domain.</p>
            <div className="mt-6">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Add Your First Domain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Globe } from 'lucide-react'