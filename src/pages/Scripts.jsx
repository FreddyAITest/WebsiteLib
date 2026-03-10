import React from 'react'
import { Link } from 'react-router-dom'

function Scripts() {
  const scripts = [
    {
      name: 'Image to PDF Upscaler',
      description: 'Automatically upscale images with Photoshop or AI, create high-quality PDFs with 20MB size limits, auto-split large files, and upload to your website.',
      features: [
        'Photoshop automation with Preserve Details 2.0',
        'AI upscaling (Real-ESRGAN, waifu2x) with GPU support',
        'Automatic PDF splitting when >20MB',
        'Upload to Netlify, AWS S3, FTP/SFTP',
        'Multi-threading and resume capability',
        'Folder watch mode for automation',
      ],
      download: '/scripts/image-to-pdf-upscale/image_to_pdf_upscale.py',
      docs: '/scripts/image-to-pdf-upscale/README.md',
      github: 'https://github.com/FreddyAITest/WebsiteLib/tree/main/public/scripts/image-to-pdf-upscale',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">AI Insights</span>
            </Link>
            <div className="flex space-x-1">
              <Link to="/" className="px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Home</Link>
              <Link to="/blog-posts" className="px-3 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition">Blog Posts</Link>
              <Link to="/scripts" className="px-3 py-2 rounded-lg font-medium text-blue-600 bg-blue-50">Scripts</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Automation Scripts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional Python scripts for automating your workflow. Built for production use with comprehensive documentation.
          </p>
        </div>

        {/* Scripts List */}
        <div className="space-y-8">
          {scripts.map((script, index) => (
            <article key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">{script.name}</h2>
                    <p className="text-lg text-gray-600">{script.description}</p>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium whitespace-nowrap">
                      Production Ready
                    </span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Features</h3>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {script.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Technology</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Python 3.8+', 'Photoshop API', 'Real-ESRGAN', 'img2pdf', 'Netlify API', 'AWS S3', 'FTP/SFTP'].map((tech, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-200">
                  <a
                    href={script.download}
                    download
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Script
                  </a>
                  <a
                    href={script.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    View Documentation
                  </a>
                  <a
                    href={script.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    View on GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">More Scripts Coming Soon! 🚀</h3>
            <p className="text-gray-600">
              We're constantly building new automation tools. Check back soon for more production-ready scripts.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">AI Insights</h3>
              <p className="text-gray-400">Exploring the frontier of AI, programming, and intelligent automation.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/blog-posts" className="hover:text-white transition">Blog Posts</Link></li>
                <li><Link to="/scripts" className="hover:text-white transition">Scripts</Link></li>
                <li><Link to="/programming-stuff" className="hover:text-white transition">Programming Stuff</Link></li>
                <li><Link to="/plugins" className="hover:text-white transition">Plugins</Link></li>
                <li><Link to="/skills" className="hover:text-white transition">Skills</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-gray-400">Built with React, Tailwind CSS, and powered by AI insights.</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2026 AI Insights. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Scripts
