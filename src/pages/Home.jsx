import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
          Welcome to
          <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            AI Insights
          </span>
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto mb-6 rounded-full"></div>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          Your hub for AI discoveries, programming tutorials, plugins, and agent skills.
          Explore the latest in artificial intelligence and automation.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/blog-posts"
            className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            Read Blog Posts
          </Link>
          <Link
            to="/skills"
            className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition shadow-md border border-blue-200"
          >
            Explore Skills
          </Link>
        </div>
      </section>

      {/* Latest Blog Post Section */}
      <section className="py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Blog Post</h2>
          <Link
            to="/blog-posts"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
          >
            View all posts
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Placeholder for latest blog post */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="md:flex">
            <div className="md:flex-shrink-0">
              <div className="h-48 md:h-full md:w-64 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-24 h-24 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
            </div>
            <div className="p-8 flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Coming Soon
                </span>
                <span className="text-gray-500 text-sm">Blog post will appear here</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Your Latest Blog Post Will Appear Here
              </h3>
              <p className="text-gray-600 mb-6">
                We're working on creating amazing content for you. Check back soon for insights on AI, 
                programming tutorials, plugin reviews, and agent skill deep-dives.
              </p>
              <Link
                to="/blog-posts"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse all posts
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">Soon</div>
            <div className="text-gray-600">Blog Posts</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-indigo-600 mb-2">Soon</div>
            <div className="text-gray-600">Tutorials</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">Soon</div>
            <div className="text-gray-600">Plugins</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">Soon</div>
            <div className="text-gray-600">Skills</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
