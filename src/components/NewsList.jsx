import React from 'react'
import NewsCard from './NewsCard'

export default function NewsList({ articles }) {
  if (!articles || articles.length === 0) {
    return <p className="mt-6">No articles found.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      {articles.map((a, idx) => <NewsCard key={idx} article={a} />)}
    </div>
  )
}
