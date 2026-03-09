import React from 'react'

function ProgrammingStuff() {
  const projects = [
    {
      id: 1,
      title: 'AI Agent Framework',
      description: 'Building intelligent agents with OpenClaw and custom skills.',
      tags: ['AI', 'JavaScript', 'Automation'],
      status: 'In Progress',
    },
    {
      id: 2,
      title: 'Coming Soon',
      description: 'More programming projects and tutorials will be added here.',
      tags: ['TBD'],
      status: 'Planned',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Programming Stuff</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Projects, tutorials, code snippets, and technical deep dives.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'In Progress' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {project.status}
              </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{project.title}</h3>
            <p className="text-gray-600 mb-6">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">
          More projects coming soon! 💻
        </p>
      </div>
    </div>
  )
}

export default ProgrammingStuff
