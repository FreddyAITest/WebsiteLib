import React from 'react'

function BlogPosts() {
  const posts = [
    {
      id: 1,
      title: 'Coming Soon: First Blog Post',
      excerpt: 'We\'re preparing amazing content about AI, programming, and automation. Stay tuned!',
      date: 'Coming Soon',
      category: 'Announcement',
      readTime: 'TBD',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Insights, tutorials, and deep dives into AI, programming, and intelligent automation.
        </p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="h-48 md:h-56 md:w-80 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <svg className="w-20 h-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
              </div>
              <div className="p-8 flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-sm">{post.date}</span>
                  <span className="text-gray-500 text-sm">• {post.readTime} read</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
                <p className="text-gray-600 mb-6">{post.excerpt}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center">
                  Read more
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Empty State Message */}
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          More blog posts coming soon! 🚀
        </p>
      </div>
    </div>
  )
}

export default BlogPosts
