import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle } from 'lucide-react'

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-2">Manage your subscription and payment methods.</p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>You are currently on the Free plan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold">Free Plan</h3>
                <p className="text-sm text-gray-600">$0/month</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">1,000 renders/month</p>
                <p className="text-sm text-gray-600">1 domain</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Usage This Month</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">0 / 1,000 renders used</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>Upgrade to unlock more features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Free Plan */}
            <div className="border rounded-lg p-6 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Current</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Free</h3>
              <p className="text-2xl font-bold mb-4">$0<span className="text-sm font-normal">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  1,000 renders/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  1 domain
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  7-day cache
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Basic analytics
                </li>
              </ul>
              <Button className="w-full" disabled>
                Current Plan
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-blue-600 rounded-lg p-6 relative">
              <div className="absolute top-4 right-4">
                <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">Popular</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Pro</h3>
              <p className="text-2xl font-bold mb-4">$50<span className="text-sm font-normal">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  100,000 renders/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  10 domains
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  12hr-7day cache
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Full analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  API access
                </li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Upgrade to Pro
              </Button>
            </div>

            {/* Scale Plan */}
            <div className="border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-2">Scale</h3>
              <p className="text-2xl font-bold mb-4">$400<span className="text-sm font-normal">/mo</span></p>
              <ul className="space-y-2 mb-6 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  2M+ renders/month
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  200 domains
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  12hr-7day cache
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Custom features
                </li>
              </ul>
              <Button className="w-full" variant="outline">
                Contact Sales
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="mr-2 h-5 w-5" />
            Payment Method
          </CardTitle>
          <CardDescription>Manage your payment information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No payment method on file</p>
            <p className="text-sm mt-2">Add a payment method when upgrading</p>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card>
        <CardHeader>
          <CardTitle>Billing History</CardTitle>
          <CardDescription>View your past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p>No billing history available</p>
            <p className="text-sm mt-2">Invoices will appear here after upgrading</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
