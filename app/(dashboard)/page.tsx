export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Renders</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-500">This month</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Cache Hit Rate</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-xs text-gray-500">Last 7 days</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Active Domains</h3>
          <p className="text-2xl font-bold">0</p>
          <p className="text-xs text-gray-500">Verified</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h3 className="text-sm font-medium text-gray-500">Quota Used</h3>
          <p className="text-2xl font-bold">0%</p>
          <p className="text-xs text-gray-500">0 / 1,000 renders</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-500">No recent activity</p>
        </div>
        
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50">
              Add Domain
            </button>
            <button className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50">
              View Render History
            </button>
            <button className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50">
              Manage Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}