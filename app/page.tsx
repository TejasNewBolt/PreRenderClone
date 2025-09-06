import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Zap, Shield, Globe, BarChart3, Server, Clock } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl">PreRender SaaS</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-gray-900">
                Features
              </Link>
              <Button asChild>
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Pre-render Your JavaScript Sites for
            <span className="text-blue-600"> Better SEO</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Serve fully-rendered HTML snapshots to search engines and social media crawlers.
            Improve your rankings and social sharing with zero infrastructure changes.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose PreRender SaaS?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Zap className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Serve cached HTML snapshots instantly to crawlers while keeping your dynamic site for users.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Shield className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">SEO Optimized</h3>
            <p className="text-gray-600">
              Ensure search engines see your complete content, including dynamically loaded elements.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Globe className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global CDN</h3>
            <p className="text-gray-600">
              Snapshots are delivered from edge locations worldwide for optimal performance.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <BarChart3 className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">
              Track cache hit rates, render performance, and crawler traffic with detailed analytics.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Server className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Multi-Framework</h3>
            <p className="text-gray-600">
              Works with Next.js, Nuxt, Gatsby, and any JavaScript framework or static site.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <Clock className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Auto-Refresh</h3>
            <p className="text-gray-600">
              Set cache freshness from 12 hours to 7 days. Snapshots update automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-2">Free</h3>
            <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal">/mo</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center"><span className="mr-2">✓</span> 1,000 renders/month</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 1 domain</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 7-day cache</li>
              <li className="flex items-center"><span className="mr-2">✓</span> Basic analytics</li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-blue-600 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Popular</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <p className="text-3xl font-bold mb-4">$50<span className="text-lg font-normal">/mo</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center"><span className="mr-2">✓</span> 100,000 renders/month</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 10 domains</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 12hr-7day cache</li>
              <li className="flex items-center"><span className="mr-2">✓</span> Full analytics</li>
              <li className="flex items-center"><span className="mr-2">✓</span> API access</li>
            </ul>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-xl font-semibold mb-2">Scale</h3>
            <p className="text-3xl font-bold mb-4">$400<span className="text-lg font-normal">/mo</span></p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center"><span className="mr-2">✓</span> 2M+ renders/month</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 200 domains</li>
              <li className="flex items-center"><span className="mr-2">✓</span> 12hr-7day cache</li>
              <li className="flex items-center"><span className="mr-2">✓</span> Priority support</li>
              <li className="flex items-center"><span className="mr-2">✓</span> Custom features</li>
            </ul>
            <Button className="w-full" variant="outline" asChild>
              <Link href="/dashboard">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white mt-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">PreRender SaaS</span>
            </div>
            <div className="text-gray-600">
              © 2024 PreRender SaaS. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}