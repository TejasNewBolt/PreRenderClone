'use client';

import Link from 'next/link';
import { ArrowRight, Globe, Github, Zap, Shield, BarChart, Clock } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PreRenderSaaS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/domains" className="text-gray-700 hover:text-gray-900">
                Dashboard
              </Link>
              <Link href="/domains" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            SEO-Friendly Snapshots for Dynamic Websites
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Serve pre-rendered HTML to search engines and social media crawlers while keeping your 
            JavaScript-powered site dynamic for users. Improve SEO, social sharing, and performance.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/domains" className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 flex items-center">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="#features" className="bg-white text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 border border-gray-300">
              Learn More
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything You Need for Perfect SEO
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Multi-Framework Support</h4>
              <p className="text-gray-600">
                Works with Next.js, Gatsby, Hugo, Nuxt, and any JavaScript framework
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Github className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">GitHub Integration</h4>
              <p className="text-gray-600">
                Automatic builds and deployments triggered by your git pushes
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
              <p className="text-gray-600">
                Global CDN delivery ensures bots get snapshots in milliseconds
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Bot Detection</h4>
              <p className="text-gray-600">
                Automatically detect and serve snapshots to search engines and social bots
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <BarChart className="h-8 w-8 text-pink-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Analytics Dashboard</h4>
              <p className="text-gray-600">
                Track cache hits, render performance, and bot traffic in real-time
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Smart Caching</h4>
              <p className="text-gray-600">
                Configurable cache freshness from 12 hours to 7 days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h3>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Connect Repository</h4>
              <p className="text-sm text-gray-600">Link your GitHub repo and we'll set up webhooks</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Automatic Builds</h4>
              <p className="text-sm text-gray-600">Push code and we'll generate static snapshots</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Bot Detection</h4>
              <p className="text-sm text-gray-600">We identify crawlers and serve them snapshots</p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 shadow-md">
                <span className="text-xl font-bold text-blue-600">4</span>
              </div>
              <h4 className="font-semibold mb-2">Better SEO</h4>
              <p className="text-sm text-gray-600">Search engines index your content perfectly</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Improve Your SEO?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Start with 1,000 free renders per month. No credit card required.
          </p>
          <Link href="/domains" className="bg-white text-blue-600 px-8 py-4 rounded-md hover:bg-gray-100 inline-flex items-center font-semibold">
            Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 PreRenderSaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
