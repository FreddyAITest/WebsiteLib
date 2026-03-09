import React from 'react'
import { useParams, Link } from 'react-router-dom'

function BlogPost() {
  const { slug } = useParams()

  // In production, you'd fetch from CMS or markdown files
  // For now, hardcoded example
  const post = {
    id: 1,
    slug: 'digital-wallpaper-etsy-guide',
    title: 'The Complete Guide to Designing and Selling Digital Wallpaper & Junk Journal Papers on Etsy (2026)',
    excerpt: 'A comprehensive walkthrough of the entire process—from AI generation to first sale—with real cost breakdowns and automation strategies.',
    date: 'March 9, 2026',
    author: 'AI Insights Team',
    readTime: '25 min read',
    category: 'Passive Income',
    tags: ['Digital Products', 'AI Design', 'Etsy', 'Passive Income'],
    content: `
      <p class="lead">The digital wallpaper and junk journal paper market on Etsy represents a <strong>low-overhead, high-margin opportunity</strong> for creators with AI tools and design skills. This guide walks you through the entire process—from AI generation to first sale—with real cost breakdowns and automation strategies for programmers.</p>

      <div class="bg-blue-50 border-l-4 border-blue-600 p-6 my-8">
        <h3 class="text-xl font-bold text-blue-900 mb-3">Key Numbers</h3>
        <ul class="space-y-2 text-blue-800">
          <li><strong>Startup Costs:</strong> $50-150/month (AI subscriptions + Etsy fees)</li>
          <li><strong>Average Product Price:</strong> $3-8 per digital pack</li>
          <li><strong>Typical Margin:</strong> 85-95% after fees</li>
          <li><strong>Time to First Sale:</strong> 2-4 weeks with proper optimization</li>
          <li><strong>Monthly Revenue Potential:</strong> $500-5,000+</li>
        </ul>
      </div>

      <h2>AI Image Generation: Tools & Costs</h2>
      <p>Here's a comprehensive breakdown of AI image generation options for commercial use:</p>

      <h3>Midjourney ⭐ (Recommended)</h3>
      <table class="w-full my-6">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-3 text-left">Plan</th>
            <th class="p-3 text-left">Price</th>
            <th class="p-3 text-left">Images</th>
            <th class="p-3 text-left">Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b">
            <td class="p-3">Basic</td>
            <td class="p-3">$10/mo</td>
            <td class="p-3">~200/mo</td>
            <td class="p-3">Testing</td>
          </tr>
          <tr class="border-b bg-blue-50">
            <td class="p-3 font-semibold">Standard</td>
            <td class="p-3">$30/mo</td>
            <td class="p-3">~900/mo</td>
            <td class="p-3">Growing shop</td>
          </tr>
          <tr class="border-b">
            <td class="p-3">Pro</td>
            <td class="p-3">$60/mo</td>
            <td class="p-3">~2,400/mo</td>
            <td class="p-3">Full-time creator</td>
          </tr>
        </tbody>
      </table>

      <h3>Adobe Firefly (You Already Have This!)</h3>
      <p>Since you have Adobe Premium, you get Generative Fill and Firefly credits included. Perfect for:</p>
      <ul class="list-disc pl-6 my-4 space-y-2">
        <li>Editing AI outputs</li>
        <li>Removing objects</li>
        <li>Extending backgrounds</li>
        <li>Commercial use (trained on Adobe Stock)</li>
      </ul>

      <h2>Automation for Programmers</h2>
      <p>This is where your programming skills create unfair advantages:</p>

      <h3>1. Automated Image Generation</h3>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>import asyncio
import discord

async def generate_batch(prompts):
    for prompt in prompts:
        await channel.send(f'/imagine prompt: {prompt}')
        await asyncio.sleep(30)  # Rate limit</code></pre>

      <h3>2. Etsy API Integration</h3>
      <pre class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto"><code>from etsy_python3 import EtsyAPI

def create_listing(product_data):
    listing = {
        'title': product_data['title'],
        'price': product_data['price'],
        'tags': product_data['tags'],
        'is_digital': True
    }
    return etsy.create_listing(listing)</code></pre>

      <h2>Top Performing Niches (2026)</h2>
      <div class="grid md:grid-cols-2 gap-6 my-8">
        <div class="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
          <h4 class="font-bold text-green-900 mb-3">🔥 High Demand</h4>
          <ul class="space-y-2 text-green-800">
            <li>Cottagecore Botanicals</li>
            <li>Dark Academia</li>
            <li>Celestial/Mystical</li>
            <li>Vintage Travel</li>
            <li>Kawaii/Cute</li>
          </ul>
        </div>
        <div class="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
          <h4 class="font-bold text-purple-900 mb-3">💰 High Value</h4>
          <ul class="space-y-2 text-purple-800">
            <li>Steampunk Industrial</li>
            <li>Art Deco Patterns</li>
            <li>Nature Textures</li>
            <li>Seasonal Collections</li>
            <li>Abstract Fluid Art</li>
          </ul>
        </div>
      </div>

      <h2>30-Day Launch Plan</h2>
      <div class="my-8">
        <div class="mb-6">
          <h4 class="font-bold text-lg mb-2">Week 1: Foundation</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Choose 2-3 niches</li>
            <li>Subscribe to Midjourney ($30)</li>
            <li>Generate first 100 images</li>
            <li>Create 3 product packs</li>
          </ul>
        </div>
        <div class="mb-6">
          <h4 class="font-bold text-lg mb-2">Week 2: Shop Creation</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Set up Etsy shop</li>
            <li>Create listings with SEO</li>
            <li>Design mockups</li>
            <li>Prepare launch</li>
          </ul>
        </div>
        <div class="mb-6">
          <h4 class="font-bold text-lg mb-2">Week 3: Launch</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Announce on social media</li>
            <li>Monitor analytics</li>
            <li>Optimize based on data</li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-lg mb-2">Week 4: Scale</h4>
          <ul class="list-disc pl-6 space-y-1">
            <li>Expand catalog to 20+ products</li>
            <li>Test Etsy ads</li>
            <li>Plan Month 2</li>
          </ul>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-2xl my-8">
        <h3 class="text-2xl font-bold mb-4">Ready to Start?</h3>
        <p class="mb-6">The barrier to entry has never been lower. With your Adobe Premium subscription and programming skills, you have significant advantages over competitors.</p>
        <p class="font-semibold">Success Formula: Quality AI + Strategic Niches + SEO + Consistency + Automation = Passive Income</p>
      </div>

      <p><em>Full 25-minute read with complete prompts, cost breakdowns, and automation scripts available in the downloadable guide.</em></p>
    `,
  }

  return (
    <article className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <header className="mb-12">
        <Link
          to="/blog-posts"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            {post.category}
          </span>
          <span className="text-gray-500 text-sm">{post.date}</span>
          <span className="text-gray-500 text-sm">•</span>
          <span className="text-gray-500 text-sm">{post.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>

        <p className="text-xl text-gray-600 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <div className="font-semibold text-gray-900">{post.author}</div>
            <div className="text-sm text-gray-500">AI Insights Team</div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
        <div className="aspect-video bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <svg className="w-32 h-32 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div 
        className="prose prose-lg max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
          prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
          prose-strong:text-gray-900
          prose-a:text-blue-600 prose-a:hover:text-blue-700
          prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
          prose-li:mb-2
          prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4
          prose-table:w-full prose-table:my-8
          prose-th:bg-gray-100 prose-th:p-3 prose-th:text-left
          prose-td:p-3 prose-td:border-b
          prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Share */}
      <div className="mt-8 flex items-center gap-4">
        <span className="text-gray-600 font-medium">Share:</span>
        <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
          </svg>
        </button>
        <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </button>
        <button className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
        </button>
      </div>
    </article>
  )
}

export default BlogPost
