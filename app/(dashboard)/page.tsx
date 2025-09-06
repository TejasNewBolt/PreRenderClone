export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-6">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-500">Domains</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-gray-500">Renders This Month</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-2xl font-bold">0%</div>
          <div className="text-sm text-gray-500">Cache Hit Rate</div>
        </div>
        <div className="rounded-lg border bg-white p-6">
          <div className="text-2xl font-bold">Free</div>
          <div className="text-sm text-gray-500">Current Plan</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border bg-white">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500">No recent activity to display.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border bg-white">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
        </div>
        <div className="p-6 grid gap-4 md:grid-cols-3">
          <button className="rounded-md border px-4 py-2 hover:bg-gray-50">
            Add Domain
          </button>
          <button className="rounded-md border px-4 py-2 hover:bg-gray-50">
            View Documentation
          </button>
          <button className="rounded-md border px-4 py-2 hover:bg-gray-50">
            Upgrade Plan
          </button>
        </div>
      </div>
    </div>
  )
}