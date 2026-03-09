import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import BlogPosts from './pages/BlogPosts'
import BlogPost from './pages/BlogPost'
import ProgrammingStuff from './pages/ProgrammingStuff'
import Plugins from './pages/Plugins'
import Skills from './pages/Skills'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog-posts" element={<BlogPosts />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="programming-stuff" element={<ProgrammingStuff />} />
          <Route path="plugins" element={<Plugins />} />
          <Route path="skills" element={<Skills />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
