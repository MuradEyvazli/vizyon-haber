import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import TopBar from './app/components/TopBar'
import BottomNav from './app/components/BottomNav'
import Home from './app/routes/Home'
import Trends from './app/routes/Trends'
import Video from './app/routes/Video'
import NewsDetail from './app/routes/NewsDetail'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TopBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/video" element={<Video />} />
        <Route path="/news/:slug" element={<NewsDetail />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  </React.StrictMode>,
)
