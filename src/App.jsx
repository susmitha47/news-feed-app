import React, { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import NewsList from './components/NewsList'
import ThemeToggle from './components/ThemeToggle'
import Pagination from './components/Pagination'

const PAGE_SIZE = 10 // Number of articles to fetch per page

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

  // Add a small delay to prevent rate limiting
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

  // GNews API categories
  const gnewsCategories = {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'health': 'health',
    'sports': 'sports',
    'science': 'science',
    'entertainment': 'entertainment'
  };

  async function fetchArticles() {
    setLoading(true)
    setError(null)
    try {
      const apiKey = import.meta.env.VITE_NEWS_API_KEY
      if (!apiKey) throw new Error('No API key found. Add VITE_NEWS_API_KEY in .env')
      
      // Add a small delay between requests
      await delay(1000);
      
      let url;
      const categoryParam = gnewsCategories[category] || 'general';
      
      // GNews API endpoint
      if (query && query !== 'latest') {
        // For search
        url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&apikey=${apiKey}&page=${page}&max=${PAGE_SIZE}&lang=en`;
      } else {
        // For category-based fetching
        url = `https://gnews.io/api/v4/top-headlines?category=${categoryParam}&apikey=${apiKey}&page=${page}&max=${PAGE_SIZE}&lang=en`;
      }
      
      const res = await fetch(url);
      
      if (res.status === 429) {
        throw new Error('API rate limit exceeded. You might be using the free tier which has a limit of 100 requests per day.');
      }
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch news. Please check your API key and try again.');
      }
      
      const data = await res.json();
      
      // Map GNews API response to match the expected format
      const formattedArticles = (data.articles || []).map(article => ({
        ...article,
        title: article.title || 'No title',
        description: article.description || '',
        url: article.url || '#',
        urlToImage: article.image || article.urlToImage || '',
        publishedAt: article.publishedAt || new Date().toISOString(),
        source: {
          name: article.source?.name || 'Unknown source'
        }
      }));
      
      setArticles(formattedArticles)
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
        {error && (
        <div className="max-w-5xl mx-auto p-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {error}
                  {error.includes('rate limit') && (
                    <span className="block mt-2">
                      The free tier of NewsData.io has limited requests. Please wait a minute and try again.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}  
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
