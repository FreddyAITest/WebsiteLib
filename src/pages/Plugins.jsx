import React from 'react'

function Plugins() {
  const plugins = [
    {
      id: 1,
      name: 'OpenClaw Gateway',
      description: 'Core gateway for managing AI agents and skills.',
      category: 'Infrastructure',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Telegram Channel',
      description: 'Telegram integration for bot messaging and notifications.',
      category: 'Communication',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Coming Soon',
      description: 'More plugins and integrations will be added here.',
      category: 'TBD',
      status: 'Planned',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Plugins</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Extensions, integrations, and tools that power our AI ecosystem.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plugins.map((plugin) => (
          <div
            key={plugin.id}
            className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                plugin.status === 'Active' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {plugin.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">{plugin.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{plugin.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{plugin.category}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          More plugins coming soon! 🔌
        </p>
      </div>
    </div>
  )
}

export default Plugins
