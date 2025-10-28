import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import NewsList from './components/NewsList'
import ThemeToggle from './components/ThemeToggle'
import Pagination from './components/Pagination'

const PAGE_SIZE = 12 // Reverted to 12 as /everything endpoint has a limit for free tier

export default function App() {
  const [query, setQuery] = useState('latest')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [category, setCategory] = useState('general')
  
  useEffect(() => {
    fetchArticles()
  }, [query, page, category])

  async function fetchArticles() {
    setLoading(true)
    setError(null)
    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY
      if (!apiKey) throw new Error('No API key found. Add VITE_NEWS_API_KEY in .env')
      const q = encodeURIComponent(query || 'latest')
                  let url;
      // Use 'everything' endpoint for keyword search, 'top-headlines' for category browsing
      if (query && query !== 'latest') {
        url = `https://newsapi.org/v2/everything?q=${q}&pageSize=${PAGE_SIZE}&page=${page}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
      } else {
        url = `https://newsapi.org/v2/top-headlines?category=${category}&pageSize=${PAGE_SIZE}&page=${page}&language=en&apiKey=${apiKey}`;
      }
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setArticles(data.articles || [])
      setTotalResults(data.totalResults || 0)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="max-w-5xl mx-auto p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">News Feed</h1>
        <div className="flex items-center gap-3">
          <select value={category} onChange={(e) => { setCategory(e.target.value); setQuery('latest'); setPage(1); }} className="bg-white dark:bg-gray-800 border rounded p-2">
            <option value="general">General</option>
            <option value="technology">Technology</option>
            <option value="business">Business</option>
            <option value="sports">Sports</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="entertainment">Entertainment</option>
          </select>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4">
        <SearchBar onSearch={(q) => { setQuery(q); setCategory('general'); setPage(1); }} />
        {loading && <p className="mt-6">Loading...</p>}
        {error && <p className="mt-6 text-red-500">Something went wrong: {error}</p>}
        {!loading && !error && <NewsList articles={articles} />}
        <Pagination
          page={page}
          setPage={setPage}
          pageSize={PAGE_SIZE}
          totalResults={totalResults}
        />
      </main>
    </div>
  )
}
