// Blog posts configuration - shared across components
// Add new posts here and they'll automatically appear on the home page and blog listing

export const blogPosts = [
  {
    id: 1,
    slug: 'digital-wallpaper-etsy-guide-v2',
    title: 'The Complete Guide to Selling Digital Wallpaper & Junk Journal Papers on Etsy (2026)',
    excerpt: 'A comprehensive walkthrough with real seller income data, verified policy requirements, and actual shop performance metrics. No fluff—just credible, sourced information.',
    date: 'March 9, 2026',
    dateObj: new Date('2026-03-09'),
    category: 'Passive Income',
    readTime: '25 min read',
    featured: true,
  },
  {
    id: 2,
    slug: 'openclaw-cronjobs-automation-guide',
    title: 'Automate Everything: How to Schedule AI Tasks with OpenClaw Cronjobs (2026 Guide)',
    excerpt: 'Master AI automation with OpenClaw cronjobs. Step-by-step guide to scheduling reports, monitoring, data collection, and content generation with 20+ working code examples.',
    date: 'March 10, 2026',
    dateObj: new Date('2026-03-10'),
    category: 'AI Automation',
    readTime: '18 min read',
    featured: true,
  },
  {
    id: 3,
    slug: 'openclaw-setup-guide-skills-subagents-plugins',
    title: 'Complete OpenClaw Setup Guide: Essential Skills, Subagents & Plugins (2026)',
    excerpt: 'Complete OpenClaw setup walkthrough: install essential skills, configure coding & general subagents, set up must-have plugins, and avoid common pitfalls. Includes CLI commands, config examples, and verification checklist.',
    date: 'March 10, 2026',
    dateObj: new Date('2026-03-10'),
    category: 'OpenClaw',
    readTime: '22 min read',
    featured: true,
  },
]

// Sort posts by date (newest first) - automatic, no manual ordering needed
export const getLatestPost = () => {
  const sorted = [...blogPosts].sort((a, b) => b.dateObj - a.dateObj)
  return sorted[0]
}

export const getAllPosts = () => {
  return [...blogPosts].sort((a, b) => b.dateObj - a.dateObj)
}
