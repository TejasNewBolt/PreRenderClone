export default function RendersPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Render History</h1>
      
      <div className="rounded-lg border bg-white">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Renders</h2>
            <div className="flex space-x-2">
              <select className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                <option>All Status</option>
                <option>Success</option>
                <option>Failed</option>
              </select>
              <select className="rounded-md border border-gray-300 px-3 py-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>All time</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="text-center py-12">
            <p className="text-gray-500">No render history yet.</p>
          </div>
        </div>
      </div>
    </div>
  )
}