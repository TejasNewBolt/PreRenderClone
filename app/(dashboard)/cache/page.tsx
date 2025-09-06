export default function CachePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cache Management</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Cache Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cache Freshness
              </label>
              <select className="w-full rounded-md border border-gray-300 px-3 py-2">
                <option>7 days (Free plan)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">
                Auto-Recache
              </label>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
              </button>
            </div>
          </div>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Cache Actions</h2>
          <div className="space-y-3">
            <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Purge All Cache
            </button>
            <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Recache from Sitemap
            </button>
            <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50">
              Recache Specific URL
            </button>
          </div>
        </div>
      </div>
      
      <div className="rounded-lg border bg-white">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Cached URLs</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No cached URLs yet. Add a domain to start caching.</p>
        </div>
      </div>
    </div>
  )
}