import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { blogPosts } from '../content/blog-posts-config'

function BlogPost() {
  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Get post metadata
  const posts = {}
  blogPosts.forEach(post => {
    posts[post.slug] = post
  })
  const post = posts[slug] || posts['digital-wallpaper-etsy-guide-v2']

  // Load markdown content (embedded at build time)
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    // Import markdown dynamically - Vite will bundle these
    const loadContent = async () => {
      try {
        let module
        switch (slug) {
          case 'digital-wallpaper-etsy-guide-v2':
            module = await import('../content/blog/digital-wallpaper-etsy-guide-v2.md?raw')
            break
          case 'openclaw-cronjobs-automation-guide':
            module = await import('../content/blog/openclaw-cronjobs-automation-guide.md?raw')
            break
          case 'openclaw-setup-guide-skills-subagents-plugins':
            module = await import('../content/blog/openclaw-setup-guide-skills-subagents-plugins.md?raw')
            break
          default:
            throw new Error('Unknown slug: ' + slug)
        }
        setContent(module.default)
      } catch (err) {
        console.error('Error loading blog post:', err)
        setError(err.message)
        setContent('# Error\n\nCould not load blog post: ' + slug)
      } finally {
        setLoading(false)
      }
    }

    if (slug && slug !== 'junk-journal-niche-research-march-2026') {
      loadContent()
    } else {
      setContent('# Article Coming Soon\n\nThis article is being prepared and will be published shortly.')
      setLoading(false)
    }
  }, [slug])

  return (
    <div className="space-y-8">
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{post.date}</span>
            <span className="text-gray-500 text-sm">• {post.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{post.author?.charAt(0) || 'A'}</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{post.author || 'AI Insights Team'}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-100">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading article...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-600 p-6">
              <h3 className="text-lg font-bold text-red-900 mb-2">Error Loading Content</h3>
              <p className="text-red-800">{error}</p>
            </div>
          ) : (
            <div className="prose prose-lg prose-blue max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-6" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3" {...props} />,
                  h4: ({node, ...props}) => <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="text-gray-700 leading-relaxed mb-4" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-4 ml-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-4 ml-4" {...props} />,
                  li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-blue-600 pl-4 py-2 my-6 bg-blue-50 italic text-gray-700" {...props} />
                  ),
                  code: ({node, inline, ...props}) => (
                    inline
                      ? <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600" {...props} />
                      : <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm" {...props} />
                  ),
                  pre: ({node, ...props}) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto" {...props} />,
                  table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full border-collapse border border-gray-300" {...props} /></div>,
                  th: ({node, ...props}) => <th className="border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-left" {...props} />,
                  td: ({node, ...props}) => <td className="border border-gray-300 px-4 py-2" {...props} />,
                  hr: ({node, ...props}) => <hr className="my-8 border-gray-300" {...props} />,
                  a: ({node, ...props}) => {
                    const isAnchor = props.href && props.href.startsWith('#')
                    return (
                      <a 
                        className="text-blue-600 hover:underline font-medium"
                        {...(isAnchor ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                        {...props} 
                      />
                    )
                  },
                  strong: ({node, ...props}) => <strong className="font-bold text-gray-900" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-gray-700" {...props} />,
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-12">
          <Link to="/blog-posts" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </div>
  )
}

export default BlogPost
