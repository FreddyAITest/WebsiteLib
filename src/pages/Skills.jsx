import React from 'react'

function Skills() {
  const skillCategories = [
    {
      name: 'Core Skills',
      skills: [
        {
          name: 'GitHub Integration',
          description: 'Fetch issues, create PRs, manage code reviews, and automate workflows.',
          status: 'Active',
          usage: 'High',
        },
        {
          name: 'Web Search',
          description: 'Search the web using Brave API for research and information gathering.',
          status: 'Active',
          usage: 'High',
        },
        {
          name: 'Memory System',
          description: 'Semantic search and retrieval from MEMORY.md and memory files.',
          status: 'Active',
          usage: 'High',
        },
      ],
    },
    {
      name: 'Communication',
      skills: [
        {
          name: 'Telegram Bot',
          description: 'Send messages, create polls, manage channels via Telegram.',
          status: 'Active',
          usage: 'High',
        },
        {
          name: 'Text-to-Speech',
          description: 'Convert text to speech for audio responses.',
          status: 'Available',
          usage: 'Medium',
        },
      ],
    },
    {
      name: 'Automation',
      skills: [
        {
          name: 'Cron Jobs',
          description: 'Schedule recurring tasks, reminders, and automated reports.',
          status: 'Active',
          usage: 'Medium',
        },
        {
          name: 'Subagent Orchestration',
          description: 'Spawn and manage subagents for parallel task execution.',
          status: 'Active',
          usage: 'High',
        },
        {
          name: 'Browser Control',
          description: 'Automate web browsing, screenshots, and UI interactions.',
          status: 'Available',
          usage: 'Medium',
        },
      ],
    },
    {
      name: 'Development',
      skills: [
        {
          name: 'Agentic Coding',
          description: 'AI-powered coding assistance and code generation.',
          status: 'Available',
          usage: 'Medium',
        },
        {
          name: 'API Gateway',
          description: 'Access to 100+ API integrations (Notion, Slack, Google, etc.).',
          status: 'Available',
          usage: 'Medium',
        },
        {
          name: 'Deep Research Pro',
          description: 'Advanced research capabilities with comprehensive outputs.',
          status: 'Available',
          usage: 'Low',
        },
      ],
    },
    {
      name: 'Monitoring & Health',
      skills: [
        {
          name: 'Health Check',
          description: 'Security audits, system hardening, and risk assessments.',
          status: 'Available',
          usage: 'Low',
        },
        {
          name: 'Security Monitor',
          description: 'Continuous security monitoring and alerting.',
          status: 'Available',
          usage: 'Low',
        },
        {
          name: 'Self-Improvement',
          description: 'Capture learnings and corrections for continuous improvement.',
          status: 'Active',
          usage: 'Medium',
        },
      ],
    },
    {
      name: 'Content & Media',
      skills: [
        {
          name: 'OpenAI Whisper',
          description: 'Local speech-to-text transcription.',
          status: 'Available',
          usage: 'Low',
        },
        {
          name: 'Voice Transcribe',
          description: 'Voice transcription with custom vocabulary and replacements.',
          status: 'Available',
          usage: 'Low',
        },
        {
          name: 'Weather',
          description: 'Get current weather and forecasts via wttr.in or Open-Meteo.',
          status: 'Available',
          usage: 'Low',
        },
      ],
    },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Skills Library</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Complete catalog of OpenClaw agent skills, capabilities, and integrations.
        </p>
      </div>

      {skillCategories.map((category, categoryIndex) => (
        <div key={categoryIndex} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-3">
            <span className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></span>
            {category.name}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {category.skills.map((skill, skillIndex) => (
              <div
                key={skillIndex}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">{skill.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    skill.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : skill.status === 'Available'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {skill.status}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{skill.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Usage: <span className="font-medium text-gray-700">{skill.usage}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mt-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Skills Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold mb-2">18+</div>
            <div className="text-blue-100">Total Skills</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">6</div>
            <div className="text-blue-100">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">8</div>
            <div className="text-blue-100">Active</div>
          </div>
          <div>
            <div className="text-3xl font-bold mb-2">10+</div>
            <div className="text-blue-100">Available</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Skills
